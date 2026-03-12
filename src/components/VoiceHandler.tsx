import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { generateSpeech, playAudio } from '../services/ttsService';

interface VoiceHandlerProps {
  onSpeechEnd: (text: string) => void;
  lastResponse?: string;
  language: string;
}

export const VoiceHandler: React.FC<VoiceHandlerProps> = ({ onSpeechEnd, lastResponse, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [useNaturalVoice, setUseNaturalVoice] = useState(false);

  // Map app language codes to BCP 47 tags
  const langMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    or: 'or-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN'
  };

  const currentLang = langMap[language] || 'en-US';

  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italics
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[-*]\s/g, '') // Remove list bullets
      .replace(/[\n\r]+/g, ' ') // Replace newlines with spaces
      .replace(/[^\w\s\u0900-\u097F\u0C80-\u0CFF\u0B80-\u0BFF\u0C00-\u0C7F\u0D00-\u0D7F\u0B00-\u0B7F\u0980-\u09FF\u0A80-\u0AFF]/gi, ' ') // Keep alphanumeric and Indian scripts, replace others with space
      .trim();
  };

  const speak = useCallback(async (text: string) => {
    if (!speechEnabled || !text) return;
    
    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) return;

    if (useNaturalVoice) {
      setIsSpeaking(true);
      const audioData = await generateSpeech(cleanedText, language);
      if (audioData) {
        playAudio(audioData);
        // We don't have a reliable way to know when playAudio ends without more complex logic
        // but for now this is a good start.
        setTimeout(() => setIsSpeaking(false), 5000); 
      } else {
        // Fallback to local voice if cloud fails
        localSpeak(cleanedText);
      }
    } else {
      localSpeak(cleanedText);
    }
  }, [currentLang, speechEnabled, useNaturalVoice, language]);

  const localSpeak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (lastResponse) {
      speak(lastResponse);
    }
  }, [lastResponse, speak]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onSpeechEnd(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="flex gap-1 items-center bg-slate-100 p-1 rounded-full">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
        title={isListening ? 'Stop Listening' : 'Start Voice Input'}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      
      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

      <button
        onClick={() => {
          setSpeechEnabled(!speechEnabled);
          if (isSpeaking) window.speechSynthesis.cancel();
        }}
        className={`p-2 rounded-full transition-all ${speechEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
        title={speechEnabled ? 'Mute Voice Output' : 'Enable Voice Output'}
      >
        {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <button
        onClick={() => setUseNaturalVoice(!useNaturalVoice)}
        className={`p-2 rounded-full transition-all flex items-center gap-1 ${useNaturalVoice ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-500'}`}
        title={useNaturalVoice ? 'Using Natural Voice (Cloud)' : 'Using Local Voice'}
      >
        <Sparkles size={14} />
        {useNaturalVoice && <span className="text-[10px] font-bold pr-1">AI</span>}
      </button>
    </div>
  );
};
