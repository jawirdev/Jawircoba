
import React, { useState } from 'react';

interface QrGeneratorProps {
  onToast: (msg: string) => void;
}

const QrGenerator: React.FC<QrGeneratorProps> = ({ onToast }) => {
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generate = () => {
    const val = input.trim();
    if (!val) return onToast("Isi teks atau link Wir!");
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(val)}`);
    onToast("QR Berhasil Dibuat");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <label className="text-[10px] text-brand-green font-oswald uppercase tracking-widest">QR Generator</label>
      </div>

      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Masukkan teks atau URL..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black border border-white/10 px-4 py-4 text-sm focus:border-brand-green/50 outline-none transition-all font-oswald tracking-wider"
        />
        <button 
          onClick={generate}
          className="w-full bg-brand-green text-black font-oswald font-bold py-4 uppercase tracking-[4px] hover:brightness-110 transition-all"
        >
          Buat QR Sekarang
        </button>
      </div>

      {qrUrl && (
        <div className="flex flex-col items-center py-10 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="bg-white p-3 rounded-sm shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <img src={qrUrl} alt="QR Code" className="w-[180px] h-[180px]" />
          </div>
          <p className="mt-6 text-[10px] font-oswald text-gray-600 uppercase tracking-widest">
            Tekan lama pada gambar untuk menyimpan
          </p>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
