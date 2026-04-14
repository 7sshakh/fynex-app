import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => { setShowSplash(false); setIsLoading(false); }, 1900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<TabType>;
      if (customEvent.detail) setActiveTab(customEvent.detail);
    };
    window.addEventListener('fynex:navigate', handleNavigate);
    return () => window.removeEventListener('fynex:navigate', handleNavigate);
  }, []);

  if (!isAuthenticated) return <LoginPage />;
  if (showSplash || isLoading) return <SplashScreen />;

  const ActivePage = tabComponents[activeTab];

  return (
    <div className="app-shell">
      <div ref={scrollRef} className="app-content" style={{ background: colors.background }}>
        <ActivePage />
      </div>
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
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden py-20 px-6"
      style={{ background: colors.background }}
    >
      {/* Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(195,255,45,0.05) 0%, transparent 70%)' }} />

      <div className="flex flex-col items-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full blur-3xl opacity-50" style={{ background: `${colors.primary}33` }} />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="relative w-32 h-32 flex items-center justify-center rounded-2xl overflow-visible primary-glow"
            style={{ background: `${colors.surfaceContainer}99`, backdropFilter: 'blur(24px)', border: `1px solid rgba(255,255,255,0.05)` }}
          >
            <div className="w-16 h-20" style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDim}, ${colors.primaryContainer})`,
              clipPath: 'polygon(44% 0, 100% 0, 71% 43%, 100% 43%, 29% 100%, 46% 56%, 0 56%)',
              boxShadow: '0 0 30px rgba(195,255,45,0.4)',
            }} />
            <div className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center rounded-full text-xl font-black border-4"
              style={{ background: colors.primary, color: '#364b00', borderColor: colors.background }}>3</div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12 text-center space-y-3">
          <h1 className="text-4xl font-black tracking-[-0.05em]" style={{ color: colors.onSurface }}>
            Fynex <span className="italic" style={{ color: colors.primary }}>3.0</span>
          </h1>
          <p className="text-xs font-medium tracking-tight uppercase" style={{ color: colors.onSurfaceVariant, opacity: 0.8 }}>
            Bepul ta'lim platformasi
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-12">
        {/* Loading dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: colors.primary }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] tracking-widest font-bold uppercase" style={{ color: colors.outline, opacity: 0.4 }}>O'zbekistonda tayyorlangan</span>
        </div>
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
