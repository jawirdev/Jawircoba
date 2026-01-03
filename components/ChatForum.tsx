
import React, { useState, useEffect, useRef } from 'react';
import { firebaseService } from '../services/firebaseService';
import { ChatMessage } from '../types';
import { Icons } from '../constants';
import { isToxic, formatTime, formatDate } from '../utils';

interface ChatForumProps {
  onToast: (msg: string) => void;
  onToxic: () => void;
  onVerify: (callback: (pass: string | null) => void) => void;
}

const ChatForum: React.FC<ChatForumProps> = ({ onToast, onToxic, onVerify }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = firebaseService.onChatsChange((msgs) => {
      setMessages(msgs.filter(m => !isToxic(m.msg) && !isToxic(m.user)));
      setTimeout(() => {
        if (displayRef.current) displayRef.current.scrollTop = displayRef.current.scrollHeight;
      }, 100);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    const u = username.trim();
    const m = msgInput.trim();
    if (!u) return onToast("Username Instagram Required");
    if (!m) return;

    if (isToxic(m) || isToxic(u)) {
      onToxic();
      return;
    }

    setIsSending(true);
    const finalUser = u.startsWith('@') ? u : `@${u}`;

    const checkRole = async (): Promise<'user' | 'developer'> => {
      const cleanUser = u.replace('@', '').toLowerCase();
      if (cleanUser === 'jawirdesigner' || cleanUser === 'jawirdesign') {
        return new Promise((resolve) => {
          onVerify((pass) => resolve(pass === 'jawirgila' ? 'developer' : 'user'));
        });
      }
      return 'user';
    };

    const role = await checkRole();

    try {
      await firebaseService.sendChatMessage({ user: finalUser, msg: m, time: Date.now(), role });
      setMsgInput('');
    } catch (e) {
      onToast("Network Error");
    } finally {
      setIsSending(false);
    }
  };

  let lastDateStr = '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-4">
        {messages.map((c) => {
          const dateStr = formatDate(c.time);
          const showDivider = dateStr !== lastDateStr;
          if (showDivider) lastDateStr = dateStr;

          return (
            <React.Fragment key={c.id}>
              {showDivider && (
                <div className="flex items-center gap-4 py-6">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-[9px] text-gray-700 font-oswald uppercase tracking-[3px]">{dateStr}</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
              )}
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-gray-600">
                  <Icons.User />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {c.role === 'developer' ? (
                      <span className="shiny-admin font-oswald text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                        {c.user} <Icons.Crown />
                      </span>
                    ) : (
                      <span className="text-brand-green font-oswald text-xs uppercase tracking-wider font-medium">
                        {c.user}
                      </span>
                    )}
                    <span className="text-[8px] text-gray-700 font-oswald uppercase">{formatTime(c.time)}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-2xl break-words">
                    {c.msg}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative md:w-48">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green font-oswald">@</span>
             <input 
               type="text" 
               placeholder="instagram"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full bg-black/40 border border-white/5 rounded-xl px-8 py-3 text-xs font-oswald tracking-widest uppercase focus:border-brand-green/30 outline-none transition-all"
             />
          </div>
          <div className="flex-1 flex gap-2">
            <input 
              placeholder="Tulis pesan kamu Wir..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-green/30 outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="px-6 bg-brand-green text-black rounded-xl font-oswald font-bold uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-30"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatForum;
