import { db } from './firebaseConfig';
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';

export interface ScannedItem {
    id?: string;
    name: string;
    status: 'Halal' | 'Haram' | 'Mushbooh' | 'Boycott' | 'Unknown';
    reason?: string;
    ingredients?: string[];
    origin?: string;
    timestamp: any;
}

const COLLECTION_NAME = 'scanned_products';

export const saveScanResult = async (item: Omit<ScannedItem, 'timestamp' | 'id'>) => {
    // Only save if Haram, Boycott, or Mushbooh
    if (item.status === 'Halal' || item.status === 'Unknown') return;

    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...item,
            timestamp: Timestamp.now()
        });
        console.log("Item saved to history:", item.name);
    } catch (e) {
        console.error("Error saving scan result:", e);
    }
};

export const getScanHistory = async (): Promise<ScannedItem[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ScannedItem));
    } catch (e) {
        console.error("Error fetching history:", e);
        return [];
    }
};
