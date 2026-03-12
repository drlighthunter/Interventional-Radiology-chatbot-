import { GoogleGenAI, Modality } from "@google/genai";

const VOICE_MAP: Record<string, string> = {
  en: 'Zephyr',
  hi: 'Kore',
  kn: 'Kore',
  ta: 'Kore',
  te: 'Kore',
  ml: 'Kore',
  or: 'Kore',
  bn: 'Kore',
  mr: 'Kore',
  gu: 'Kore'
};

export async function generateSpeech(text: string, language: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const voiceName = VOICE_MAP[language] || 'Zephyr';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

export function playAudio(base64Data: string) {
  const audioSrc = `data:audio/mp3;base64,${base64Data}`;
  const audio = new Audio(audioSrc);
  audio.play();
}
