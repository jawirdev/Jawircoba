
import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { ChatMessage } from '../types';
import { isToxic } from '../utils';

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<{u: string, c: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onChatsChange((msgs) => {
      const counts: Record<string, number> = {};
      msgs.forEach(m => {
        if (!isToxic(m.user)) {
          counts[m.user] = (counts[m.user] || 0) + 1;
        }
      });

      const sorted = Object.entries(counts)
        .map(([u, c]) => ({ u, c }))
        .sort((a, b) => b.c - a.c)
        .slice(0, 10);
      
      setLeaders(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
      <div className="text-center space-y-2">
        <h3 className="text-[10px] text-brand-green font-oswald uppercase tracking-[6px]">Engagement Rankings</h3>
        <p className="text-gray-500 text-xs">Top 10 most active members in Jawir community</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
             <p className="text-[10px] font-oswald text-gray-700 uppercase tracking-widest">No activity data Wir.</p>
          </div>
        ) : (
          leaders.map((leader, idx) => (
            <div 
              key={idx}
              className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-brand-green/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-oswald text-xl mr-5 ${
                idx === 0 ? 'bg-brand-green text-black shadow-[0_0_20px_rgba(93,255,142,0.3)]' : 
                idx === 1 ? 'bg-white/10 text-white' : 
                idx === 2 ? 'bg-orange-900/30 text-orange-500' : 'bg-black/40 text-gray-600'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-oswald text-base uppercase tracking-wider text-white group-hover:text-brand-green transition-colors">
                  {leader.u}
                </div>
                <div className="text-[8px] text-gray-600 font-oswald uppercase tracking-widest mt-0.5">Community Contributor</div>
              </div>
              <div className="text-right">
                <div className="font-oswald text-xl text-white leading-none">{leader.c}</div>
                <div className="text-[9px] text-brand-green font-oswald uppercase tracking-widest mt-1">Messages</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
