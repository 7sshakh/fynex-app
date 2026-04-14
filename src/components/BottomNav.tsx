import { motion } from 'framer-motion';
import { Home, GraduationCap, BarChart3, User } from 'lucide-react';
import { colors } from '../theme';

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
  return (
    <div className="bottom-nav-wrap" style={{ background: 'transparent' }}>
      <div className="px-4 pt-2 pb-3 nav-safe">
        <div
          className="flex justify-around items-center py-2 px-2 rounded-full neon-shadow"
          style={{
            background: 'rgba(14, 14, 14, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
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
                  color: 'rgba(244, 247, 223, 0.6)',
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
    </div>
  );
}
