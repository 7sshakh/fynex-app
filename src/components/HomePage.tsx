import { motion } from 'framer-motion';
import { Bell, BookOpen, ChevronRight, Flame, Play, Trophy, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { mockCourses, dailyChallenges } from '../data/mockData';
import { getPalette } from '../theme';

export default function HomePage() {
  const { user, theme } = useUser();
  const colors = getPalette(theme);

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
  const headerBg = theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(247,248,251,0.92)';
  const streakBg = theme === 'dark' ? 'linear-gradient(135deg,#ff734a,#ff5722)' : 'linear-gradient(135deg,#86d96b,#3ea52c)';

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
          className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ background: colors.surfaceContainer }}
        >
          <Bell className="h-5 w-5" style={{ color: colors.primary }} />
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
            <p className="mb-1 text-sm font-bold" style={{ color: '#fff3eb' }}>
              Kunlik streak
            </p>
            <h2 className="text-4xl font-black tracking-[-0.06em]" style={{ color: '#ffffff' }}>
              {user?.streak || 0} kun
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

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
            {featuredProgress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full" style={{ background: colors.surfaceContainerHighest }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${featuredProgress}%` }}
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
        transition={{ delay: 0.14 }}
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
            Kunlik vazifalar
          </h3>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('fynex:navigate', { detail: 'courses' }))}
            className="text-xs font-bold"
            style={{ color: colors.primary }}
          >
            Hammasi
          </button>
        </div>

        {dailyChallenges.map((challenge, index) => (
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
        ))}
      </motion.section>
    </div>
  );
}
