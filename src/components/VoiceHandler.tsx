import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';

interface VoiceHandlerProps {
  onSpeechEnd: (text: string) => void;
  language: string;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  useNaturalVoice: boolean;
  setUseNaturalVoice: (enabled: boolean) => void;
  isSpeaking: boolean;
  stopSpeech: () => void;
}

export const VoiceHandler: React.FC<VoiceHandlerProps> = ({ 
  onSpeechEnd, language, speechEnabled, setSpeechEnabled, useNaturalVoice, setUseNaturalVoice, isSpeaking, stopSpeech 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [useLocalAI, setUseLocalAI] = useState(false);
  const [workerStatus, setWorkerStatus] = useState<string>('idle');
  
  const workerRef = useRef<Worker | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const langMap: Record<string, string> = {
    en: 'en-US', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN',
    ml: 'ml-IN', or: 'or-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN'
  };
  const currentLang = langMap[language] || 'en-US';

  useEffect(() => {
    if (useLocalAI && !workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/whisperWorker.ts?v=2', import.meta.url), { type: 'module' });
      workerRef.current.onmessage = (e) => {
        setWorkerStatus(e.data.status);
        if (e.data.status === 'complete') {
          onSpeechEnd(e.data.text);
          setIsListening(false);
        } else if (e.data.status === 'error') {
          console.error('Whisper error:', e.data.error);
          setIsListening(false);
        }
      };
      workerRef.current.postMessage({ type: 'load' });
    }
    return () => {
      // Cleanup worker on unmount if needed, but usually we keep it alive for performance
    };
  }, [useLocalAI, onSpeechEnd]);

  const toggleListening = async () => {
    if (isListening) {
      if (useLocalAI && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      } else {
        setIsListening(false);
      }
      return;
    }

    if (useLocalAI) {
      if (workerStatus !== 'ready' && workerStatus !== 'complete') {
        alert('Local AI model is still loading. Please wait a moment.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new AudioContext({ sampleRate: 16000 });
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const audioData = audioBuffer.getChannelData(0); // Float32Array at 16kHz
          
          if (workerRef.current) {
            workerRef.current.postMessage({ type: 'transcribe', audioData });
          }
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error('Microphone error:', err);
        alert('Could not access microphone.');
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser. Please try Chrome or Edge, or enable Local AI Transcription.');
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
    }
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
          if (isSpeaking) stopSpeech();
        }}
        className={`p-2 rounded-full transition-all ${speechEnabled ? 'text-sky-600' : 'text-slate-400'} ${isSpeaking ? 'animate-pulse bg-sky-100' : ''}`}
        title={speechEnabled ? 'Mute Voice Output' : 'Enable Voice Output'}
      >
        {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <button
        onClick={() => setUseNaturalVoice(!useNaturalVoice)}
        className={`p-2 rounded-full transition-all flex items-center gap-1 ${useNaturalVoice ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-sky-500'}`}
        title={useNaturalVoice ? 'Using Natural Voice (Cloud)' : 'Using Local Voice'}
      >
        <Sparkles size={14} />
        {useNaturalVoice && <span className="text-[10px] font-bold pr-1">AI</span>}
      </button>

      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

      <button
        onClick={() => setUseLocalAI(!useLocalAI)}
        className={`p-2 rounded-full transition-all flex items-center gap-1 ${useLocalAI ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-indigo-500'}`}
        title={useLocalAI ? 'Using Local AI Transcription (Private)' : 'Use Local AI Transcription'}
      >
        <Brain size={14} />
        {useLocalAI && <span className="text-[10px] font-bold pr-1">{workerStatus === 'loading' ? 'Load...' : 'Local'}</span>}
      </button>
    </div>
  );
};
