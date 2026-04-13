import { useUser } from '../context/UserContext';
import { Moon, Bell, WifiOff, Palette, MessageCircle, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const {
    theme,
    toggleTheme,
    notificationsEnabled,
    toggleNotifications,
    offlineEnabled,
    toggleOffline,
    animationsEnabled,
    toggleAnimations,
    logout,
  } = useUser();

  const settingsItems = [
    {
      icon: Palette,
      title: "Qorong'u rejim",
      description: "Ilova uchun qorong'u mavzuni yoqing",
      value: theme === 'dark',
      onToggle: toggleTheme,
    },
    {
      icon: Bell,
      title: 'Bildirishnomalar',
      description: "Kunlik eslatmalarni oling",
      value: notificationsEnabled,
      onToggle: toggleNotifications,
    },
    {
      icon: WifiOff,
      title: 'Offline rejim',
      description: "Internet yo'qida ishlash",
      value: offlineEnabled,
      onToggle: toggleOffline,
    },
    {
      icon: motion.div,
      title: 'Animatsiyalar',
      description: "Ilova animatsiyalarini yoqing/o'chiring",
      value: animationsEnabled,
      onToggle: toggleAnimations,
      isAnimation: true,
    },
  ];

  const handleSupportClick = () => {
    window.location.href = 'https://t.me/fynex_assist';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sozlamalar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ilova sozlamalarini boshqaring</p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {settingsItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className={cn(
                'flex items-center gap-4 p-4',
                index !== settingsItems.length - 1 && 'border-b border-slate-100 dark:border-slate-700'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shrink-0">
                {item.isAnimation ? (
                  <div className={cn('w-5 h-5', !animationsEnabled && 'animate-pulse')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </div>
                ) : (
                  <item.icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <button
                onClick={item.onToggle}
                className={cn(
                  'w-12 h-7 rounded-full transition-all duration-300 ease-in-out relative',
                  item.value ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out shadow-sm',
                    item.value ? 'left-6' : 'left-1'
                  )}
                />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 px-2">Qo'llab-quvvatlash</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <button
              onClick={handleSupportClick}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Online yordam</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Qo'llab-quvvatlash jamoamiz bilan bog'laning</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            Chiqish
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center pt-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">Fynex v1.0.0</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
