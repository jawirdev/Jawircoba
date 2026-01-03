
export type TabId = 'home' | 'chat' | 'grid' | 'color' | 'ai' | 'qr' | 'leaderboard' | 'stats' | 'events';

export interface ChatMessage {
  user: string;
  msg: string;
  time: number;
  role: 'user' | 'developer';
  id?: string;
}

export interface PromoData {
  t: string;
  l: string;
  b: string;
}

export interface FeatureStats {
  [key: string]: { count: number };
}

export interface DailyStats {
  [date: string]: { visitors: number };
}

export interface StatsData {
  total?: { count: number };
  daily?: DailyStats;
  monthly?: DailyStats;
  yearly?: DailyStats;
  features?: FeatureStats;
}

export interface HistoryEvent {
  year: string;
  text: string;
}
