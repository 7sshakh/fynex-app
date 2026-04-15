import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, ChevronRight, Flame, Play, Trophy, X, Zap, CheckCircle2, Gift, TrendingUp, Megaphone, GraduationCap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { mockCourses, dailyChallenges } from '../data/mockData';
import { hideNav, showNav } from './BottomNav';
import { getPalette } from '../theme';
import { Roadmap } from '../lib/roadmap';
import { ProgressData, markTaskComplete, updateDailyAccountability, saveProgress } from '../lib/progress';

const mockNotifications = [
  { id: '1', icon: Gift, title: 'Fynex 3.0 yangilandi!', desc: 'Yangi kurslar va yaxshilangan dizayn sizni kutmoqda.', time: 'Bugun', accent: '#c3ff2e' },
  { id: '2', icon: TrendingUp, title: 'Streak 3 kunga yetdi!', desc: "Ajoyib! O'qishni davom eting va streak'ni yo'qotmang.", time: 'Bugun', accent: '#34d399' },
  { id: '3', icon: Megaphone, title: 'PRO obuna chegirmasi', desc: 'Hozir PRO ga obuna bo\'ling va 30% chegirma oling.', time: 'Kecha', accent: '#fbbf24' },
  { id: '4', icon: CheckCircle2, title: 'Ingliz Tili Beginner tugallandi', desc: 'Tabriklaymiz! Keyingi kursni boshlang.', time: '2 kun oldin', accent: '#60a5fa' },
];

