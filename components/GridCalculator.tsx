
import React, { useState } from 'react';

const GridCalculator: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(1);
  const baseW = 1080;
  const baseH = 1440;

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <div className="text-center">
        <h3 className="font-oswald text-2xl font-bold text-white mb-2 uppercase tracking-wide">Production Grid Calculator</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Ratio 4:5 Portrait Workflow</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest block">Column (Width)</label>
          <input 
            type="number" 
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-3xl font-oswald text-brand-green outline-none focus:border-brand-green/30 text-center"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest block">Rows (Height)</label>
          <input 
            type="number" 
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-3xl font-oswald text-white outline-none focus:border-white/20 text-center"
          />
        </div>
      </div>

      <div className="glass-card p-10 rounded-3xl flex flex-col items-center border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-brand-blue opacity-50"></div>
        <span className="text-[10px] text-gray-600 font-oswald uppercase tracking-[5px] mb-6">Calculated Canvas Size</span>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-oswald font-bold text-white tracking-tighter">{baseW * cols}</div>
            <div className="text-[9px] text-brand-green font-oswald uppercase tracking-widest mt-2">Pixels Wide</div>
          </div>
          <div className="text-gray-800 text-3xl font-light">×</div>
          <div className="text-center">
            <div className="text-5xl font-oswald font-bold text-white tracking-tighter">{baseH * rows}</div>
            <div className="text-[9px] text-gray-500 font-oswald uppercase tracking-widest mt-2">Pixels High</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-4 border border-white/5 rounded-xl bg-white/[0.02]">
        <div className="w-1 h-auto bg-brand-green/30 rounded-full"></div>
        <p className="text-[11px] text-gray-500 leading-relaxed italic">
          "Gunakan panduan (guides) Photoshop/Illustrator setiap {baseW}px horizontal untuk memastikan potongan carousel yang presisi Wir."
        </p>
      </div>
    </div>
  );
};

export default GridCalculator;
