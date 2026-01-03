
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TabId, PromoData } from './types';
import { Icons } from './constants';
import { firebaseService } from './services/firebaseService';

// Components
import Home from './components/Home';
import ChatForum from './components/ChatForum';
import GridCalculator from './components/GridCalculator';
import ColorPicker from './components/ColorPicker';
import AiAssistant from './components/AiAssistant';
import QrGenerator from './components/QrGenerator';
import Leaderboard from './components/Leaderboard';
import Stats from './components/Stats';

const PROMO_DATA: PromoData[] = [
  { t: "BUTUH JASA DESAIN PREMIUM?", l: "https://lynk.id/jawirdesigner", b: "ORDER" },
  { t: "GABUNG KOMUNITAS WHATSAPP", l: "https://whatsapp.com/channel/0029VbC8PMD90x2qA5zwx03y", b: "JOIN" }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [promoIndex, setPromoIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isToxicDetected, setIsToxicDetected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyCallback, setVerifyCallback] = useState<((pass: string | null) => void) | null>(null);
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    firebaseService.logVisit();
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_DATA.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    firebaseService.logFeature(tab);
  };

  const handleToxic = () => {
    setIsToxicDetected(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const triggerVerification = (callback: (pass: string | null) => void) => {
    setIsVerifying(true);
    setVerifyCallback(() => callback);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onSwitch={switchTab} />;
      case 'chat': return <ChatForum onToast={showToast} onToxic={handleToxic} onVerify={triggerVerification} />;
      case 'grid': return <GridCalculator />;
      case 'color': return <ColorPicker onToast={showToast} />;
      case 'ai': return <AiAssistant onToxic={handleToxic} />;
      case 'qr': return <QrGenerator onToast={showToast} />;
      case 'leaderboard': return <Leaderboard />;
      case 'stats': return <Stats />;
      default: return <Home onSwitch={switchTab} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-dark gemini-gradient font-sans overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[600] bg-brand-green text-black px-5 py-2.5 font-oswald font-bold rounded shadow-[0_0_20px_rgba(93,255,142,0.3)] animate-slide-up">
          {toast}
        </div>
      )}

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-5 left-5 z-[500] md:hidden p-3 bg-black/50 border border-white/10 rounded-xl text-white backdrop-blur-md"
      >
        {isSidebarOpen ? <Icons.Close /> : <Icons.Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 md:relative md:w-64 flex-shrink-0 border-r border-white/5 bg-black/60 backdrop-blur-2xl flex flex-col z-[400] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-green rounded shadow-[0_0_15px_rgba(93,255,142,0.4)] flex-shrink-0" />
          <h1 className="font-oswald text-xl font-bold tracking-tighter uppercase">Jawir Tools</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
          <SidebarItem active={activeTab === 'home'} icon={<Icons.Home />} label="Dashboard" onClick={() => switchTab('home')} />
          <SidebarItem active={activeTab === 'chat'} icon={<Icons.Chat />} label="Jawir Forum" onClick={() => switchTab('chat')} />
          <SidebarItem active={activeTab === 'grid'} icon={<Icons.Grid />} label="Grid Calc" onClick={() => switchTab('grid')} />
          <SidebarItem active={activeTab === 'color'} icon={<Icons.Color />} label="Color Palette" onClick={() => switchTab('color')} />
          <SidebarItem active={activeTab === 'ai'} icon={<Icons.Bot />} label="AI Assistant" onClick={() => switchTab('ai')} />
          <SidebarItem active={activeTab === 'qr'} icon={<Icons.Qr />} label="QR Creator" onClick={() => switchTab('qr')} />
          <SidebarItem active={activeTab === 'leaderboard'} icon={<Icons.Leaderboard />} label="Leaderboard" onClick={() => switchTab('leaderboard')} />
          <SidebarItem active={activeTab === 'stats'} icon={<Icons.Stats />} label="Statistics" onClick={() => switchTab('stats')} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="text-[9px] text-gray-600 font-oswald tracking-[3px] uppercase mb-4">Promoted</div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 group">
            <p className="text-[10px] text-gray-400 font-medium mb-3 leading-relaxed">{PROMO_DATA[promoIndex].t}</p>
            <a href={PROMO_DATA[promoIndex].l} target="_blank" className="text-[10px] text-brand-green font-bold flex items-center gap-2 hover:underline">
              {PROMO_DATA[promoIndex].b} <Icons.Send />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="text-[10px] font-oswald text-gray-500 uppercase tracking-[5px]">
            System / <span className="text-white">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end hidden sm:block">
                <span className="text-[10px] text-white font-oswald tracking-widest uppercase">Guest Mode</span>
                <span className="text-[8px] text-brand-green font-oswald uppercase opacity-50">Authorized Agent</span>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/10 shadow-lg">
               <Icons.User />
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
          <div className="w-full max-w-6xl mx-auto min-h-full">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Modals */}
      {isToxicDetected && (
        <div className="fixed inset-0 bg-black z-[1000] flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-red-500/50 bg-black p-4 text-center rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <video ref={videoRef} src="https://aliceecdn.vercel.app/file/9738ac300c.mp4" className="w-full rounded-2xl" onEnded={() => setIsToxicDetected(false)} />
            <p className="mt-5 text-red-500 font-oswald uppercase font-bold tracking-[4px]">Peringatan: Konten Toxic Terdeteksi</p>
          </div>
        </div>
      )}

      {isVerifying && (
        <div className="fixed inset-0 bg-black/90 z-[700] flex items-center justify-center backdrop-blur-xl p-6">
          <div className="w-full max-w-sm glass-card p-10 rounded-[32px] shadow-2xl border-white/10">
            <h3 className="font-oswald text-2xl text-brand-green mb-8 text-center uppercase tracking-widest">Akses Pengembang</h3>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border-b-2 border-brand-green/20 focus:border-brand-green outline-none py-4 text-center text-2xl font-oswald tracking-[12px] transition-all mb-4"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => { if (verifyCallback) verifyCallback(password); setIsVerifying(false); setPassword(''); }}
                className="bg-brand-green text-black font-bold py-4 rounded-2xl font-oswald uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
              >
                Konfirmasi
              </button>
              <button 
                onClick={() => { setIsVerifying(false); setPassword(''); }}
                className="bg-white/5 text-gray-400 font-oswald uppercase py-4 rounded-2xl hover:text-white transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarItemProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
      active 
        ? 'bg-brand-green text-black shadow-[0_15px_30px_rgba(93,255,142,0.15)]' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {active && <div className="absolute left-0 w-1 h-6 bg-black rounded-full" />}
    <span className={`flex-shrink-0 transition-colors ${active ? 'text-black' : 'group-hover:text-brand-green'}`}>
      {icon}
    </span>
    <span className="font-bold text-[10px] uppercase tracking-widest font-oswald">{label}</span>
  </button>
);

export default App;