export default function HomePage() {
  const { user, theme } = useUser();
  const colors = getPalette(theme);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const r = localStorage.getItem('fynex_roadmap');
    if (r) setRoadmap(JSON.parse(r));
    const p = localStorage.getItem('fynex_progress');
    if (p) setProgress(JSON.parse(p));
  }, []);

  const completeTask = (dayIdx: number, taskIdx: number) => {
    if (!roadmap || !progress) return;
    const newRm = { ...roadmap };
    if (newRm.dailyTasks[dayIdx].tasks[taskIdx].completed) return;

    newRm.dailyTasks[dayIdx].tasks[taskIdx].completed = true;
    setRoadmap(newRm);
    localStorage.setItem('fynex_roadmap', JSON.stringify(newRm));

    const totalTasks = newRm.dailyTasks.reduce((acc, d) => acc + d.tasks.length, 0);
    const newProg = markTaskComplete(progress, totalTasks);
    
    // Check if day is fully done
    const allDone = newRm.dailyTasks[dayIdx].tasks.every((t) => t.completed);
    if (allDone) {
      const finalProg = updateDailyAccountability(newProg, true, false, roadmap.mode === 'strict');
      setProgress(finalProg);
      saveProgress(finalProg);
    } else {
      setProgress(newProg);
      saveProgress(newProg);
    }
  };

  const openNotifications = () => { setShowNotifications(true); hideNav(); };
  const closeNotifications = () => { setShowNotifications(false); showNav(); };

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'User';
  const featuredCourse =
    mockCourses.find((course) => !user?.completedCourses.includes(course.id)) ?? mockCourses[0];

  const featuredProgress = featuredCourse
    ? Math.round(((user?.completedCourses.includes(featuredCourse.id) ? featuredCourse.lessons.length : 0) / featuredCourse.lessons.length) * 100)
    : 0;

  const weeklyBars = [42, 58, 34, 78, 45, 53, 100];
  const headerBg = theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(255,255,255,0.92)';

  return (
    <div className="page-content min-h-full px-6 pb-8" style={{ background: colors.background }}>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 -mx-6 mb-6 flex items-center justify-between px-6 pb-4 pt-safe-top backdrop-blur-xl"
        style={{ background: headerBg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ borderColor: `${colors.primary}66`, background: colors.surfaceContainer }}
          >
            <span className="text-sm font-black" style={{ color: colors.primary }}>
              {firstName.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.onSurfaceVariant }}>
              FYNEX
            </span>
            <h1 className="text-lg font-black italic tracking-[-0.04em]" style={{ color: colors.primary }}>
              Salom, {firstName}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={openNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ background: colors.surfaceContainer }}
        >
          <Bell className="h-5 w-5" style={{ color: colors.primary }} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2" style={{ background: colors.tertiary, borderColor: colors.background }} />
        </button>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative mb-6 overflow-hidden rounded-[24px] p-6 shadow-lg shadow-orange-900/10 cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: '#ffffff' }}
      >
        <div className="absolute right-[-10%] top-[-20%] h-40 w-40 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
          <Flame className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                Kunlik streak
              </span>
              {roadmap && (
                <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm" style={{ background: roadmap.mode === 'strict' ? colors.error : colors.secondary }}>
                  {roadmap.mode} mode
                </span>
              )}
            </div>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#ffffff' }}>
              {progress?.streak || user?.streak || 0} kun
            </h2>
          </div>

          <div className="rounded-full h-14 w-14 flex items-center justify-center bg-white/20 backdrop-blur-md shadow-inner shadow-white/30">
            <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 4, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Flame className="h-7 w-7 text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]" />
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-white/70">
              Jami XP
            </span>
            <span className="text-xl font-black text-white drop-shadow-md">{user?.xp || 0}</span>
          </div>
          <div className="rounded-full bg-white px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-900/40 text-orange-600">
            START
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-[24px] p-6 relative overflow-hidden group cursor-pointer shadow-lg shadow-emerald-900/10"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
        onClick={() => window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }))}
      >
        <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full bg-white/10 blur-md group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
          <BookOpen className="h-28 w-28 text-white" />
        </div>
        
        <div className="relative z-10 flex items-end justify-between mb-4">
          <div className="max-w-[70%]">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm mb-2 shadow-sm">
              Davom etish
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
              {featuredCourse.title}
            </h3>
          </div>
          <span className="text-sm font-black text-white/90 drop-shadow-md bg-black/20 px-3 py-1 rounded-full">
            {progress ? `${progress.progress}%` : `${featuredProgress}%`}
          </span>
        </div>

        <div className="relative z-10 h-2 overflow-hidden rounded-full bg-black/20 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress ? progress.progress : featuredProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          />
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <p className="max-w-[70%] text-xs font-semibold text-white/80 line-clamp-1">
            {featuredCourse.lessons[0]?.title || "Yangi darslar tayyor"}
          </p>
          <div className="rounded-full w-10 h-10 flex justify-center items-center backdrop-blur-md bg-white/20 hover:bg-white/30 transition-colors shadow-inner shadow-white/10">
             <Play className="h-4 w-4 text-white ml-0.5" />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <div
          className="flex aspect-square flex-col justify-between rounded-[24px] p-5 relative overflow-hidden group shadow-lg shadow-blue-900/10 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
        >
          <div className="absolute right-[-10%] top-[-10%] h-24 w-24 rounded-full bg-white/10 blur-md group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute right-0 bottom-0 p-2 opacity-10">
            <BookOpen className="h-24 w-24 text-white" />
          </div>
          <div className="relative z-10 w-12 h-12 flex justify-center items-center rounded-full bg-white/20 backdrop-blur-md shadow-inner shadow-white/30">
             <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-white drop-shadow-md">
              {user?.completedCourses.length || 0}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80 mt-1">
              Yakunlangan kurslar
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {[
            { label: 'Reyting', value: '#0', icon: Trophy, bg: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)' },
            { label: 'XP', value: user?.xp || 0, icon: Zap, bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-[24px] p-4 relative overflow-hidden group shadow-sm cursor-default"
                style={{ background: stat.bg }}
              >
                <div className="absolute right-[-5%] top-[-10%] h-20 w-20 rounded-full bg-white/10 blur-sm group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-15">
                  <Icon className="h-16 w-16 text-white" />
                </div>
                
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[18px] bg-black/15 shadow-inner backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="relative z-10 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                    {stat.label}
                  </p>
                  <p className="text-xl font-black text-white drop-shadow-md">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* DRILLS AND PRACTICE LAB */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-8 overflow-hidden rounded-[24px] p-6 relative cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff', boxShadow: '0 20px 40px -15px rgba(225, 29, 72, 0.5)' }}
        onClick={() => window.dispatchEvent(new CustomEvent('fynex:openPractice'))}
      >
        <div className="absolute right-[-10%] top-[-20%] h-40 w-40 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute bottom-[-10%] left-[-10%] h-24 w-24 rounded-full bg-white/20 blur-md group-hover:translate-x-4 transition-transform duration-700" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow-lg shadow-yellow-400/30">
                Hot 
              </span>
              <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Micro-Learning</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight" style={{ color: '#ffffff' }}>Practice Lab</h3>
            <p className="mt-1 text-sm text-white/80 font-medium">5-minute daily smart drills</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner shadow-white/30">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Flame className="h-8 w-8 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* IELTS / SAT MOCK EXAMS */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-8 overflow-hidden rounded-[24px] p-6 relative cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)', color: '#ffffff', boxShadow: '0 20px 40px -15px rgba(49, 46, 129, 0.5)' }}
        onClick={() => window.dispatchEvent(new CustomEvent('fynex:openMockTests'))}
      >
        <div className="absolute right-[-10%] top-[-20%] h-40 w-40 rounded-full bg-white/5 blur-xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute bottom-[-10%] left-[-10%] h-32 w-32 rounded-full bg-indigo-500/20 blur-md group-hover:translate-x-4 transition-transform duration-700" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-blue-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow-lg shadow-blue-400/30">
                Yangi
              </span>
              <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Mock Tests</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight" style={{ color: '#ffffff' }}>IELTS & SAT Testlar</h3>
            <p className="mt-1 text-sm text-white/60 font-medium">Haqiqiy imtihon muhitini his eting</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-inner shadow-white/10">
             <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
              <GraduationCap className="h-8 w-8 text-blue-200 drop-shadow-[0_0_10px_rgba(191,219,254,0.5)]" />
             </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mb-8 rounded-[28px] p-6 shadow-sm border"
        style={{ background: colors.surfaceContainer, borderColor: `${colors.outlineVariant}33` }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: colors.onSurfaceVariant }}>
            Haftalik progress
          </h3>
          <span className="text-xs font-black rounded-full px-3 py-1" style={{ color: colors.primary, background: `${colors.primary}1A` }}>
            +24% bugun
          </span>
        </div>

        <div className="flex h-28 items-end gap-2.5">
          {weeklyBars.map((value, index) => (
            <div
              key={index}
              className="w-full rounded-t-lg relative group transition-all"
              style={{
                height: `${value}%`,
                background: index === weeklyBars.length - 1 ? 'linear-gradient(180deg, ' + colors.primary + ' 0%, transparent 200%)' : colors.surfaceContainerHighest,
                opacity: index === weeklyBars.length - 1 ? 1 : 0.6,
                boxShadow: index === weeklyBars.length - 1 ? `0 -8px 20px ${colors.primary}40` : 'none',
              }}
            >
              {index === weeklyBars.length - 1 && (
                <motion.div 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" 
                  style={{ background: colors.primary }}
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between pl-2">
          <h3 className="text-2xl font-black tracking-[-0.04em]" style={{ color: colors.onSurface }}>
            {roadmap ? "Shaxsiy o'quv rejangiz" : "Kunlik vazifalar"}
          </h3>
        </div>

        {roadmap && roadmap.dailyTasks[0] ? (
          roadmap.dailyTasks[0].tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 + idx * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => completeTask(0, idx)}
              className="flex items-center gap-5 rounded-[28px] p-5 cursor-pointer border shadow-sm transition-all"
              style={{ 
                background: task.completed ? colors.surfaceContainerHigh : colors.surfaceContainer, 
                borderColor: task.completed ? `${colors.primary}55` : `${colors.outlineVariant}33`,
                opacity: task.completed ? 0.7 : 1 
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border transition-colors shadow-inner"
                style={{ background: task.completed ? colors.primary : colors.surfaceContainerLow, borderColor: task.completed ? colors.primary : `${colors.outlineVariant}33` }}
              >
                {task.completed ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 ml-1" style={{ color: colors.primary }} />}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-base font-bold mb-0.5" style={{ color: task.completed ? colors.onSurfaceVariant : colors.onSurface, textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                  {task.duration} daqiqa • {task.type}
                </p>
              </div>

              {!task.completed && (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  style={{ background: `${colors.primary}15` }}
                >
                  <ChevronRight className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
              )}
            </motion.div>
          ))
        ) : (
          dailyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 + index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-5 rounded-[28px] p-5 shadow-sm border transition-shadow"
              style={{ background: colors.surfaceContainer, borderColor: `${colors.outlineVariant}22` }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] shadow-sm"
                style={{ background: colors.surfaceContainerHighest }}
              >
                <Play className="h-6 w-6 ml-1" style={{ color: colors.primary }} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-base font-bold mb-0.5" style={{ color: colors.onSurface }}>
                  {challenge.title}
                </h4>
                <p className="text-xs font-black uppercase tracking-wider" style={{ color: colors.tertiary }}>
                  +{challenge.xp} XP
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }))}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
                style={{ background: `${colors.primary}11` }}
              >
                <ChevronRight className="h-5 w-5" style={{ color: colors.primary }} />
              </button>
            </motion.div>
          ))
        )}
      </motion.section>
      {createPortal(
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex flex-col"
              style={{ background: colors.background }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                className="flex flex-col h-full"
              >
                <div
                  className="flex items-center justify-between px-6 pb-4 flex-shrink-0"
                  style={{ paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 16px))' }}
                >
                  <h2 className="text-lg font-black tracking-[-0.04em]" style={{ color: colors.primary }}>Bildirishnomalar</h2>
                  <button onClick={closeNotifications} className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceContainer }}>
                    <X className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-8" style={{ overscrollBehavior: 'contain' }}>
                  <div className="space-y-3">
                    {mockNotifications.map((n, i) => {
                      const Icon = n.icon;
                      return (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-4 rounded-[24px] p-4"
                          style={{ background: colors.surfaceContainer }}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${n.accent}18` }}>
                            <Icon className="h-5 w-5" style={{ color: n.accent }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold" style={{ color: colors.onSurface }}>{n.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed" style={{ color: colors.onSurfaceVariant }}>{n.desc}</p>
                            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.outline }}>{n.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
