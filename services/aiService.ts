
import { GoogleGenAI } from "@google/genai";

// Use Gemini 3 Flash Preview for better responsiveness as per system instructions.
const MODEL_NAME = 'gemini-3-flash-preview';

export async function askGemini(prompt: string): Promise<string> {
  try {
    // Initializing with process.env.API_KEY directly as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are 'Jawir Assistant', a helpful assistant for the Jawir Designer community. You speak informal Indonesian (bahasa gaul/informal). Always finish your sentence with 'Wir'. Don't use any emojis. Be concise and professional but friendly.",
        temperature: 0.7,
      },
    });
    // Accessing .text property directly from GenerateContentResponse.
    return response.text || "Gagal memproses permintaan, Wir.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error koneksi, coba lagi nanti Wir.";
  }
}
