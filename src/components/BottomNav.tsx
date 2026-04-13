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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-4 py-2 nav-safe">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center py-2 px-4 rounded-2xl active:scale-90 transition-transform duration-150"
              >
                <div
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                <span
                  className={`text-xs mt-1 font-medium transition-all duration-200 ${
                    isActive ? 'text-indigo-600 opacity-100' : 'text-gray-400 opacity-0'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 w-12 h-1 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
