
import { BLOCKLIST, CHAR_MAP } from './constants';

export function isToxic(text: string): boolean {
  if (!text) return false;
  let str = text.toLowerCase();
  
  // 1. Raw Check
  if (BLOCKLIST.some(w => str.includes(w))) return true;

  // 2. Leet Swap
  for (const k in CHAR_MAP) { 
    CHAR_MAP[k].forEach(s => { 
      str = str.split(s).join(k); 
    }); 
  }
  if (BLOCKLIST.some(w => str.includes(w))) return true;

  // 3. Strip Symbols/Spaces
  const stripped = str.replace(/[^a-z0-9]/g, '');
  if (BLOCKLIST.some(w => stripped.includes(w))) return true;

  // 4. Remove Repeats
  const simple = str.replace(/(.)\1+/g, '$1');
  return BLOCKLIST.some(word => simple.includes(word));
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function getTodayKey(): string {
  return new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
}
