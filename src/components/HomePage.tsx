import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Flame, Zap, Trophy, BookOpen, ChevronRight, Target, Bell, Gift, ArrowLeft } from 'lucide-react';
import { dailyChallenges } from '../data/mockData';

export default function HomePage() {
  const { user, theme } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<{id: string; text: string; type: 'gift'|'info'|'achievement'}[]>([
    // Add notifications here when needed, e.g.:
    // { id: '1', text: '7 kunlik Pro obuna sovg\'a!', type: 'gift' },
  ]);
  const hasNotification = notifications.length > 0;
  const openCourses = () => {
    window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="page-content min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24"
    >
      {/* Header */}
      <motion.header variants={item} className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.name || 'Foydalanuvchi'} 👋
            </h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
            onClick={() => setShowNotifications(true)}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${hasNotification ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200' : 'bg-gray-100 shadow-gray-200/50'}`}>
              {hasNotification ? <Gift className="w-6 h-6 text-white" /> : <Bell className={`w-6 h-6 ${hasNotification ? 'text-white' : 'text-gray-500'}`} />}
            </div>
            {hasNotification && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-[8px] text-white font-bold">{notifications.length}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Streak Card */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-3xl p-5 shadow-xl shadow-orange-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={user && user.streak > 0 ? {
                  scale: [1, 1.1, 1],
                  rotate: [-5, 5, -5, 0],
                } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <div>
                <p className="text-white/80 text-sm">Kunlik streak</p>
                <p className="text-white text-3xl font-bold">{user?.streak || 0} kun</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white/80 text-sm">Jami XP</p>
              <p className="text-white text-2xl font-bold flex items-center gap-1">
                <Zap className="w-5 h-5" />
                {user?.xp || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-900 font-bold text-lg">{user?.completedCourses.length || 0}</p>
            <p className="text-gray-500 text-xs">Tugallangan</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-gray-900 font-bold text-lg">#0</p>
            <p className="text-gray-500 text-xs">Reyting</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-900 font-bold text-lg">0</p>
            <p className="text-gray-500 text-xs">Darslar</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Kunlik vazifalar</h2>
          <span className="text-sm text-indigo-600 font-medium">+105 XP</span>
        </div>
        
        <div className="space-y-3">
          {dailyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                challenge.completed
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  challenge.completed ? 'bg-emerald-500' : 'bg-indigo-100'
                }`}>
                  {challenge.completed ? (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      />
                    </motion.svg>
                  ) : (
                    <Target className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <span className={`font-medium ${
                  challenge.completed ? 'text-emerald-700 line-through' : 'text-gray-900'
                }`}>
                  {challenge.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  challenge.completed ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  +{challenge.xp} XP
                </span>
                {!challenge.completed && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning */}
      <motion.div variants={item} className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Davom etish</h2>
          <button onClick={openCourses} className="text-sm text-indigo-600 font-medium">Barchasi</button>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 shadow-xl shadow-indigo-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium mb-3">
                Ingliz Tili
              </span>
              <h3 className="text-white text-xl font-bold mb-1">Ingliz Tili Beginner</h3>
              <p className="text-white/70 text-sm mb-4">0/5 dars tugallangan</p>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '0%' }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <span className="text-white text-sm font-medium">0%</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openCourses}
              className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center ml-4"
            >
              <ChevronRight className="w-6 h-6 text-indigo-600" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Notifications Fullscreen */}
      {showNotifications && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: theme === 'dark' ? '#0a0d09' : '#f8fafc', display: 'flex', flexDirection: 'column', height: '100dvh' }}>
          {/* Header */}
          <div style={{ paddingTop: 48, flexShrink: 0, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(195,255,46,0.1)' : '#e5e7eb'}`, background: theme === 'dark' ? 'rgba(15,18,16,0.95)' : '#ffffff', backdropFilter: 'blur(12px)' }} className="px-4 pb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNotifications(false)} className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95" style={{ background: theme === 'dark' ? 'rgba(195,255,46,0.08)' : '#f3f4f6' }}>
                <ArrowLeft className="w-5 h-5" style={{ color: theme === 'dark' ? '#c3ff2e' : '#4b5563' }} />
              </button>
              <h1 className="font-bold text-lg" style={{ color: theme === 'dark' ? '#f0f0f0' : '#111827' }}>Bildirishnomalar</h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5" style={{ overscrollBehavior: 'contain' }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-32">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: theme === 'dark' ? 'rgba(195,255,46,0.06)' : '#f3f4f6' }}>
                  <Bell className="w-9 h-9" style={{ color: theme === 'dark' ? 'rgba(195,255,46,0.3)' : '#d1d5db' }} />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: theme === 'dark' ? '#e8f5e9' : '#111827' }}>Bildirishnomalar yo'q</p>
                <p className="text-sm text-center" style={{ color: theme === 'dark' ? '#6b7280' : '#9ca3af' }}>Yangi bildirishnomalar bu yerda ko'rinadi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: theme === 'dark' ? '#1a1f1a' : '#ffffff', border: `1px solid ${theme === 'dark' ? 'rgba(195,255,46,0.08)' : '#e5e7eb'}` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: n.type === 'gift' ? (theme === 'dark' ? 'rgba(251,191,36,0.12)' : '#fef3c7') : n.type === 'achievement' ? (theme === 'dark' ? 'rgba(16,185,129,0.12)' : '#d1fae5') : (theme === 'dark' ? 'rgba(99,102,241,0.12)' : '#e0e7ff') }}>
                      {n.type === 'gift' ? <Gift className="w-5 h-5" style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706' }} /> : n.type === 'achievement' ? <Trophy className="w-5 h-5" style={{ color: theme === 'dark' ? '#10b981' : '#059669' }} /> : <Bell className="w-5 h-5" style={{ color: theme === 'dark' ? '#818cf8' : '#4f46e5' }} />}
                    </div>
                    <p className="text-sm flex-1" style={{ color: theme === 'dark' ? '#e8f5e9' : '#374151' }}>{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
