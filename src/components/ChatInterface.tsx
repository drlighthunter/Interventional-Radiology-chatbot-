import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Copy, Check, Paperclip, FileText, Plus, Trash2, ShieldCheck, Volume2, Mail, Cpu, Smartphone } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Message, Language, PatientDemographics, Attachment } from '../types';
import { initLocalModel, getLocalChatResponse } from '../services/webLlmService';
import { VoiceHandler } from './VoiceHandler';
import { PatientProfile } from './PatientProfile';
import { useTTS } from '../services/ttsService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import emailjs from '@emailjs/browser';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-md transition-colors"
      title="Copy response"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [demographics, setDemographics] = useState<PatientDemographics>({});
  const [showProfile, setShowProfile] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local AI State
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState('');

  const [useCloudFallback, setUseCloudFallback] = useState(false);

  const tts = useTTS(language);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
    { code: 'or', name: 'Oriya (ଓଡ଼ିଆ)' },
    { code: 'bn', name: 'Bangla (বাংলা)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  ];

  useEffect(() => {
    const version = 'v4';
    if (localStorage.getItem('appVersion') !== version) {
      localStorage.setItem('appVersion', version);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDemographics(prev => ({
            ...prev,
            latLng: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const initializeModel = async () => {
    if (isModelReady) return true;
    setModelLoading(true);
    setModelProgress('Initializing democratic AI model (downloading ~350MB once)...');
    try {
      console.log("Starting local model initialization with Transformers.js (Qwen1.5-0.5B)");
      await initLocalModel((progress) => {
        console.log("Model Progress:", progress.text);
        setModelProgress(progress.text);
      });
      setIsModelReady(true);
      console.log("Local model initialized successfully.");
      return true;
    } catch (error) {
      console.error("Failed to load local model:", error);
      // Silently fallback to cloud instead of showing an intrusive alert
      setUseCloudFallback(true);
      return false;
    } finally {
      setModelLoading(false);
      setModelProgress('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (text: string, overrideAttachments?: Attachment[]) => {
    const currentAttachments = overrideAttachments || attachments;
    if ((!text.trim() && currentAttachments.length === 0) || isLoading) return;

    // Unlock audio context on user interaction
    if (tts.speechEnabled) {
      if (tts.useNaturalVoice) {
        const audio = new Audio("data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        audio.volume = 0;
        audio.play().catch(() => {});
      } else if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
      }
    }

    const userMessage: Message = { 
      role: 'user', 
      text,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      if (!isModelReady && !useCloudFallback) {
        const ready = await initializeModel();
        if (!ready) {
          setUseCloudFallback(true);
          // Don't return, proceed to getLocalChatResponse which will use Gemini fallback
        }
      }

      const response = await getLocalChatResponse(newMessages, language, demographics);
      
      const botMessage: Message = { role: 'model', text: response || 'Sorry, I could not process that.' };
      setMessages(prev => [...prev, botMessage]);

      // Speak the response
      tts.speak(botMessage.text);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsuranceJustification = () => {
    const details = demographics.procedure 
      ? `for the planned procedure: ${demographics.procedure}`
      : "for an Interventional Radiology procedure";
    
    const context = `
Patient Details:
- Age/Gender: ${demographics.age || 'N/A'} / ${demographics.gender || 'N/A'}
- Diagnosis: ${demographics.diagnosis || 'N/A'}
- Symptoms: ${demographics.symptoms || 'N/A'}
- Medical History: ${demographics.history || 'N/A'}
- Medications: ${demographics.medications || 'N/A'}
- Allergies: ${demographics.allergies || 'N/A'}

Please generate a formal, professional insurance justification letter ${details}. 
The letter should emphasize why this minimally invasive IR procedure is medically necessary compared to traditional surgery, 
citing the patient's specific symptoms and history provided above. 
Use a standard medical letter format.
`.trim();

    handleSend(context);
  };

  const downloadTranscript = () => {
    if (messages.length === 0) return;
    const transcript = messages.map(m => `${m.role === 'user' ? 'Patient' : 'AI Assistant'}: ${m.text}`).join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IR_Guide_Transcript_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const emailTranscript = async () => {
    if (messages.length === 0) return;
    
    // Note: To make this work in production, you need to sign up at emailjs.com
    // and replace these with your actual Service ID, Template ID, and Public Key.
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    if (SERVICE_ID === 'YOUR_SERVICE_ID') {
      alert("EmailJS is integrated but needs configuration! Please add your Service ID, Template ID, and Public Key in ChatInterface.tsx to enable email sending.");
      return;
    }

    const transcript = messages.map(m => `${m.role === 'user' ? 'Patient' : 'AI Assistant'}: ${m.text}`).join('\n\n');
    
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: 'patient@example.com', // You can prompt the user for their email
        message: transcript,
        reply_to: 'noreply@irchatbot.com',
      }, PUBLIC_KEY);
      alert('Transcript emailed successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please check console for details.');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 text-slate-800 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-sky-50 text-sky-600 p-2 rounded-xl">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight text-slate-800">IR Patient Guide</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">AI Medical Assistant</p>
              <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded-md font-medium">Patient Friendly</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border",
            isModelReady 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : useCloudFallback
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            {useCloudFallback ? <Bot size={14} /> : <Smartphone size={14} />}
            <span className="hidden sm:inline">
              {isModelReady 
                ? '100% Local AI Ready' 
                : useCloudFallback 
                  ? 'Cloud AI Fallback Active' 
                  : '100% Local AI (Offline)'}
            </span>
            {(isModelReady || useCloudFallback) && (
              <button 
                onClick={() => {
                  setIsModelReady(false);
                  setUseCloudFallback(false);
                  initializeModel();
                }}
                className={cn(
                  "ml-1 p-0.5 rounded transition-colors",
                  isModelReady ? "hover:bg-emerald-100" : "hover:bg-blue-100"
                )}
                title="Reload AI Model"
              >
                <Plus size={12} className="rotate-45" />
              </button>
            )}
          </div>
          
          {messages.length > 0 && (
            <>
              <button
                onClick={downloadTranscript}
                className="text-xs text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1"
                title="Download Transcript"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={emailTranscript}
                className="text-xs text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1"
                title="Email Transcript"
              >
                <Mail size={14} />
                <span className="hidden sm:inline">Email</span>
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  tts.stop();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                title="Clear Chat"
              >
                Clear Chat
              </button>
            </>
          )}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showProfile ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-800"
            )}
            title="Patient Profile"
          >
            <User size={20} />
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-100 text-slate-700 text-sm font-sans border-none rounded px-2 py-1 focus:ring-2 focus:ring-sky-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} className="font-sans">{lang.name}</option>
            ))}
          </select>
        </div>
      </header>

      {showProfile && (
        <PatientProfile 
          demographics={demographics} 
          onChange={setDemographics} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {modelProgress && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-mono">{modelProgress}</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {demographics.procedure && messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-sky-600" />
              <h3 className="font-semibold text-sky-900 text-sm">Procedure Guide: {demographics.procedure}</h3>
            </div>
            <p className="text-xs text-sky-700 mb-3">
              I've tailored my knowledge to help you with your upcoming {demographics.procedure}. 
              You can ask about preparation, what happens during the procedure, or recovery.
            </p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSend(`Tell me about the preparation for ${demographics.procedure}`)}
                className="text-[10px] bg-white text-sky-700 px-2 py-1 rounded-md border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Preparation
              </button>
              <button 
                onClick={() => handleSend(`What are the risks and benefits of ${demographics.procedure}?`)}
                className="text-[10px] bg-white text-sky-700 px-2 py-1 rounded-md border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Risks & Benefits
              </button>
              <button 
                onClick={() => handleSend(`How long is the recovery for ${demographics.procedure}?`)}
                className="text-[10px] bg-white text-sky-700 px-2 py-1 rounded-md border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Recovery
              </button>
            </div>
          </motion.div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-500">
            <Bot size={48} className="text-slate-300" />
            <div>
              <p className="text-lg font-medium">Welcome to the IR Patient Information Portal</p>
              <p className="text-sm max-w-md">Ask me about symptoms, interventional radiology procedures, or pre/post-op care in your preferred language.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {[
                "I need a biopsy for a lump, what should I expect?",
                "My legs feel heavy and I have varicose veins",
                "I have frequent urination due to BPH",
                "I have heavy bleeding and pain from fibroids",
                "How is internal bleeding treated without surgery?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="text-left p-3 text-sm bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
              <button
                onClick={generateInsuranceJustification}
                className="text-left p-3 text-sm bg-sky-50 border border-sky-100 rounded-xl hover:border-sky-500 hover:bg-sky-100 transition-all flex items-center gap-2 group shadow-sm"
              >
                <ShieldCheck size={16} className="text-sky-600 group-hover:scale-110 transition-transform" />
                <span>Insurance Justification</span>
              </button>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-sky-100 text-sky-600" : "bg-slate-200 text-slate-600"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group",
                msg.role === 'user' 
                  ? "bg-sky-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
              )}>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1 text-[10px]">
                        {att.type.startsWith('image/') ? <Paperclip size={10} /> : <FileText size={10} />}
                        <span className="truncate max-w-[100px]">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-img:rounded-xl prose-img:shadow-md prose-img:w-full">
                  <Markdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline" {...props} />
                      )
                    }}
                  >
                    {msg.text}
                  </Markdown>
                </div>
                {msg.role === 'model' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => tts.speak(msg.text, true)}
                      className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-md transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                    <CopyButton text={msg.text} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Bot size={16} className="text-slate-400" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
              <Loader2 size={16} className="animate-spin text-sky-500" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2">
            {attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-100 rounded-lg pl-2 pr-1 py-1 text-xs text-slate-600 border border-slate-200">
                {att.type.startsWith('image/') ? <Paperclip size={12} /> : <FileText size={12} />}
                <span className="truncate max-w-[120px]">{att.name}</span>
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="p-1 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 bg-sky-50 text-sky-600 rounded-lg px-2 py-1 text-xs border border-sky-100 hover:bg-sky-100 transition-colors"
            >
              <Plus size={12} />
              <span>Add more</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <VoiceHandler 
              language={language} 
              onSpeechEnd={handleSend} 
              speechEnabled={tts.speechEnabled}
              setSpeechEnabled={tts.setSpeechEnabled}
              useNaturalVoice={tts.useNaturalVoice}
              setUseNaturalVoice={tts.setUseNaturalVoice}
              isSpeaking={tts.isSpeaking}
              stopSpeech={tts.stop}
            />
            <span className="text-[10px] text-slate-400">Speak your query or type below</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
              title="Upload reports (JPEG/PDF)"
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/jpeg,image/png,application/pdf"
              multiple
            />
            <button
              onClick={generateInsuranceJustification}
              className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
              title="Insurance Justification"
            >
              <ShieldCheck size={18} />
            </button>
          </div>
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="bg-sky-600 text-white p-3 rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Disclaimer: This AI provides information only and is not medical advice. Consult a specialist for diagnosis.
        </p>
      </div>
    </div>
  );
};
