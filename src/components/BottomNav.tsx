import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, GraduationCap, BarChart3, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getPalette } from '../theme';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Bosh sahifa', icon: Home },
  { id: 'courses', label: 'Kurslar', icon: GraduationCap },
  { id: 'leaderboard', label: 'Reyting', icon: BarChart3 },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { theme } = useUser();
  const colors = getPalette(theme);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      const show = (e as CustomEvent<boolean>).detail;
      setVisible(show);
    };
    window.addEventListener('fynex:nav', handler);
    return () => window.removeEventListener('fynex:nav', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
    <motion.div
      className="bottom-nav-wrap"
      style={{ background: 'transparent' }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
    >
      <div className="px-4 nav-safe">
        <div
          className="flex justify-around items-center py-2 px-2 rounded-full neon-shadow"
          style={{
            background: theme === 'dark' ? 'rgba(14, 14, 14, 0.82)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${colors.outlineVariant}33`,
            pointerEvents: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300"
                style={isActive ? {
                  background: colors.primary,
                  color: '#000',
                  transform: 'scale(1.05)',
                } : {
                  background: 'transparent',
                  color: colors.onSurfaceVariant,
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}

export function hideNav() {
  window.dispatchEvent(new CustomEvent('fynex:nav', { detail: false }));
}
export function showNav() {
  window.dispatchEvent(new CustomEvent('fynex:nav', { detail: true }));
}
