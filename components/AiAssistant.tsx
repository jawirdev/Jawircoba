
import React, { useState, useRef, useEffect } from 'react';
import { askGemini } from '../services/aiService';
import { Icons } from '../constants';
import { isToxic } from '../utils';

interface AiAssistantProps {
  onToxic: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onToxic }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Halo Wir. Saya Jawir Assistant. Ada hal teknis desain atau pertanyaan yang ingin kita bahas hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) displayRef.current.scrollTop = displayRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    const txt = input.trim();
    if (!txt || loading) return;

    if (isToxic(txt)) {
      onToxic();
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    setInput('');
    setLoading(true);

    const response = await askGemini(txt);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-8 pr-4 pb-12">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10 ${
              m.role === 'user' ? 'bg-white/5 text-white' : 'bg-brand-blue/10 text-brand-blue'
            }`}>
              {m.role === 'user' ? <Icons.User /> : <Icons.Bot />}
            </div>
            <div className={`flex-1 text-sm leading-relaxed ${m.role === 'user' ? 'text-right text-white font-medium' : 'text-gray-300'}`}>
              <div className="inline-block whitespace-pre-wrap max-w-full">
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-6">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center border border-white/10 animate-pulse">
              <Icons.Bot />
            </div>
            <div className="flex items-center gap-1.5 h-8">
              <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-brand-dark pt-6 pb-2">
        <div className="glass-card rounded-2xl p-2 flex items-center gap-2 group focus-within:border-brand-blue/50 transition-all shadow-2xl">
          <input 
            type="text" 
            placeholder="Ketik pertanyaan kamu Wir..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-gray-600"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center bg-brand-blue text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-30"
          >
            <Icons.Send />
          </button>
        </div>
        <p className="text-center text-[9px] text-gray-700 mt-4 uppercase tracking-[2px] font-oswald">
          Jawir Assistant can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;
