import { Course, LeaderboardEntry, User, DailyChallenge } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Ingliz Tili Beginner',
    description: 'Ingliz tilining asosiy so'z va grammatik qoidalarini o'rganing',
    category: 'english',
    color: 'from-blue-500 to-cyan-400',
    isPro: false,
    totalXp: 500,
    lessons: [
      { id: '1-1', title: 'Salomlashish', duration: 15, completed: false },
      { id: '1-2', title: 'Raqamlar 1-10', duration: 20, completed: false },
      { id: '1-3', title: 'Range va ranglar', duration: 25, completed: false },
      { id: '1-4', title: 'Oilaviy munosabatlar', duration: 30, completed: false },
      { id: '1-5', title: 'Ovqatlanish', duration: 25, completed: false },
    ]
  },
  {
    id: '2',
    title: 'Ingliz Tili Intermediate',
    description: 'Murakkabroq grammatika va muloqot ko'nikmalarini rivojlantiring',
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
    description: 'Rus tilining asoslari: alfavit va birinchi so'zlar',
    category: 'russian',
    color: 'from-red-500 to-pink-400',
    isPro: false,
    totalXp: 450,
    lessons: [
      { id: '3-1', title: 'Kirill alfaviti', duration: 30, completed: false },
      { id: '3-2', title: 'Birinchi so'zlar', duration: 25, completed: false },
      { id: '3-3', title: 'Soni va paytdosh', duration: 30, completed: false },
    ]
  },
  {
    id: '4',
    title: 'Matematika Asoslari',
    description: 'Algebra, geometriya va arifmetikaning asosiy tushunchalari',
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
    description: 'Fizikaning asosiy qonunlari va formulalari',
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
    description: 'Python bilan dasturlashga birinchi qadamlar',
    category: 'programming',
    color: 'from-amber-500 to-orange-400',
    isPro: true,
    totalXp: 1000,
    lessons: [
      { id: '6-1', title: 'O'zgaruvchilar', duration: 30, completed: false },
      { id: '6-2', title: 'Shartli operatorlar', duration: 35, completed: false },
      { id: '6-3', title: 'Sikllar', duration: 40, completed: false },
      { id: '6-4', title: 'Funksiyalar', duration: 45, completed: false },
    ]
  },
  {
    id: '7',
    title: 'Rus Tili Advanced',
    description: 'Murakkab grammatika va adabiy til ko'nikmalari',
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
    description: 'Funksiyalar, logarifmlar va trigonometriya',
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

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { id: '1', name: 'Aziz Karimov', phone: '+998901234567', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-01-15' }, xp: 0, streak: 0 },
  { rank: 2, user: { id: '2', name: 'Nodira Saidova', phone: '+998931234567', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-02-20' }, xp: 0, streak: 0 },
  { rank: 3, user: { id: '3', name: 'Bekzod Rustamov', phone: '+998901234568', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-03-10' }, xp: 0, streak: 0 },
  { rank: 4, user: { id: '4', name: 'Dilnoza Mahmudova', phone: '+998901234569', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-03-15' }, xp: 0, streak: 0 },
  { rank: 5, user: { id: '5', name: 'Samir Aliyev', phone: '+998901234570', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-04-01' }, xp: 0, streak: 0 },
  { rank: 6, user: { id: '6', name: 'Kamola Yusupova', phone: '+998901234571', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-04-10' }, xp: 0, streak: 0 },
  { rank: 7, user: { id: '7', name: 'Jasur Tashkentov', phone: '+998901234572', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-04-15' }, xp: 0, streak: 0 },
  { rank: 8, user: { id: '8', name: 'Malika Rashidova', phone: '+998901234573', xp: 0, streak: 0, completedCourses: [], isPro: false, createdAt: '2024-04-20' }, xp: 0, streak: 0 },
];

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
  { id: '2', title: '5 ta so'z yodlang', xp: 25, completed: false },
  { id: '3', title: 'Bugungi streak'ni saqlang', xp: 30, completed: false },
];

export const categories = [
  { id: 'all', label: 'Barchasi', icon: 'Sparkles' },
  { id: 'english', label: 'Ingliz', icon: 'Globe' },
  { id: 'russian', label: 'Rus', icon: 'Globe' },
  { id: 'math', label: 'Matem', icon: 'Calculator' },
  { id: 'physics', label: 'Fizika', icon: 'Atom' },
  { id: 'programming', label: 'Dastur', icon: 'Code' },
];
