
import React, { useState, useRef } from 'react';

interface ColorPickerProps {
  onToast: (msg: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onToast }) => {
  const [palette, setPalette] = useState<{h: string, c: number}[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setPreview(img.src);
        extractColors(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const extractColors = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);
    
    const data = ctx.getImageData(0, 0, 100, 100).data;
    const colors: Record<string, number> = {};

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      // Quantize slightly for better groups
      const r = Math.round(data[i] / 5) * 5;
      const g = Math.round(data[i + 1] / 5) * 5;
      const b = Math.round(data[i + 2] / 5) * 5;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
      colors[hex] = (colors[hex] || 0) + 1;
    }

    const sorted = Object.entries(colors)
      .map(([h, c]) => ({ h, c }))
      .sort((a, b) => b.c - a.c)
      .slice(0, 12);

    setPalette(sorted);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    onToast(`Copied: ${hex}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <label className="text-[10px] text-brand-green font-oswald uppercase tracking-widest">Color Picker</label>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/10 p-10 text-center hover:border-brand-green/30 hover:bg-white/5 cursor-pointer transition-all rounded-lg group"
      >
        <span className="text-[10px] font-oswald uppercase tracking-[3px] text-gray-500 group-hover:text-white">Upload Gambar Wir</span>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFile}
        />
      </div>

      {preview && (
        <img src={preview} alt="Preview" className="w-full h-32 object-cover border border-white/10 rounded-lg grayscale hover:grayscale-0 transition-all duration-500" />
      )}

      {palette.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {palette.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => copyToClipboard(item.h)}
              className="flex flex-col border border-white/10 hover:border-brand-green transition-all"
            >
              <div className="w-full h-12" style={{ backgroundColor: item.h }} />
              <div className="w-full bg-black py-2 text-[8px] font-oswald text-gray-500 text-center">
                {item.h}
              </div>
            </button>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ColorPicker;
