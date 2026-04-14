import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider, useUser } from './context/UserContext';
import { colors } from './theme';
import LoginPage from './components/LoginPage';
import BottomNav from './components/BottomNav';
import HomePage from './components/HomePage';
import CoursesPage from './components/CoursesPage';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './components/ProfilePage';

type TabType = 'home' | 'courses' | 'leaderboard' | 'profile';

const tabComponents: Record<TabType, React.FC> = {
  home: HomePage,
  courses: CoursesPage,
  leaderboard: LeaderboardPage,
  profile: ProfilePage,
};

function AppContent() {
  const { isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<TabType>;
      if (customEvent.detail) setActiveTab(customEvent.detail);
    };
    window.addEventListener('fynex:navigate', handleNavigate);
    return () => window.removeEventListener('fynex:navigate', handleNavigate);
  }, []);

  if (!isAuthenticated) return <LoginPage />;
  const ActivePage = tabComponents[activeTab];

  return (
    <div className="app-shell">
      <div ref={scrollRef} className="app-content" style={{ background: colors.background }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="min-h-full"
          >
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
