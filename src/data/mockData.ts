import { Course, LeaderboardEntry, User, DailyChallenge } from '../types';
import englishData from './english_beginner.json';

const englishBeginnerLessons = (englishData.lessons || []).map((lesson: any) => ({
  id: `1-${lesson.lesson_id}`,
  title: lesson.title || 'Mavzu',
  duration: Math.max(10, (lesson.topics?.length || 1) * 5),
  completed: false,
}));

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Ingliz Tili Beginner',
    description: "Ingliz tilining asosiy so\u2018z va grammatik qoidalarini o\u2018rganing",
    category: 'english',
    color: 'from-blue-500 to-cyan-400',
    isPro: false,
    totalXp: 500,
    lessons: englishBeginnerLessons
  },
  {
    id: '2',
    title: 'Ingliz Tili Intermediate',
    description: "Murakkabroq grammatika va muloqot ko\u2018nikmalarini rivojlantiring",
    category: 'english',
    color: 'from-blue-600 to-indigo-500',
    isPro: true,
    totalXp: 800,
    lessons: [
      { id: '2-1', title: 'Present Perfect', duration: 30, completed: false },
      { id: '2-2', title: 'Modal verbs', duration: 25, completed: false },
      { id: '2-3', title: 'Conditionals', duration: 35, completed: false },
    ]
  },
  {
    id: '3',
    title: 'Rus Tili Beginner',
    description: "Rus tilining asoslari: alfavit va birinchi so\u2018zlar",
    category: 'russian',
    color: 'from-red-500 to-pink-400',
    isPro: false,
    totalXp: 450,
    lessons: [
      { id: '3-1', title: 'Kirill alfaviti', duration: 30, completed: false },
      { id: '3-2', title: "Birinchi so\u2018zlar", duration: 25, completed: false },
      { id: '3-3', title: 'Soni va paytdosh', duration: 30, completed: false },
    ]
  },
  {
    id: '4',
    title: 'Matematika Asoslari',
    description: "Algebra, geometriya va arifmetikaning asosiy tushunchalari",
    category: 'math',
    color: 'from-emerald-500 to-teal-400',
    isPro: false,
    totalXp: 600,
    lessons: [
      { id: '4-1', title: 'Butun sonlar', duration: 20, completed: false },
      { id: '4-2', title: 'Kasrlar', duration: 25, completed: false },
      { id: '4-3', title: 'Tenglamalar', duration: 30, completed: false },
      { id: '4-4', title: 'Geometriya asoslari', duration: 35, completed: false },
    ]
  },
  {
    id: '5',
    title: 'Fizika Fundamental',
    description: "Fizikaning asosiy qonunlari va formulalari",
    category: 'physics',
    color: 'from-purple-500 to-violet-400',
    isPro: false,
    totalXp: 700,
    lessons: [
      { id: '5-1', title: 'Mexanika', duration: 40, completed: false },
      { id: '5-2', title: 'Termodinamika', duration: 35, completed: false },
      { id: '5-3', title: 'Elektr', duration: 40, completed: false },
    ]
  },
  {
    id: '6',
    title: 'Dasturlash Asoslari',
    description: "Python bilan dasturlashga birinchi qadamlar",
    category: 'programming',
    color: 'from-amber-500 to-orange-400',
    isPro: true,
    totalXp: 1000,
    lessons: [
      { id: '6-1', title: "O\u2018zgaruvchilar", duration: 30, completed: false },
      { id: '6-2', title: 'Shartli operatorlar', duration: 35, completed: false },
      { id: '6-3', title: 'Sikllar', duration: 40, completed: false },
      { id: '6-4', title: 'Funksiyalar', duration: 45, completed: false },
    ]
  },
  {
    id: '7',
    title: 'Rus Tili Advanced',
    description: "Murakkab grammatika va adabiy til ko\u2018nikmalari",
    category: 'russian',
    color: 'from-red-600 to-rose-500',
    isPro: true,
    totalXp: 900,
    lessons: [
      { id: '7-1', title: 'Vid glagola', duration: 35, completed: false },
      { id: '7-2', title: 'Sintaksis', duration: 40, completed: false },
    ]
  },
  {
    id: '8',
    title: 'Matematika Advanced',
    description: "Funksiyalar, logarifmlar va trigonometriya",
    category: 'math',
    color: 'from-emerald-600 to-green-500',
    isPro: true,
    totalXp: 850,
    lessons: [
      { id: '8-1', title: 'Kvadrat tenglamalar', duration: 40, completed: false },
      { id: '8-2', title: 'Logarifmlar', duration: 45, completed: false },
      { id: '8-3', title: 'Trigonometriya', duration: 50, completed: false },
    ]
  }
];

