import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User } from '../types';
import { currentUser as initialUser } from '../data/mockData';
import { type Lang, type Translations, getTranslations, getCurrentLang, setCurrentLang } from '../lib/i18n';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, name: string) => void;
  logout: () => void;
  updateXp: (amount: number) => void;
  updateStreak: () => void;
  togglePro: () => void;
  completeCourse: (courseId: string) => void;
  updateName: (name: string) => void;
  updatePhone: (phone: string) => void;
  updateEmail: (email: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lang, setLangState] = useState<Lang>(getCurrentLang);
  const t = useMemo(() => getTranslations(lang), [lang]);

  useEffect(() => {
    const stored = localStorage.getItem('fynex_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const storedTheme = localStorage.getItem('fynex_theme');
    const storedNotifications = localStorage.getItem('fynex_notifications');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    } else {
      setTheme('dark');
    }
    if (storedNotifications) {
      setNotificationsEnabled(storedNotifications === 'true');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fynex_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const bg = theme === 'dark' ? '#0e0e0e' : '#f8fafc';
    localStorage.setItem('fynex_theme', theme);
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    document.body.style.colorScheme = theme;
    
    document.documentElement.style.setProperty('--fynex-app-bg', bg);
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = bg;
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('fynex_notifications', String(notificationsEnabled));
  }, [notificationsEnabled]);

  const login = (phone: string, name: string) => {
    const telegramId = (window as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id?: number } } } } }).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const newUser: User = {
      ...initialUser,
      phone,
      name,
      telegramId,
    };
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('fynex_user');
    setUser(null);
  };

  const updateXp = (amount: number) => {
    if (user) {
      setUser({ ...user, xp: user.xp + amount });
    }
  };

  const updateStreak = () => {
    if (user) {
      setUser({ ...user, streak: user.streak + 1 });
    }
  };

  const togglePro = () => {
    if (user) {
      setUser({ ...user, isPro: !user.isPro });
    }
  };

  const completeCourse = (courseId: string) => {
    if (user && !user.completedCourses.includes(courseId)) {
      setUser({
        ...user,
        completedCourses: [...user.completedCourses, courseId],
      });
    }
  };

  const updateName = (name: string) => {
    if (user) setUser({ ...user, name });
  };

  const updatePhone = (phone: string) => {
    if (user) setUser({ ...user, phone });
  };

  const updateEmail = (email: string) => {
    if (user) setUser({ ...user, email });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((current) => !current);
  };

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    setCurrentLang(newLang);
    import('../data/lessonContent').then(({ syncLessonsWithData }) => syncLessonsWithData(newLang));
  };

  useEffect(() => {
    import('../data/lessonContent').then(({ syncLessonsWithData }) => syncLessonsWithData(lang));
  }, [lang]);


  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateXp,
        updateStreak,
        togglePro,
        completeCourse,
        updateName,
        updatePhone,
        updateEmail,
        theme,
        toggleTheme,
        notificationsEnabled,
        toggleNotifications,
        lang,
        setLang,
        t,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
