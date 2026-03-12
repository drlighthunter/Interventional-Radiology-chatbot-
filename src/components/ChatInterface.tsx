import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Message, Language } from '../types';
import { getChatResponse, logAnalytics } from '../services/geminiService';
import { VoiceHandler } from './VoiceHandler';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).substring(7));
  const scrollRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (à¤¹à¤¿à¤¨à¥à¤¦à¥€)' },
    { code: 'kn', name: 'Kannada (à²•à²¨à¥à²¨à²¡)' },
    { code: 'ta', name: 'Tamil (à®¤à®®à®¿à®´à¯)' },
    { code: 'te', name: 'Telugu (à°¤à±†à°²à±à°—à±)' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(newMessages, language);
      const botMessage: Message = { role: 'model', text: response || 'Sorry, I could not process that.' };
      setMessages(prev => [...prev, botMessage]);

      // Log analytics
      logAnalytics({
        userId,
        language,
        rawMessage: text,
        // The model could potentially return structured data if we asked, 
        // but for now we log the raw interaction for the developer to "scrape"
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">IR Patient Guide</h1>
            <p className="text-xs text-slate-400">Multilingual IR Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-800 text-sm border-none rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <VoiceHandler 
            language={language} 
            onSpeechEnd={handleSend} 
            lastResponse={messages[messages.length - 1]?.role === 'model' ? messages[messages.length - 1].text : undefined}
          />
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-500">
            <Bot size={48} className="text-slate-300" />
            <div>
              <p className="text-lg font-medium">Welcome to the IR Patient Information Portal</p>
              <p className="text-sm max-w-md">Ask me about symptoms, interventional radiology procedures, or pre/post-op care in your preferred language.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {[
                "What is an angioplasty?",
                "I have leg pain when walking",
                "Pre-op instructions for biopsy",
                "Post-op care for embolization"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="text-left p-3 text-sm bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                >
                  {suggestion}
                </button>
              ))}
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
                msg.role === 'user' ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-600"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-emerald-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Bot size={16} className="text-slate-400" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-500" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
