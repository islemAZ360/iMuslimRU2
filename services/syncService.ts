import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

let backupTimeout: any = null;
const SYNC_DEBOUNCE_MS = 30000; // 30 seconds

/**
 * Collects all relevant data from localStorage
 */
const collectLocalData = () => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            // We can exclude keys if needed, but currently all are lightweight
            data[key] = localStorage.getItem(key);
        }
    }
    return data;
};

/**
 * Instantly forces a backup to Firebase (1 Write Operation)
 */
export const forceBackup = async (userId: string | undefined | null) => {
    if (!userId) return;
    
    try {
        const data = collectLocalData();
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            data: data,
            lastSync: new Date().toISOString()
        }, { merge: true });
        console.log('Smart Sync: Data backed up to Firebase');
    } catch (error) {
        console.error('Smart Sync: Failed to backup to Firebase', error);
    }
};

/**
 * Queues a backup. If called repeatedly, it resets the timer.
 * Prevents exceeding Firebase Free Tier write limits.
 */
export const queueBackup = (userId: string | undefined | null) => {
    if (!userId) return;
    
    if (backupTimeout) {
        clearTimeout(backupTimeout);
    }
    
    backupTimeout = setTimeout(() => {
        forceBackup(userId);
    }, SYNC_DEBOUNCE_MS);
};

/**
 * Restores all data from Firebase to localStorage (1 Read Operation)
 */
export const restoreBackup = async (userId: string | undefined | null): Promise<boolean> => {
    if (!userId) return false;
    
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const docData = docSnap.data();
            if (docData && docData.data) {
                const savedData = docData.data;
                let restoredCount = 0;
                for (const key in savedData) {
                    if (Object.prototype.hasOwnProperty.call(savedData, key)) {
                        const val = savedData[key];
                        if (val !== null) {
                            localStorage.setItem(key, val);
                            restoredCount++;
                        }
                    }
                }
                console.log(`Smart Sync: Restored ${restoredCount} keys from Firebase`);
                return true;
            }
        } else {
            console.log('Smart Sync: No previous backup found for user');
        }
    } catch (error) {
        console.error('Smart Sync: Failed to restore from Firebase', error);
    }
    return false;
};
