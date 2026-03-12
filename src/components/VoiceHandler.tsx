import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceHandlerProps {
  onSpeechEnd: (text: string) => void;
  lastResponse?: string;
  language: string;
}

export const VoiceHandler: React.FC<VoiceHandlerProps> = ({ onSpeechEnd, lastResponse, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Map app language codes to BCP 47 tags
  const langMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN'
  };

  const currentLang = langMap[language] || 'en-US';

  const speak = useCallback((text: string) => {
    if (!speechEnabled || !text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [currentLang, speechEnabled]);

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
    <div className="flex gap-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        title={isListening ? 'Stop Listening' : 'Start Voice Input'}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <button
        onClick={() => {
          setSpeechEnabled(!speechEnabled);
          if (isSpeaking) window.speechSynthesis.cancel();
        }}
        className={`p-2 rounded-full transition-colors ${speechEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
        title={speechEnabled ? 'Mute Voice Output' : 'Enable Voice Output'}
      >
        {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};
