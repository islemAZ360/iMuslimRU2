import { SHEIKH_PERSONA } from './sheikhPersona';

/**
 * Unified AI Service for iMuslim using OpenRouter API (via fetch).
 */

const ENV_KEY = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || "";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

/** Returns the active API key: profile key > dedicated key > env > empty. */
export const getApiKey = (): string => {
    try {
        const profileStr = localStorage.getItem('userProfile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            if (profile.apiKey && profile.apiKey.length > 10) return profile.apiKey;
        }
        const saved = localStorage.getItem('gemini_api_key');
        if (saved && saved.length > 10) return saved;
    } catch { /* noop */ }
    return ENV_KEY;
};

export const setApiKey = (key: string): void => {
    try {
        localStorage.setItem('gemini_api_key', key);
        const profileStr = localStorage.getItem('userProfile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            profile.apiKey = key;
            localStorage.setItem('userProfile', JSON.stringify(profile));
        }
    } catch { /* noop */ }
};

export const hasValidApiKey = (): boolean => getApiKey().length > 10;

const getHeaders = () => ({
    "Authorization": `Bearer ${getApiKey()}`,
    "HTTP-Referer": window.location.href,
    "X-Title": "iMuslim App",
    "Content-Type": "application/json"
});

const getSystemInstructionWithProfile = (baseInstruction: string): string => {
    let instruction = baseInstruction;
    try {
        const profileStr = localStorage.getItem('userProfile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            const details = [];
            if (profile.name) details.push(`Name: ${profile.name}`);
            if (profile.gender) details.push(`Gender: ${profile.gender === 'male' ? 'Male (ذكر)' : 'Female (أنثى)'}`);
            if (profile.height) details.push(`Height: ${profile.height} cm`);
            if (profile.weight) details.push(`Weight: ${profile.weight} kg`);
            if (profile.allergies?.length) details.push(`Allergies: ${profile.allergies.join(', ')}`);
            if (profile.diseases?.length) details.push(`Chronic Diseases: ${profile.diseases.join(', ')}`);
            
            if (details.length > 0) {
                instruction += "\n\nIMPORTANT CONTEXT ABOUT THE USER:\n" + details.join('\n');
                instruction += "\nPlease use this information to personalize your responses. If the gender is provided, address the user accordingly (e.g., in Arabic use appropriate pronouns/titles).";
            }
        }
    } catch { /* noop */ }
    return instruction;
};

// ---------------------------------------------------------------------------
// Chat (Sheikh AI) — with streaming, images, and conversation history
// ---------------------------------------------------------------------------

export interface ChatTurn {
    role: 'user' | 'assistant';
    text: string;
    image?: string | null;
}

export async function chat(
    history: ChatTurn[],
    text: string,
    imageBase64: string | null,
    onToken?: (delta: string) => void,
    useSearch = true,
): Promise<string> {
    const messages: any[] = [
        { role: 'system', content: getSystemInstructionWithProfile(SHEIKH_PERSONA) }
    ];

    // Build history
    for (const turn of history.slice(-12)) {
        if (turn.role === 'user') {
            const content: any[] = [];
            if (turn.text) content.push({ type: 'text', text: turn.text });
            if (turn.image) {
                const url = turn.image.startsWith('data:') ? turn.image : `data:image/jpeg;base64,${turn.image}`;
                content.push({ type: 'image_url', image_url: { url } });
            }
            messages.push({ role: 'user', content });
        } else {
            messages.push({ role: 'assistant', content: turn.text || '' });
        }
    }

    // Current message
    const currentContent: any[] = [];
    if (imageBase64) {
        const url = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
        currentContent.push({ type: 'image_url', image_url: { url } });
    }
    currentContent.push({ type: 'text', text: text || 'ما هذا المنتج؟ هل هو حلال؟' });
    messages.push({ role: 'user', content: currentContent });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    if (!response.body) throw new Error("No response body");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let full = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(line.slice(6));
                    const delta = data.choices[0]?.delta?.content || '';
                    if (delta) {
                        full += delta;
                        onToken?.(delta);
                    }
                } catch (e) {
                    // Ignore parse errors on partial chunks
                }
            }
        }
    }
    return full.trim();
}

// ---------------------------------------------------------------------------
// Image analysis (Halal Scanner)
// ---------------------------------------------------------------------------

export async function analyzeImage(
    base64Image: string,
    prompt: string,
): Promise<string> {
    const url = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url } },
                    { type: 'text', text: prompt }
                ]
            }],
            temperature: 0.3,
            max_tokens: 600,
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

// ---------------------------------------------------------------------------
// Islamic guidance & Health AI
// ---------------------------------------------------------------------------

export async function getIslamicGuidance(question: string): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: 'system', content: getSystemInstructionWithProfile(SHEIKH_PERSONA) },
                { role: 'user', content: question }
            ]
        })
    });
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not respond. Please try again.';
}

export async function askHealthAI(question: string): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: 'system', content: getSystemInstructionWithProfile("You are Tib An-Nabawi AI, a Prophetic Health assistant. Provide nutritional advice based on Sunnah and modern science. Be concise, wisdom-filled, and helpful. Answer in the user's language.") },
                { role: 'user', content: question }
            ]
        })
    });
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not respond at this time. Please try again.';
}
