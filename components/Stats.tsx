
import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { getTodayKey } from '../utils';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [activeRecap, setActiveRecap] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const now = new Date();
  const today = getTodayKey();
  const currentMonth = `${now.getMonth() + 1}-${now.getFullYear()}`;
  const currentYear = `${now.getFullYear()}`;

  useEffect(() => {
    const unsubscribe = firebaseService.onStatsChange((data) => {
      setStats(data);
    });
    return () => unsubscribe();
  }, []);

  const totalHits = stats.total?.count || 0;
  
  // Feature Popularity sorted by usage
  const features = Object.entries(stats.features || {})
    .map(([n, val]: any) => ({ n, c: val.count }))
    .sort((a, b) => b.c - a.c);

  const renderRecapList = () => {
    const data = viewData();
    const sortedEntries = Object.entries(data)
      .sort((a, b) => b[0].localeCompare(a[0])) // Urutan terbaru ke terlama
      .slice(0, 15);

    if (sortedEntries.length === 0) {
      return <div className="text-center py-10 text-[10px] text-gray-700 font-oswald uppercase tracking-widest">Belum ada rekapan data Wir.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {sortedEntries.map(([key, val]: any) => (
          <div key={key} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-green/20 transition-all group">
            <span className="text-[10px] font-oswald text-gray-500 uppercase tracking-widest">
              {key.replace(/-/g, ' / ')}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-oswald font-bold text-white group-hover:text-brand-green transition-colors">{val.visitors}</span>
              <span className="text-[8px] text-gray-600 font-oswald uppercase">Visits</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const viewData = () => {
    if (activeRecap === 'daily') return stats.daily || {};
    if (activeRecap === 'monthly') return stats.monthly || {};
    return stats.yearly || {};
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-slide-up">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-3xl flex flex-col justify-center border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green opacity-5 blur-[100px]" />
          <span className="text-[10px] text-brand-green font-oswald uppercase tracking-[6px] mb-4">Total Global Visits</span>
          <h2 className="text-7xl font-oswald font-bold text-white tracking-tighter leading-none">{totalHits}</h2>
          <p className="text-xs text-gray-500 mt-4 max-w-xs">Akumulasi kunjungan real-time dari seluruh pengguna Jawir Tools Wir.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <MiniStat label="Visits Today" value={stats.daily?.[today]?.visitors || 0} color="green" />
          <MiniStat label="This Month" value={stats.monthly?.[currentMonth]?.visitors || 0} color="white" />
          <MiniStat label="This Year" value={stats.yearly?.[currentYear]?.visitors || 0} color="blue" />
        </div>
      </div>

      {/* Recap Toggle */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-[11px] font-oswald text-gray-400 uppercase tracking-[4px]">Rekapan Detail</h3>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {(['daily', 'monthly', 'yearly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveRecap(mode)}
                className={`px-5 py-2 text-[9px] font-oswald uppercase tracking-widest rounded-lg transition-all ${
                  activeRecap === mode ? 'bg-brand-green text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        {renderRecapList()}
      </div>

      {/* Feature Usage Index */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-oswald text-gray-400 uppercase tracking-[4px]">Index Kepopuleran Fitur</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f: any, i) => {
            const percentage = (f.c / (features[0]?.c || 1)) * 100;
            return (
              <div key={f.n} className="relative group">
                <div className="flex justify-between items-end mb-2 px-1">
                  <span className="text-[10px] font-oswald text-white uppercase tracking-wider">{f.n}</span>
                  <span className="text-xs font-oswald text-brand-green">{f.c} <span className="text-[8px] text-gray-600 font-normal">KLIK</span></span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-brand-green opacity-50 group-hover:opacity-100 transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, color }: any) => {
  const colors: any = {
    green: 'text-brand-green border-brand-green/10',
    blue: 'text-brand-blue border-brand-blue/10',
    white: 'text-white border-white/10'
  };
  return (
    <div className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center border ${colors[color]}`}>
      <span className="text-2xl font-oswald font-bold">{value}</span>
      <span className="text-[8px] font-oswald uppercase tracking-[2px] mt-1 opacity-50">{label}</span>
    </div>
  );
};

export default Stats;
