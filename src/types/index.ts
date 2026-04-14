export interface User {
  id: string;
  telegramId?: number;
  name: string;
  phone: string;
  avatar?: string;
  email?: string;
  xp: number;
  streak: number;
  completedCourses: string[];
  isPro: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'english' | 'russian' | 'math' | 'physics' | 'programming';
  lessons: Lesson[];
  isPro: boolean;
  totalXp: number;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  streak: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}
