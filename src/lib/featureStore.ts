/**
 * Fynex Feature Store — localStorage-based state for all 22 unique features
 */

// ─── Types ───
export type Mood = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface MistakeEntry {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  courseId: string;
  lessonId: string;
  timestamp: number;
  reviewed: boolean;
}

export interface BookmarkEntry {
  id: string;
  courseId: string;
  lessonId: string;
  stepIndex: number;
  title: string;
  note: string;
  timestamp: number;
}

export interface StudySession {
  date: string; // YYYY-MM-DD
  minutes: number;
  xpEarned: number;
  lessonsCompleted: number;
  mistakeCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlockedAt: number | null;
  secret: boolean;
}

export interface TimeCapsule {
  message: string;
  createdAt: number;
  openDate: number;
  opened: boolean;
}

export interface ExamGoal {
  name: string;
  date: string; // YYYY-MM-DD
  dailyMinutes: number;
}

export interface FeatureState {
  mood: { current: Mood | null; setAt: string | null }; // date string
  mistakes: MistakeEntry[];
  bookmarks: BookmarkEntry[];
  sessions: StudySession[];
  achievements: Achievement[];
  timeCapsule: TimeCapsule | null;
  examGoal: ExamGoal | null;
  lastBreakTime: number;
  focusTimerActive: boolean;
  nightOwlAutoEnabled: boolean;
  weeklyReportDismissed: string | null; // week key
  dailyFactIndex: number;
  dailyFactDate: string | null;
  yesterdayDismissed: string | null;
  quickFlashLastPlayed: string | null;
  totalStudyMinutes: number;
  inviteCode: string;
}

const STORAGE_KEY = 'fynex_features';

// ─── Default State ───
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'night_owl', title: 'Tungi Boyqush 🦉', desc: 'Tunda soat 2-4 orasida dars qildingiz', icon: '🦉', unlockedAt: null, secret: true },
  { id: 'speed_demon', title: 'Tezkor 🏎️', desc: '60 soniyada 10 ta savolga javob berdingiz', icon: '🏎️', unlockedAt: null, secret: true },
  { id: 'perfect_week', title: 'Mukammal Hafta ⭐', desc: '7 kun ketma-ket dars qildingiz', icon: '⭐', unlockedAt: null, secret: true },
  { id: 'mistake_hero', title: 'Xatolar Qahramoni 🛡️', desc: 'Xato kundaligidagi 20 ta xatoni qayta o\'rgandingiz', icon: '🛡️', unlockedAt: null, secret: true },
  { id: 'early_bird', title: 'Erta Qush 🐦', desc: 'Ertalab 5-6 da dars boshladingiz', icon: '🐦', unlockedAt: null, secret: true },
  { id: 'marathon', title: 'Marafon Yuguruvchi 🏃', desc: 'Bir sessiyada 60 daqiqa o\'qidingiz', icon: '🏃', unlockedAt: null, secret: true },
  { id: 'bookworm', title: 'Kitobxon 📚', desc: '50 ta dars xatchochpini saqlangiz', icon: '📚', unlockedAt: null, secret: true },
  { id: 'centurion', title: 'Yuzlik 💯', desc: '100 ta savolga to\'g\'ri javob berdingiz', icon: '💯', unlockedAt: null, secret: true },
  { id: 'first_step', title: 'Birinchi Qadam 👣', desc: 'Birinchi darsni tugalladingiz', icon: '👣', unlockedAt: null, secret: false },
  { id: 'social', title: 'Do\'st 🤝', desc: 'Do\'stingizni Fynexga taklif qildingiz', icon: '🤝', unlockedAt: null, secret: true },
];

