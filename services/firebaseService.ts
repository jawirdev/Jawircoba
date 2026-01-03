
import { initializeApp } from "firebase/app";
import { 
  getDatabase, ref, push, onValue, update, increment 
} from "firebase/database";
import { FIREBASE_CONFIG } from "../constants";
import { ChatMessage, StatsData } from "../types";
import { getTodayKey } from "../utils";

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

export const firebaseService = {
  // Chat
  sendChatMessage: (msg: ChatMessage) => {
    return push(ref(db, 'chats'), msg);
  },
  
  onChatsChange: (callback: (messages: ChatMessage[]) => void) => {
    const chatsRef = ref(db, 'chats');
    return onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const messages: ChatMessage[] = Object.entries(data).map(([id, val]) => ({
        ...(val as any),
        id
      }));
      callback(messages.sort((a, b) => a.time - b.time));
    });
  },

  // Stats
  logVisit: () => {
    const now = new Date();
    const day = getTodayKey();
    const month = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const year = `${now.getFullYear()}`;
    
    // Gunakan prefix v25 untuk testing data baru
    const visitKey = `jawir_v25_visit_${day}`;
    if (!localStorage.getItem(visitKey)) {
      const updates: any = {};
      updates[`stats/daily/${day}/visitors`] = increment(1);
      updates[`stats/monthly/${month}/visitors`] = increment(1);
      updates[`stats/yearly/${year}/visitors`] = increment(1);
      updates[`stats/total/count`] = increment(1);
      update(ref(db), updates);
      localStorage.setItem(visitKey, 'true');
    }
  },

  logFeature: (name: string) => {
    update(ref(db, `stats/features/${name}`), { count: increment(1) });
  },

  onStatsChange: (callback: (stats: any) => void) => {
    return onValue(ref(db, 'stats'), (snapshot) => {
      callback(snapshot.val() || {});
    });
  }
};
