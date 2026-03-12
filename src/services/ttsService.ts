import { useState, useCallback } from 'react';
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

let currentAudio: HTMLAudioElement | null = null;

export function playAudio(base64Data: string): Promise<void> {
  return new Promise((resolve) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    const audioSrc = `data:audio/mp3;base64,${base64Data}`;
    const audio = new Audio(audioSrc);
    currentAudio = audio;
    
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.play().catch(() => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    });
  });
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

export const cleanTextForSpeech = (text: string) => {
  return text
    .replace(/#{1,6}\s?/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italics
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[-*]\s/g, '') // Remove list bullets
    .replace(/[\n\r]+/g, ' ') // Replace newlines with spaces
    .replace(/[^\w\s.,?!'"\u0900-\u097F\u0C80-\u0CFF\u0B80-\u0BFF\u0C00-\u0C7F\u0D00-\u0D7F\u0B00-\u0B7F\u0980-\u09FF\u0A80-\u0AFF]/gi, ' ') // Keep alphanumeric, punctuation, and Indian scripts
    .trim();
};

export function useTTS(language: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [useNaturalVoice, setUseNaturalVoice] = useState(false);

  const langMap: Record<string, string> = {
    en: 'en-US', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN',
    ml: 'ml-IN', or: 'or-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN'
  };
  const currentLang = langMap[language] || 'en-US';

  const localSpeak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [currentLang]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    stopAudio();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, force: boolean = false) => {
    if (!force && (!speechEnabled || !text)) return;
    
    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) return;

    stop(); // Stop any currently playing audio

    if (useNaturalVoice) {
      setIsSpeaking(true);
      const audioData = await generateSpeech(cleanedText, language);
      if (audioData) {
        await playAudio(audioData);
        setIsSpeaking(false);
      } else {
        localSpeak(cleanedText);
      }
    } else {
      localSpeak(cleanedText);
    }
  }, [language, speechEnabled, useNaturalVoice, localSpeak, stop]);

  return { speak, stop, isSpeaking, speechEnabled, setSpeechEnabled, useNaturalVoice, setUseNaturalVoice };
}