function generateInviteCode(): string {
  return 'FX' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const DEFAULT_STATE: FeatureState = {
  mood: { current: null, setAt: null },
  mistakes: [],
  bookmarks: [],
  sessions: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  timeCapsule: null,
  examGoal: null,
  lastBreakTime: Date.now(),
  focusTimerActive: false,
  nightOwlAutoEnabled: true,
  weeklyReportDismissed: null,
  dailyFactIndex: 0,
  dailyFactDate: null,
  yesterdayDismissed: null,
  quickFlashLastPlayed: null,
  totalStudyMinutes: 0,
  inviteCode: generateInviteCode(),
};

// ─── Core Store ───
export function loadFeatures(): FeatureState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveFeatures(state: FeatureState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateFeatures(updater: (state: FeatureState) => FeatureState): FeatureState {
  const current = loadFeatures();
  const next = updater(current);
  saveFeatures(next);
  return next;
}

// ─── Helpers ───
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function weekKey(): string {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${weekNum}`;
}

export function addMistake(entry: Omit<MistakeEntry, 'id' | 'timestamp' | 'reviewed'>): void {
  updateFeatures(s => ({
    ...s,
    mistakes: [...s.mistakes, { ...entry, id: crypto.randomUUID(), timestamp: Date.now(), reviewed: false }],
  }));
}

export function addBookmark(entry: Omit<BookmarkEntry, 'id' | 'timestamp'>): void {
  updateFeatures(s => ({
    ...s,
    bookmarks: [...s.bookmarks, { ...entry, id: crypto.randomUUID(), timestamp: Date.now() }],
  }));
}

export function logStudySession(minutes: number, xp: number, lessons: number, mistakes: number): void {
  const key = todayKey();
  updateFeatures(s => {
    const existing = s.sessions.find(ss => ss.date === key);
    if (existing) {
      return {
        ...s,
        totalStudyMinutes: s.totalStudyMinutes + minutes,
        sessions: s.sessions.map(ss => ss.date === key ? {
          ...ss, minutes: ss.minutes + minutes, xpEarned: ss.xpEarned + xp,
          lessonsCompleted: ss.lessonsCompleted + lessons, mistakeCount: ss.mistakeCount + mistakes,
        } : ss),
      };
    }
    return {
      ...s,
      totalStudyMinutes: s.totalStudyMinutes + minutes,
      sessions: [...s.sessions, { date: key, minutes, xpEarned: xp, lessonsCompleted: lessons, mistakeCount: mistakes }],
    };
  });
}

export function unlockAchievement(id: string): Achievement | null {
  const state = loadFeatures();
  const ach = state.achievements.find(a => a.id === id);
  if (!ach || ach.unlockedAt) return null;
  const updated = { ...ach, unlockedAt: Date.now() };
  saveFeatures({
    ...state,
    achievements: state.achievements.map(a => a.id === id ? updated : a),
  });
  return updated;
}

export function checkTimeBasedAchievements(): Achievement | null {
  const hour = new Date().getHours();
  if (hour >= 2 && hour < 4) return unlockAchievement('night_owl');
  if (hour >= 5 && hour < 6) return unlockAchievement('early_bird');
  return null;
}

export function getStudyHeatmap(days: number = 90): { date: string; level: number }[] {
  const state = loadFeatures();
  const result: { date: string; level: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const session = state.sessions.find(s => s.date === key);
    const mins = session?.minutes || 0;
    const level = mins === 0 ? 0 : mins < 5 ? 1 : mins < 15 ? 2 : mins < 30 ? 3 : 4;
    result.push({ date: key, level });
  }
  return result;
}

// ─── Daily Facts ───
export const DAILY_FACTS = [
  { emoji: '🧠', fact: "Miyamiz 75% suvdan iborat. Suv ichish o'qish samaradorligini 30% oshiradi!" },
  { emoji: '⏰', fact: "Eng yaxshi o'rganish vaqti — ertalab 10:00 va kechki 16:00. Miya bu vaqtlarda eng faol." },
  { emoji: '🔁', fact: "Ma'lumotni 24 soat ichida takrorlasangiz, 80% gacha yodda qoladi. Aks holda — faqat 20%." },
  { emoji: '🎵', fact: "Tinch musiqa bilan o'qish diqqatni 65% oshiradi. Lekin lirikali qo'shiqlar aksincha!" },
  { emoji: '📝', fact: "Qo'lda yozish klaviaturada yozishdan 7 barobar yaxshiroq xotirada saqlanadi." },
  { emoji: '😴', fact: "Uyqudan oldin 10 daqiqa o'qilgan ma'lumot miyada mustahkam joylashadi." },
  { emoji: '🏃', fact: "15 daqiqalik jismoniy mashq o'qish samaradorligini 20% oshiradi." },
  { emoji: '🍎', fact: "Yong'oq va shokolad miyaga kislorod oqimini yaxshilaydi. O'qish oldidan 1 dona yeng!" },
  { emoji: '🎯', fact: "Kichik maqsadlar o'rnatish (micro-goals) motivatsiyani 40% oshiradi." },
  { emoji: '📱', fact: "Telefon yoningizda yotsa ham, diqqat 26% pasayadi. Dars paytida uzoqroqqa qo'ying!" },
  { emoji: '💡', fact: "Boshqalarga o'rgatish — eng kuchli o'rganish usuli. O'rgangan narsangizni do'stingizga tushuntiring!" },
  { emoji: '🌙', fact: "7-8 soat uxlash xotirani mustahkamlaydi. Kam uxlash 40% ma'lumot yo'qotishiga olib keladi." },
  { emoji: '🧩', fact: "O'yinlar orqali o'rganish an'anaviy usuldan 3 barobar samarali. Shuning uchun Fynex gamification ishlatadi!" },
  { emoji: '☕', fact: "Kofe 20 daqiqadan keyin ta'sir qiladi. Darsdan 20 daqiqa oldin iching!" },
  { emoji: '🌈', fact: "Rangli yozuvlar oddiy qora-oq yozuvlarga qaraganda 78% yaxshiroq esda qoladi." },
  { emoji: '🤝', fact: "Guruhda o'qish yakka o'qishdan 50% samarali, chunki munozara xotirani mustahkamlaydi." },
  { emoji: '🧘', fact: "5 daqiqalik meditatsiya konsentratsiyani 14% oshiradi. Dars boshida sinab ko'ring!" },
  { emoji: '📊', fact: "Vizual ma'lumotlar matnli ma'lumotlardan 60,000 barobar tezroq qayta ishlanadi." },
  { emoji: '🎮', fact: "Dopamin — o'rganish gormoni. Har bir mashq singari kichik g'alabalar uni ko'paytiradi!" },
  { emoji: '🌿', fact: "Yashil rangdagi xona o'qish samaradorligini 15% oshiradi. Tabiat yaqinida o'qing!" },
];
