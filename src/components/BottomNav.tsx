import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Bosh sahifa', icon: Home },
  { id: 'courses', label: 'Kurslar', icon: BookOpen },
  { id: 'leaderboard', label: 'Reyting', icon: Trophy },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="bottom-nav-wrap">
      <div
        className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-4 py-2 bottom-nav"
      >
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center py-2 px-4 rounded-2xl"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>

                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -4 }}
                  transition={{ duration: 0.15 }}
                  className={`text-xs mt-1 font-medium ${
                    isActive ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </motion.span>

                {isActive && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute -bottom-1 w-12 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      {/* Colored fill below nav — covers any remaining gap to screen edge */}
      <div className="bottom-nav-fill" />
    </div>
  );
}