const LESSON_TEMPLATES: Record<string, string[]> = {
  english: [
    "Salomlashuv va tanishuv",
    "Kundalik fe'llar",
    "Present Simple amaliyoti",
    "So'z birikmalari",
    "Listening mini-dialog",
    "Speaking mini-practice",
    "Reading short text",
    "Grammar booster",
    "Vocab challenge",
    "Revision + test",
  ],
  russian: [
    "Ruscha kundalik iboralar",
    "Fe'llar va zamonlar",
    "Muloqot darsi",
    "Lug'at amaliyoti",
    "Tinglab tushunish",
    "Gap tuzish",
    "Qisqa matn tahlili",
    "Dialog mashqi",
    "Xatolarni tuzatish",
    "Nazorat darsi",
  ],
  math: [
    "Arifmetika tezkor mashq",
    "Kasrlar bilan ishlash",
    "Tenglamalar asoslari",
    "Foiz va nisbat",
    "Funksiya kirish",
    "Grafik tushunchasi",
    "Masala yechish texnikasi",
    "Mantiqiy hisoblash",
    "Aralash test",
    "Yakuniy takrorlash",
  ],
  physics: [
    "Mexanika kirish",
    "Tezlik va tezlanish",
    "Kuch va massa",
    "Energiya turlari",
    "Issiqlik jarayonlari",
    "Elektr asoslari",
    "Tok va qarshilik",
    "To'lqinlar",
    "Optika kirish",
    "Yakuniy nazorat",
  ],
  programming: [
    "Python sintaksisi",
    "O'zgaruvchilar amaliyoti",
    "Shart operatorlari",
    "Sikllar",
    "Funksiyalar",
    "List va dict",
    "String bilan ishlash",
    "Mini loyiha 1",
    "Xatolarni topish",
    "Yakuniy mini loyiha",
  ],
};

for (const course of mockCourses) {
  if (course.lessons.length >= 10) continue;
  const template = LESSON_TEMPLATES[course.category] || LESSON_TEMPLATES.english;
  const nextIndex = course.lessons.length;
  for (let i = nextIndex; i < 10; i += 1) {
    course.lessons.push({
      id: `${course.id}-x${i + 1}`,
      title: template[i] || `${course.title} — Dars ${i + 1}`,
      duration: 20 + ((i % 4) * 5),
      completed: false,
    });
  }
}

export const mockLeaderboard: LeaderboardEntry[] = [];

export const currentUser: User = {
  id: 'current',
  name: '',
  phone: '',
  avatar: '',
  xp: 0,
  streak: 0,
  completedCourses: [],
  isPro: false,
  createdAt: '2024-05-01'
};

export const dailyChallenges: DailyChallenge[] = [
  { id: '1', title: '2 ta dars tugatng', xp: 50, completed: false },
  { id: '2', title: "5 ta so\u2018z yodlang", xp: 25, completed: false },
  { id: '3', title: "Bugungi streak\u2018ni saqlang", xp: 30, completed: false },
];

export const categories = [
  { id: 'all', label: 'Barchasi', icon: 'Sparkles' },
  { id: 'english', label: 'Ingliz', icon: 'Globe' },
  { id: 'russian', label: 'Rus', icon: 'Globe' },
  { id: 'math', label: 'Matem', icon: 'Calculator' },
  { id: 'physics', label: 'Fizika', icon: 'Atom' },
  { id: 'programming', label: 'Dastur', icon: 'Code' },
];
