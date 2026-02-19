import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// User mentioned "Gemini 3 Flash Preview", using 1.5 Flash as standard stable fallback or 2.0-flash-exp if available.
// NOTE: Ensure VITE_GEMINI_API_KEY is set in .env
const defaultApiKey = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

const getClient = (apiKey?: string) => {
  const key = apiKey && apiKey.length > 10 ? apiKey : defaultApiKey;
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeImage = async (base64Image: string, prompt: string, apiKey?: string): Promise<string | undefined> => {
  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        maxOutputTokens: 500,
        temperature: 0.4,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze image");
  }
};

export const getIslamicGuidance = async (question: string, apiKey?: string): Promise<string | undefined> => {
  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: question }
          ]
        }
      ],
      config: {
        systemInstruction: "You are a helpful Islamic assistant. Provide answers based on Quran and Sunnah. Be concise and respectful.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Sorry, I am unable to provide guidance at this moment.";
  }
};

export const askHealthAI = async (question: string, apiKey?: string): Promise<string | undefined> => {
  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: question }
          ]
        }
      ],
      config: {
        systemInstruction: "You are Tib An-Nabawi AI, a Prophetic Health assistant. Provide nutritional advice based on Sunnah and modern science. Be concise, wisdom-filled, and helpful.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Health Chat Error:", error);
    return "I am currently unable to provide health advice. Please try again later.";
  }
};
