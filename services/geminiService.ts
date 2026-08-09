import { SHEIKH_PERSONA } from './sheikhPersona';
import { DOCTOR_PERSONA } from './doctorPersona';

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
            if (profile.medications?.length) details.push(`Medications: ${profile.medications.join(', ')}`);
            
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
    persona?: string,
): Promise<string> {
    let actualPersona = SHEIKH_PERSONA;
    if (persona === 'Doctor AI') actualPersona = DOCTOR_PERSONA;
    else if (persona === 'Sheikh AI') actualPersona = SHEIKH_PERSONA;
    else if (persona) actualPersona = persona;

    const messages: any[] = [
        { role: 'system', content: getSystemInstructionWithProfile(actualPersona) }
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

export async function evaluateExcuse(missedItems: string[], lateItems: string[], excuse: string, language: string): Promise<{ isValid: boolean, fatwa: string }> {
    const prompt = `You are a wise, compassionate, yet firm Islamic scholar (Sheikh). 
The user has completely missed the following obligations: ${missedItems.length > 0 ? missedItems.join(', ') : 'None'}.
The user has prayed the following obligations late (after their time): ${lateItems.length > 0 ? lateItems.join(', ') : 'None'}.
Their excuse for this is: "${excuse}".
Evaluate if this is a valid Shari'i excuse (e.g., severe illness, deep sleep without intent, forgetting unintentionally) or an invalid excuse (e.g., laziness, playing games, intentional delay).
CRITICAL INSTRUCTION: You MUST start your response with EXACTLY the word [VALID] if the excuse is acceptable, or [INVALID] if it is unacceptable.
After that word, provide a beautiful, wise, and impactful fatwa and advice in ${language}. Include the exact "Kaffarah" (Expiation) or Qada (make-up) they must do based on whether it was valid or invalid. Remind them that delaying prayers is a sin even if made up, unless there is a valid excuse. Give actionable steps.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: 'system', content: getSystemInstructionWithProfile(SHEIKH_PERSONA) },
                { role: 'user', content: prompt }
            ],
            temperature: 0.4
        })
    });
    
    const data = await response.json();
    const result = data.choices[0]?.message?.content || '[INVALID] Sorry, I could not process this request.';
    
    const isValid = result.trim().startsWith('[VALID]');
    const fatwa = result.replace(/^\[(VALID|INVALID)\]\s*/i, '').trim();
    
    return { isValid, fatwa };
}

export async function evaluateRedemption(failureDetails: string, redemptionAction: string, language: string): Promise<{ isAccepted: boolean, message: string }> {
    const prompt = `You are a wise and compassionate Islamic mentor. The user had a failure: "${failureDetails}". 
To redeem themselves (kaffarah / repentance), they performed the following action: "${redemptionAction}".
Evaluate if this action is a sincere and sufficient good deed to help erase the spiritual mark of the failure (based on the principle "إن الحسنات يذهبن السيئات" - Good deeds wipe away bad ones).
CRITICAL INSTRUCTION: You MUST start your response with EXACTLY the word [ACCEPTED] if the action is good, or [REJECTED] if it's completely unrelated/insufficient.
After that word, provide a brief, uplifting spiritual message (1-2 sentences) in ${language} encouraging them.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: 'system', content: getSystemInstructionWithProfile(SHEIKH_PERSONA) },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5
        })
    });
    
    if (!response.ok) throw new Error("Failed to evaluate redemption");
    const data = await response.json();
    const text = data.choices[0]?.message?.content?.trim() || "[REJECTED] Failed to evaluate.";
    
    const isAccepted = text.startsWith("[ACCEPTED]");
    const message = text.replace(/^\[(ACCEPTED|REJECTED)\]\s*/i, "").trim();
    
    return { isAccepted, message };
}

export async function generateSpiritualReport(statsSummary: string, language: string): Promise<string> {
    const prompt = `You are a wise Islamic spiritual mentor. Review the user's weekly activity summary below and write a 2-paragraph highly personalized, uplifting, and deep spiritual report in ${language}.
Analyze their commitment, prayers, sunnahs, dhikr, water intake (Prophetic health), and their Ramadan performance (like Khatm progress, Hastening Iftar, Delaying Suhoor) if present. 
Highlight their strengths, gently advise on weaknesses, and mention the spiritual significance of what they accomplished.
Make it feel like a letter from a caring sheikh. Do not use generic lists, use eloquent flowing text.

Weekly Summary:
${statsSummary}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: 'system', content: getSystemInstructionWithProfile(SHEIKH_PERSONA) },
                { role: 'user', content: prompt }
            ],
            temperature: 0.6
        })
    });
    
    if (!response.ok) throw new Error("Failed to generate report");
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}
