
import React from 'react';
import { TabId } from '../types';
import { Icons } from '../constants';

interface HomeProps {
  onSwitch: (tab: TabId) => void;
}

const Home: React.FC<HomeProps> = ({ onSwitch }) => {
  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-oswald font-bold text-white mb-4 tracking-tight uppercase leading-none">
          Design Toolkit <span className="text-brand-green">Simplified.</span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
          Kumpulan alat bantu desainer untuk meningkatkan produktivitas dan koneksi komunitas dalam satu ekosistem yang bersih dan cepat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard 
          icon={<Icons.Chat />} 
          title="Community Forum" 
          desc="Ruang diskusi antar desainer Indonesia." 
          onClick={() => onSwitch('chat')} 
          accent="green"
        />
        <CategoryCard 
          icon={<Icons.Bot />} 
          title="Jawir Assistant" 
          desc="AI yang mengerti kebutuhan teknis desainmu." 
          onClick={() => onSwitch('ai')} 
          accent="blue"
        />
        <CategoryCard 
          icon={<Icons.Grid />} 
          title="Production Tools" 
          desc="Kalkulator grid dan generator QR instan." 
          onClick={() => onSwitch('grid')} 
          accent="white"
        />
      </div>

      <div className="pt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-[10px] font-oswald text-gray-600 uppercase tracking-[4px]">Data Summary</span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatMini label="Total Tools" value="08" />
          <StatMini label="Active User" value="1.2k" />
          <StatMini label="Avg. Response" value="0.2s" />
          <StatMini label="Uptime" value="99.9%" />
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon, title, desc, onClick, accent }: any) => {
  const accentColors: any = {
    green: 'group-hover:border-brand-green/30 group-hover:bg-brand-green/5',
    blue: 'group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5',
    white: 'group-hover:border-white/20 group-hover:bg-white/5'
  };

  return (
    <button 
      onClick={onClick}
      className={`group glass-card p-8 rounded-2xl text-left transition-all duration-300 ${accentColors[accent] || ''}`}
    >
      <div className="mb-6 p-3 w-fit rounded-lg bg-black/40 border border-white/5 transition-transform group-hover:scale-110">
        <span className={accent === 'green' ? 'text-brand-green' : accent === 'blue' ? 'text-brand-blue' : 'text-white'}>
          {icon}
        </span>
      </div>
      <h3 className="font-oswald text-lg font-bold text-white mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </button>
  );
};

const StatMini = ({ label, value }: any) => (
  <div className="glass-card p-4 rounded-xl text-center border-none">
    <div className="text-xl font-oswald font-bold text-white mb-1">{value}</div>
    <div className="text-[9px] text-gray-600 font-oswald uppercase tracking-wider">{label}</div>
  </div>
);

export default Home;
