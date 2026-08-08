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

const LOCAL_STORAGE_KEY = 'imuslim_scan_history';

export const saveScanResult = async (item: Omit<ScannedItem, 'timestamp' | 'id'>) => {
    // Only skip if Unknown (like network errors)
    if (item.status === 'Unknown') return;

    try {
        const historyStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        let history: ScannedItem[] = historyStr ? JSON.parse(historyStr) : [];
        
        const newItem: ScannedItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now()
        };
        
        history.unshift(newItem);
        if (history.length > 50) history = history.slice(0, 50); // Keep last 50 scans
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Error saving scan result:", e);
    }
};

export const getScanHistory = async (): Promise<ScannedItem[]> => {
    try {
        const historyStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        return historyStr ? JSON.parse(historyStr) : [];
    } catch (e) {
        console.error("Error fetching history:", e);
        return [];
    }
};
