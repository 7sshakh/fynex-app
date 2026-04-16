import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Atom, BookOpen, Calculator, Check, Clock3, Code, Globe, Lock, LockKeyhole, Play, Search, Sparkles, Star, X, Zap } from 'lucide-react';
import { mockCourses, categories } from '../data/mockData';
import { getLessonSteps } from '../data/lessonContent';
import { useUser } from '../context/UserContext';
import LessonPlayer from './LessonPlayer';
import { hideNav, showNav } from './BottomNav';
import { getPalette } from '../theme';

type CourseIcon = typeof Globe;

export default function CoursesPage() {
  const { user, updateXp, completeCourse, theme } = useUser();
  const colors = getPalette(theme);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<'recommended' | 'shortest' | 'xp'>('recommended');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('fynex_favorite_courses');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [startedLessons, setStartedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string; courseId: string } | null>(null);

  const selectedCourse = mockCourses.find((course) => course.id === selectedCourseId) ?? null;

  const getIcon = (category: string): CourseIcon => {
    switch (category) {
      case 'english':
      case 'russian':
        return Globe;
      case 'math':
        return Calculator;
      case 'physics':
        return Atom;
      case 'programming':
        return Code;
      default:
        return Sparkles;
    }
  };

  const getCourseProgress = (courseId: string) => {
    const course = mockCourses.find((item) => item.id === courseId);
    if (!course) return 0;
    const completed = course.lessons.filter(
      (lesson) => lesson.completed || startedLessons.includes(lesson.id) || user?.completedCourses.includes(course.id),
    ).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const filteredCourses = useMemo(() => {
    const filtered = mockCourses.filter((course) => {
      const categoryMatch = activeCategory === 'all' || course.category === activeCategory;
      const queryMatch =
        !query.trim() ||
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
    if (sortMode === 'shortest') {
      return [...filtered].sort((a, b) => {
        const aMin = a.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        const bMin = b.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        return aMin - bMin;
      });
    }
    if (sortMode === 'xp') {
      return [...filtered].sort((a, b) => b.totalXp - a.totalXp);
    }
    return [...filtered].sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });
  }, [activeCategory, query, sortMode, favorites]);

  useEffect(() => {
    document.body.style.overflow = selectedCourse ? 'hidden' : '';
    if (selectedCourse) hideNav(); else showNav();
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCourse]);

  useEffect(() => {
    if (activeLesson) hideNav();
  }, [activeLesson]);

  useEffect(() => {
    localStorage.setItem('fynex_favorite_courses', JSON.stringify(favorites));
  }, [favorites]);

  const startLesson = (courseId: string, lessonId: string) => {
    const course = mockCourses.find((item) => item.id === courseId);
    const lesson = course?.lessons.find((item) => item.id === lessonId);
    if (!lesson) return;
    setActiveLesson({ id: lessonId, title: lesson.title, courseId });
  };

  const handleLessonComplete = () => {
    if (!activeLesson) return;
    if (!startedLessons.includes(activeLesson.id)) {
      setStartedLessons((current) => [...current, activeLesson.id]);
      updateXp(10);
    }

    const course = mockCourses.find((item) => item.id === activeLesson.courseId);
    if (!course) return;

    const completedCount = course.lessons.filter(
      (lesson) => lesson.completed || lesson.id === activeLesson.id || startedLessons.includes(lesson.id),
    ).length;

    if (completedCount >= course.lessons.length) {
      completeCourse(course.id);
    }
  };

  const startCourse = () => {
    if (!selectedCourse) return;
    const nextLesson =
      selectedCourse.lessons.find((lesson, index) => {
        if (lesson.completed || startedLessons.includes(lesson.id)) return false;
        return index === 0 || selectedCourse.lessons[index - 1].completed || startedLessons.includes(selectedCourse.lessons[index - 1].id);
      }) ?? selectedCourse.lessons[0];

    startLesson(selectedCourse.id, nextLesson.id);
  };

  return (
    <div className="page-content min-h-full px-6 pb-8" style={{ background: colors.background }}>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 -mx-6 mb-6 px-6 pb-4 pt-safe-top backdrop-blur-xl"
        style={{ background: theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(255,255,255,0.92)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceContainerHigh }}>
              <BookOpen className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <h1 className="text-lg font-black tracking-[-0.04em]" style={{ color: colors.primary }}>
              Kurslar
            </h1>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-1 text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>
            O‘rganishni boshlang
          </p>
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kurslarni izlash..."
            className="w-full rounded-2xl border-b-2 px-12 py-4 text-sm focus:outline-none"
            style={{
              background: colors.surfaceContainerLowest,
              color: colors.onSurface,
              borderColor: 'transparent',
            }}
          />
        </label>
      </motion.header>

      <section className="-mx-6 mb-6 overflow-x-auto px-6 scrollbar-hide">
        <div className="flex gap-3 whitespace-nowrap">
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="rounded-full px-6 py-2.5 text-sm font-bold transition-all"
                style={{
                  background: active ? colors.primary : colors.surfaceContainer,
                  color: active ? colors.onPrimary : colors.onSurfaceVariant,
                }}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'recommended', label: 'Tavsiya', icon: Star },
          { id: 'shortest', label: 'Tez boshlash', icon: Clock3 },
          { id: 'xp', label: 'Ko‘p XP', icon: Zap },
        ].map((item) => {
          const Icon = item.icon;
          const active = sortMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSortMode(item.id as 'recommended' | 'shortest' | 'xp')}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black"
              style={{
                background: active ? `${colors.primary}22` : colors.surfaceContainerLow,
                color: active ? colors.primary : colors.onSurfaceVariant,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </section>

      <section className="space-y-5">
        {filteredCourses.map((course, index) => {
          const Icon = getIcon(course.category);
          const progress = getCourseProgress(course.id);
          const isLocked = course.isPro && !user?.isPro;
          const completedLessons = course.lessons.filter(
            (lesson) => lesson.completed || startedLessons.includes(lesson.id) || user?.completedCourses.includes(course.id),
          ).length;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[28px] p-5"
              style={{ background: colors.surfaceContainer }}
            >
              {course.isPro && (
                <div className="mb-4 flex justify-end">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]"
                    style={{ background: theme === 'dark' ? 'linear-gradient(135deg,#fbbf24,#ea580c)' : 'linear-gradient(135deg,#fb923c,#f97316)', color: '#111111' }}
                  >
                    PRO
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${colors.primary}12`, color: colors.primary }}
                >
                  {isLocked ? <Lock className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-xl font-bold leading-tight" style={{ color: colors.onSurface }}>
                    {course.title}
                  </h3>
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium" style={{ color: colors.onSurfaceVariant }}>
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>
                      {completedLessons}/{course.lessons.length} dars
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFavorites((current) => current.includes(course.id) ? current.filter((id) => id !== course.id) : [...current, course.id]);
                  }}
                  className="rounded-full p-2"
                  style={{ background: favorites.includes(course.id) ? `${colors.primary}20` : colors.surfaceContainerHighest }}
                >
                  <Star className="h-4 w-4" style={{ color: favorites.includes(course.id) ? colors.primary : colors.onSurfaceVariant, fill: favorites.includes(course.id) ? colors.primary : 'none' }} />
                </button>
              </div>

              <p className="mb-4 text-sm leading-6" style={{ color: colors.onSurfaceVariant }}>
                {course.description}
              </p>

              <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.24em]">
                <span style={{ color: progress > 0 ? colors.primary : colors.onSurfaceVariant }}>Progress</span>
                <span style={{ color: progress > 0 ? colors.primary : colors.onSurfaceVariant }}>{progress}%</span>
              </div>

              <div className="mb-4 h-2 overflow-hidden rounded-full" style={{ background: colors.surfaceContainerLowest }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35 }}
                      className="h-full rounded-full"
                      style={{ background: colors.primary }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div
                  className="flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{ background: colors.surfaceContainerHighest }}
                >
                  <Zap className="h-4 w-4" style={{ color: colors.tertiary }} />
                  <span className="text-xs font-bold" style={{ color: colors.onSurface }}>
                    +{course.totalXp} XP
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => !isLocked && setSelectedCourseId(course.id)}
                  className="rounded-full px-5 py-2.5 text-xs font-black uppercase transition-transform disabled:opacity-50 active:scale-95"
                  style={{
                    background: progress > 0 ? colors.primary : colors.surfaceBright,
                    color: progress > 0 ? colors.onPrimary : colors.onSurface,
                  }}
                >
                  {progress > 0 ? 'Davom etish' : 'Boshlash'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </section>

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 36 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: colors.background }}
          >
            <div className={`bg-gradient-to-br ${selectedCourse.color} relative px-6 pb-6 pt-12`}>
              <button
                type="button"
                onClick={() => setSelectedCourseId(null)}
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  {(() => {
                    const Icon = getIcon(selectedCourse.category);
                    return <Icon className="h-9 w-9 text-white" />;
                  })()}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="mb-1 text-2xl font-black tracking-[-0.05em] text-white">{selectedCourse.title}</h2>
                  <p className="text-sm text-white/80">{selectedCourse.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 px-6 py-4">
              <StatCard label="Darslar" value={selectedCourse.lessons.length} accent={colors.primary} bg={colors.surfaceContainerLow} sub={colors.onSurfaceVariant} />
              <StatCard label="XP" value={`+${selectedCourse.totalXp}`} accent={colors.tertiary} bg={colors.surfaceContainerLow} sub={colors.onSurfaceVariant} />
              <StatCard label="Progress" value={`${getCourseProgress(selectedCourse.id)}%`} accent={colors.secondary} bg={colors.surfaceContainerLow} sub={colors.onSurfaceVariant} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-32 pt-2" style={{ overscrollBehavior: 'contain' }}>
              <h3 className="mb-3 text-sm font-black uppercase tracking-[0.22em]" style={{ color: colors.onSurfaceVariant }}>
                Darslar ro'yxati
              </h3>

              <div className="space-y-3">
                {selectedCourse.lessons.map((lesson, index) => {
                  const isDone =
                    lesson.completed || startedLessons.includes(lesson.id) || user?.completedCourses.includes(selectedCourse.id);
                  const prevDone =
                    index === 0 ||
                    selectedCourse.lessons[index - 1].completed ||
                    startedLessons.includes(selectedCourse.lessons[index - 1].id);
                  const locked = !isDone && !prevDone;

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-[24px] border p-4"
                      style={{
                        background: isDone ? 'rgba(195,255,46,0.08)' : colors.surfaceContainer,
                        borderColor: locked ? `${colors.outlineVariant}22` : `${colors.outlineVariant}38`,
                        opacity: locked ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: isDone ? colors.primary : locked ? colors.surfaceContainerHighest : colors.surfaceContainerHighest,
                          }}
                        >
                          {isDone ? (
                            <Check className="h-5 w-5" style={{ color: colors.onPrimary }} />
                          ) : locked ? (
                            <LockKeyhole className="h-4 w-4" style={{ color: colors.onSurfaceVariant }} />
                          ) : (
                            <span className="text-sm font-black" style={{ color: colors.primary }}>
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold" style={{ color: colors.onSurface }}>
                            {lesson.title}
                          </p>
                          <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                            {lesson.duration} daqiqa
                          </p>
                        </div>
                      </div>

                      {!isDone && !locked && (
                        <button
                          type="button"
                          onClick={() => startLesson(selectedCourse.id, lesson.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: `${colors.primary}18` }}
                        >
                          <Play className="ml-0.5 h-5 w-5" style={{ color: colors.primary }} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 border-t px-6 pt-4 backdrop-blur-xl"
              style={{
                background: 'rgba(14,14,14,0.92)',
                borderColor: `${colors.outlineVariant}33`,
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
              }}
            >
              <button
                type="button"
                onClick={startCourse}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase transition-transform active:scale-[0.985]"
                style={{ background: colors.primary, color: colors.onPrimary }}
              >
                <Play className="h-5 w-5" />
                Darsni boshlash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LessonPlayer
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        lessonTitle={activeLesson?.title || ''}
        steps={activeLesson ? getLessonSteps(activeLesson.id, activeLesson.title) : []}
        xpReward={10}
        onComplete={handleLessonComplete}
      />
    </div>
  );
}

function StatCard({ label, value, accent, bg, sub }: { label: string; value: string | number; accent: string; bg: string; sub: string }) {
  return (
    <div className="rounded-[22px] p-3 text-center" style={{ background: bg }}>
      <p className="text-2xl font-black tracking-[-0.05em]" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: sub }}>
        {label}
      </p>
    </div>
  );
}
