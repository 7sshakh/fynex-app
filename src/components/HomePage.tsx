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

  const stats = [
    { label: 'Bajarilgan', value: user?.completedCourses.length || 0, icon: BookOpen, tone: colors.primary },
    { label: 'Reyting', value: '#0', icon: Trophy, tone: colors.tertiary },
    { label: 'XP', value: user?.xp || 0, icon: Zap, tone: colors.secondary },
  ];

  const weeklyBars = [42, 58, 34, 78, 45, 53, 100];
  const headerBg = theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(255,255,255,0.92)';
  const streakBg = theme === 'dark' ? 'linear-gradient(135deg,#ff734a,#ff5722)' : 'linear-gradient(135deg,#D62828,#B71C1C)';

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
            <h1 className="text-xl font-black italic tracking-[-0.04em]" style={{ color: colors.primary }}>
              {firstName}
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
        className="relative mb-6 overflow-hidden rounded-[28px] p-6 streak-glow"
        style={{ background: streakBg }}
      >
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold" style={{ color: '#fff3eb' }}>Kunlik streak</p>
              {roadmap && (
                <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white" style={{ background: roadmap.mode === 'strict' ? colors.error : colors.secondary }}>
                  {roadmap.mode} mode
                </span>
              )}
            </div>
            <h2 className="text-4xl font-black tracking-[-0.06em]" style={{ color: '#ffffff' }}>
              {progress?.streak || user?.streak || 0} kun
            </h2>
          </div>

          <div className="rounded-full p-3" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.28)' }}>
            <Flame className="h-10 w-10" style={{ color: '#fff7ef' }} />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <span className="block text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Jami XP
            </span>
            <span className="text-lg font-black text-white">{user?.xp || 0}</span>
          </div>
          <div className="rounded-full bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: theme === 'dark' ? colors.tertiary : colors.primary }}>
            START
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-8 -right-8 text-[180px] opacity-10" style={{ color: '#ffffff' }}>
          ↗
        </div>
      </motion.section>

      {/* DRILLS AND PRACTICE LAB */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 overflow-hidden rounded-[24px] p-5 relative cursor-pointer shadow-lg shadow-rose-900/10"
        style={{ background: 'linear-gradient(120deg, #be123c, #e11d48)', color: '#ffffff' }}
        onClick={() => window.dispatchEvent(new CustomEvent('fynex:openPractice'))}
      >
        <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute bottom-[-10%] left-[-10%] h-24 w-24 rounded-full bg-white/20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-black">
                Hot 
              </span>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Micro-Learning</p>
            </div>
            <h3 className="text-xl font-black tracking-tight" style={{ color: '#ffffff' }}>Practice Lab</h3>
            <p className="mt-1 text-xs text-white/80 font-medium">5-minute daily smart drills</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Flame className="h-6 w-6 text-white" />
          </div>
        </div>
      </motion.section>

      {/* IELTS / SAT MOCK EXAMS */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18 }}
        className="mb-8 overflow-hidden rounded-[24px] p-5 relative cursor-pointer shadow-xl shadow-indigo-900/10"
        style={{ background: 'linear-gradient(120deg, #1e1b4b, #312e81)', color: '#ffffff' }}
        onClick={() => window.dispatchEvent(new CustomEvent('fynex:openMockTests'))}
      >
        <div className="absolute right-[-10%] top-[-20%] h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute bottom-[-10%] left-[-10%] h-24 w-24 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                Yangi
              </span>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Mock Tests</p>
            </div>
            <h3 className="text-xl font-black tracking-tight" style={{ color: '#ffffff' }}>IELTS & SAT Testlar</h3>
            <p className="mt-1 text-xs text-white/50 font-medium">Haqiqiy imtihon muhitini his eting</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-[28px] p-5"
        style={{ background: colors.surfaceContainer }}
      >
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: colors.primary }}>
              Davom etish
            </span>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em]" style={{ color: colors.onSurface }}>
              {featuredCourse.title}
            </h3>
          </div>
          <span className="text-xs font-bold" style={{ color: colors.onSurfaceVariant }}>
            {progress ? `${progress.progress}%` : `${featuredProgress}%`}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full" style={{ background: colors.surfaceContainerHighest }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress ? progress.progress : featuredProgress}%` }}
            transition={{ duration: 0.45 }}
            className="h-full rounded-full"
            style={{ background: colors.primary }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="max-w-[70%] text-xs font-medium" style={{ color: colors.onSurfaceVariant }}>
            {featuredCourse.lessons[0]?.title || "Yangi darslar tayyor"}
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }))}
            className="rounded-full px-4 py-2 text-xs font-black uppercase transition-transform active:scale-95"
            style={{ background: colors.primary, color: colors.onPrimary }}
          >
            Davom etish
          </button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <div
          className="flex aspect-square flex-col justify-between rounded-[28px] p-5"
          style={{ background: colors.surfaceContainerLow }}
        >
          <BookOpen className="h-8 w-8" style={{ color: colors.primary }} />
          <div>
            <div className="text-3xl font-black tracking-[-0.06em]" style={{ color: colors.onSurface }}>
              {user?.completedCourses.length || 0}
            </div>
            <div className="text-[11px] font-bold uppercase leading-tight tracking-[0.16em]" style={{ color: colors.onSurfaceVariant }}>
              Yakunlangan kurslar
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {stats.slice(1).map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-[24px] p-4"
                style={{ background: colors.surfaceContainerLow }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${stat.tone}22` }}>
                  <Icon className="h-5 w-5" style={{ color: stat.tone }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: colors.onSurfaceVariant }}>
                    {stat.label}
                  </p>
                  <p className="text-lg font-black" style={{ color: colors.onSurface }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>



      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mb-6 rounded-[28px] p-6"
        style={{ background: colors.surfaceContainer }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.24em]" style={{ color: colors.onSurfaceVariant }}>
            Haftalik progress
          </h3>
          <span className="text-xs font-bold" style={{ color: colors.primary }}>
            +24% bugun
          </span>
        </div>

        <div className="flex h-24 items-end gap-2">
          {weeklyBars.map((value, index) => (
            <div
              key={index}
              className="w-full rounded-t-md"
              style={{
                height: `${value}%`,
                background: index === weeklyBars.length - 1 ? colors.primary : colors.surfaceContainerHighest,
                boxShadow: index === weeklyBars.length - 1 ? '0 -8px 16px rgba(195,255,46,0.2)' : 'none',
              }}
            />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black tracking-[-0.04em]" style={{ color: colors.onSurface }}>
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
              onClick={() => completeTask(0, idx)}
              className="flex items-center gap-4 rounded-[24px] p-4 cursor-pointer"
              style={{ background: task.completed ? colors.surfaceContainerHigh : colors.surfaceContainerLow, opacity: task.completed ? 0.6 : 1 }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors"
                style={{ background: task.completed ? colors.primary : colors.surfaceContainer, borderColor: task.completed ? colors.primary : `${colors.outlineVariant}33` }}
              >
                {task.completed ? <CheckCircle2 className="h-5 w-5 text-white" /> : <Play className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold" style={{ color: colors.onSurface, textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                  {task.duration} daqiqa • {task.type}
                </p>
              </div>

              {!task.completed && (
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors active:scale-95"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
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
              className="flex items-center gap-4 rounded-[24px] p-4"
              style={{ background: colors.surfaceContainerLow }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border"
                style={{ background: colors.surfaceContainer, borderColor: `${colors.outlineVariant}33` }}
              >
                <Play className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold" style={{ color: colors.onSurface }}>
                  {challenge.title}
                </h4>
                <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                  +{challenge.xp} XP
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }))}
                className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors active:scale-95"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                <ChevronRight className="h-4 w-4" />
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
