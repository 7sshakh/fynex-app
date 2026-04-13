import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { currentUser as initialUser } from '../data/mockData';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, name: string) => void;
  logout: () => void;
  updateXp: (amount: number) => void;
  updateStreak: () => void;
  togglePro: () => void;
  completeCourse: (courseId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  offlineEnabled: boolean;
  toggleOffline: () => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fynex_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const storedTheme = localStorage.getItem('fynex_theme');
    const storedNotifications = localStorage.getItem('fynex_notifications');
    const storedOffline = localStorage.getItem('fynex_offline');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }
    if (storedNotifications) {
      setNotificationsEnabled(storedNotifications === 'true');
    }
    if (storedOffline) {
      setOfflineEnabled(storedOffline === 'true');
    }
    const storedAnimations = localStorage.getItem('fynex_animations');
    if (storedAnimations) {
      setAnimationsEnabled(storedAnimations === 'true');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fynex_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fynex_theme', theme);
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fynex_notifications', String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('fynex_offline', String(offlineEnabled));
  }, [offlineEnabled]);

  useEffect(() => {
    localStorage.setItem('fynex_animations', String(animationsEnabled));
    document.documentElement.classList.toggle('animations-disabled', !animationsEnabled);
  }, [animationsEnabled]);

  const login = (phone: string, name: string) => {
    const newUser: User = {
      ...initialUser,
      phone,
      name,
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

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((current) => !current);
  };

  const toggleOffline = () => {
    setOfflineEnabled((current) => !current);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled((current) => !current);
  };

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
        theme,
        toggleTheme,
        notificationsEnabled,
        toggleNotifications,
        offlineEnabled,
        toggleOffline,
        animationsEnabled,
        toggleAnimations,
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
