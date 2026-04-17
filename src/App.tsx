import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider, useUser } from './context/UserContext';
import { getPalette } from './theme';
import WelcomePage from './components/WelcomePage';
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

import MockTestSystem from './components/mock-tests/MockTestSystem';
import PracticeSystem from './components/practice-lab/PracticeSystem';

function AppContent() {
  const { isAuthenticated, theme } = useUser();
  const colors = getPalette(theme);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showMockTests, setShowMockTests] = useState(false);
  const [showPracticeLab, setShowPracticeLab] = useState(false);
  const [welcomed, setWelcomed] = useState(() => localStorage.getItem('fynex_welcomed') === 'true');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<TabType>;
      if (customEvent.detail) setActiveTab(customEvent.detail);
    };
    const handleOpenMocks = () => setShowMockTests(true);
    const handleOpenPractice = () => setShowPracticeLab(true);
    
    window.addEventListener('fynex:navigate', handleNavigate);
    window.addEventListener('fynex:openMockTests', handleOpenMocks);
    window.addEventListener('fynex:openPractice', handleOpenPractice);
    return () => {
      window.removeEventListener('fynex:navigate', handleNavigate);
      window.removeEventListener('fynex:openMockTests', handleOpenMocks);
      window.removeEventListener('fynex:openPractice', handleOpenPractice);
    };
  }, []);

  if (!welcomed) {
    return (
      <WelcomePage
        onComplete={(lang) => {
          localStorage.setItem('fynex_welcomed', 'true');
          localStorage.setItem('fynex_lang', lang);
          setWelcomed(true);
        }}
      />
    );
  }

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
      
      <AnimatePresence>
        {showMockTests && <MockTestSystem onClose={() => setShowMockTests(false)} />}
        {showPracticeLab && <PracticeSystem onClose={() => setShowPracticeLab(false)} />}
      </AnimatePresence>
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
