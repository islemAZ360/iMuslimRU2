/**
 * Unified Sheikh AI chat service.
 * Uses Gemini API for all conversations — text, images, and Islamic guidance.
 */
import { chat, type ChatTurn, hasValidApiKey } from './geminiService';
import type { ChatMessage, Conversation } from './chatMemoryService';
import { createConversation, appendMessage, makeMessage, compressImage, getConversation } from './chatMemoryService';

const MAX_TURNS = 6;

export interface ChatStatus {
    state: 'idle' | 'sending' | 'streaming' | 'error';
    message?: string;
}

export async function sendChatMessage(
    history: ChatMessage[],
    text: string,
    imageBase64: string | null,
    onToken?: (delta: string) => void,
    persona?: string
): Promise<string> {
    if (!hasValidApiKey()) {
        throw new Error('API_KEY_MISSING');
    }

    const turns = buildHistory(history);

    // Strip the data:image prefix if it's a full data URL
    let cleanImage = imageBase64;
    if (cleanImage && cleanImage.startsWith('data:')) {
        cleanImage = cleanImage.replace(/^data:image\/\w+;base64,/, '');
    }

    return chat(turns, text, cleanImage, onToken, true, persona);
}

const buildHistory = (history: ChatMessage[]): ChatTurn[] => {
    return history.slice(-MAX_TURNS * 2).map(m => ({
        role: m.role,
        text: m.image
            ? `[The user attached an image of a product — refer to your earlier analysis of it.] ${m.content}`
            : m.content,
        image: m.image || null,
    }));
};

export const formatScanResult = (parsed: any): string => {
    const lines = [
        `📌 Analysis Result`,
        `Product: ${parsed.name || 'Unknown'}`,
        `Status: ${parsed.status || 'Unknown'}`,
        `Reason: ${parsed.reason || '-'}`,
        parsed.origin ? `Origin: ${parsed.origin}` : null,
        parsed.ingredients?.length ? `Ingredients: ${parsed.ingredients.join(', ')}` : null,
        parsed.alternatives?.length ? `Alternatives: ${parsed.alternatives.join(', ')}` : null,
    ].filter(Boolean);
    return lines.join('\n');
};

/**
 * Creates a conversation from a finished product scan:
 * user turn = the product image, assistant turn = the analysis result.
 * The user can then continue discussing with Sheikh AI.
 */
export const createScanConversation = async (imageBase64: string, parsed: any, persona?: string): Promise<Conversation> => {
    const conv = createConversation('Halal Scanner', persona);
    const compressed = await compressImage(`data:image/jpeg;base64,${imageBase64}`);
    appendMessage(conv.id, makeMessage(
        'user',
        'Is this product halal or haram? Please analyze the image and explain the ruling with reasons.',
        compressed,
    ));
    appendMessage(conv.id, makeMessage('assistant', formatScanResult(parsed)));
    return getConversation(conv.id) || conv;
};
