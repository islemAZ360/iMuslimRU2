/**
 * Local memory for Sheikh AI conversations.
 * Conversations + images are stored on-device (localStorage), never sent to any server
 * except when the user explicitly uses the cloud engine.
 */

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    image?: string | null;
    createdAt: number;
}

export interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = 'sheikh_ai_conversations';

const uid = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const compressImage = (dataUrl: string, maxDim = 1024, quality = 0.8): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const w = Math.max(1, Math.round(img.width * scale));
            const h = Math.max(1, Math.round(img.height * scale));
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error('Canvas unavailable')); return; }
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Invalid image'));
        img.src = dataUrl;
    });

export const loadConversations = (): Conversation[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveConversations = (list: Conversation[]): void => {
    const trySave = (l: Conversation[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(l));
    };

    try {
        trySave(list);
        return;
    } catch {
        // Quota exceeded — free space progressively: strip images first, drop oldest chats last
    }

    for (let i = list.length - 1; i >= 0; i--) {
        for (const m of list[i].messages) m.image = null;
        try {
            trySave(list);
            return;
        } catch {
            // Not enough — strip the next (older) conversation too
        }
    }

    for (let i = list.length - 1; i >= 0; i--) {
        list.splice(i, 1);
        try {
            trySave(list);
            return;
        } catch {
            // Keep dropping
        }
    }

    try { localStorage.removeItem(STORAGE_KEY); } catch { }
};

export const getConversation = (id: string): Conversation | null =>
    loadConversations().find(c => c.id === id) || null;

export const createConversation = (title = 'New Chat'): Conversation => {
    const conv: Conversation = {
        id: uid(),
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    const list = loadConversations();
    list.unshift(conv);
    saveConversations(list);
    return conv;
};

export const deleteConversation = (id: string): void => {
    saveConversations(loadConversations().filter(c => c.id !== id));
};

export const makeMessage = (role: 'user' | 'assistant', content: string, image: string | null = null): ChatMessage => ({
    id: uid(),
    role,
    content,
    image,
    createdAt: Date.now(),
});

export const appendMessage = (id: string, message: ChatMessage): void => {
    const list = loadConversations();
    const conv = list.find(c => c.id === id);
    if (!conv) return;
    conv.messages.push(message);
    conv.updatedAt = Date.now();
    if (!conv.title || conv.title === 'New Chat') {
        const firstText = message.content.trim();
        conv.title = firstText
            ? firstText.slice(0, 40)
            : message.image ? 'Product Analysis' : 'New Chat';
    }
    saveConversations(list);
};
