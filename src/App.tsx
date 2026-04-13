import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserProvider, useUser } from './context/UserContext';
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
  const { isAuthenticated, theme } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // HACK: Set html/body bg to EXACTLY match nav bar color
  // If viewport doesn't reach screen bottom, the gap shows body bg
  // Making body bg = nav bg = gap becomes invisible
  useEffect(() => {
    const navBg = theme === 'dark' ? 'rgb(14, 18, 11)' : '#ffffff';
    document.documentElement.style.background = navBg;
    document.body.style.background = navBg;
  }, [theme]);

  // Reset scroll to top when switching tabs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsLoading(false);
    }, 1900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<TabType>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };

    window.addEventListener('fynex:navigate', handleNavigate);
    return () => {
      window.removeEventListener('fynex:navigate', handleNavigate);
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (showSplash || isLoading) {
    return <SplashScreen />;
  }

  const ActivePage = tabComponents[activeTab];

  return (
    <div
      className={`app-shell ${theme === 'dark' ? 'theme-surface-dark' : 'theme-surface-light'}`}
    >
      {/* Animated Background — absolute, never moves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-violet-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Page Content — scrollable, takes remaining flex space */}
      <div ref={scrollRef} className="app-content">
        <ActivePage />
      </div>

      {/* Bottom Navigation — flex child at bottom, NOT fixed */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(circle at bottom, rgba(193, 255, 46, 0.26), transparent 28%), linear-gradient(180deg, #060706 0%, #0a0d09 58%, #14180c 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-300/20 blur-3xl"
        />
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-lime-300/10 bg-lime-300/5 backdrop-blur-xl shadow-2xl"
        >
          <div className="relative h-14 w-14">
            <div
              className="absolute inset-0 rounded-[1rem]"
              style={{
                background: 'linear-gradient(180deg, #dbff61 0%, #c3ff2e 55%, #9fdc16 100%)',
                clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-lime-50">Fynex 2.0</h1>
          <p className="text-lime-100/70">Bepul ta'lim platformasi</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: i * 0.2,
                }}
                className="h-3 w-3 rounded-full bg-lime-300"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
