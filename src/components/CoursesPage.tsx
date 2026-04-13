import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCourses, categories } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { 
  Globe, Calculator, Atom, Code, Sparkles, Lock, 
  Play, Check, LockKeyhole 
} from 'lucide-react';
import LessonPlayer from './LessonPlayer';
import { lessonSteps } from '../data/lessonContent';

export default function CoursesPage() {
  const { user, updateXp, completeCourse, theme } = useUser();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [startedLessons, setStartedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string; courseId: string } | null>(null);

  const filteredCourses = activeCategory === 'all'
    ? mockCourses
    : mockCourses.filter(c => c.category === activeCategory);

  const getCourseProgress = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return 0;
    const completed = course.lessons.filter(l => l.completed || startedLessons.includes(l.id)).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const getIcon = (category: string) => {
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

  const selectedCourseData = mockCourses.find(c => c.id === selectedCourse);
  const selectedCourseProgress = useMemo(
    () => (selectedCourseData ? getCourseProgress(selectedCourseData.id) : 0),
    [selectedCourseData, startedLessons],
  );

  useEffect(() => {
    document.body.style.overflow = selectedCourse ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCourse]);

  const startLesson = (courseId: string, lessonId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      setActiveLesson({ id: lessonId, title: lesson.title, courseId });
    }
  };

  const handleLessonComplete = () => {
    if (!activeLesson) return;
    if (!startedLessons.includes(activeLesson.id)) {
      setStartedLessons((current) => [...current, activeLesson.id]);
      updateXp(10);
    }
    const course = mockCourses.find(c => c.id === activeLesson.courseId);
    if (course) {
      const completed = course.lessons.filter(l => l.completed || [...startedLessons, activeLesson.id].includes(l.id)).length;
      if (completed >= course.lessons.length) completeCourse(activeLesson.courseId);
    }
  };

  const startCourse = () => {
    if (!selectedCourseData) return;
    const nextLesson = selectedCourseData.lessons.find((lesson) => !lesson.completed) ?? selectedCourseData.lessons[0];
    startLesson(selectedCourseData.id, nextLesson.id);
  };

  return (
    <div className={`page-content min-h-screen pb-24 ${theme === 'dark' ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50'}`}>
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <h1 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Kurslar</h1>
        <p className={theme === 'dark' ? 'text-lime-200/60' : 'text-gray-500'}>O'rganishni boshlang</p>
      </motion.header>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 mb-6 overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-2">
          {categories.map((cat, index) => {
            const Icon = getIcon(cat.id);
            const isActive = activeCategory === cat.id;
            
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
                  isActive
                    ? theme === 'dark' ? 'bg-lime-400 text-black shadow-lg shadow-lime-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : theme === 'dark' ? 'bg-zinc-800/90 text-lime-100/70 border border-lime-300/10' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 space-y-4"
      >
        <AnimatePresence mode="wait">
          {filteredCourses.map((course, index) => {
            const Icon = getIcon(course.category);
            const progress = getCourseProgress(course.id);
            const isLocked = course.isPro && !user?.isPro;
            const completedLessons = course.lessons.filter(l => l.completed).length;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isLocked && setSelectedCourse(course.id)}
                className={`relative rounded-3xl p-5 shadow-sm border ${
                  theme === 'dark' ? 'bg-zinc-900 border-lime-300/8' : 'bg-white border-gray-100'
                } ${
                  isLocked ? 'opacity-80' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg`}>
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-7 h-7 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-bold truncate pr-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{course.title}</h3>
                      {course.isPro && !user?.isPro && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-xs font-medium shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-lime-200/50' : 'text-gray-500'}`}>{course.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${theme === 'dark' ? 'text-lime-200/40' : 'text-gray-400'}`}>
                          {completedLessons}/{course.lessons.length} dars
                        </span>
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-lime-400' : 'text-amber-600'}`}>
                          +{course.totalXp} XP
                        </span>
                      </div>
                      
                      {!isLocked && progress > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.2 }}
                              className="h-full bg-indigo-500 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Completed badge */}
                {progress === 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Course Detail Fullscreen */}
      <AnimatePresence>
        {selectedCourse && selectedCourseData && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-0 z-50 flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}
          >
            {/* Hero Header */}
            <div className={`relative w-full pt-12 pb-6 px-6 bg-gradient-to-br ${selectedCourseData.color}`}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <button
                onClick={() => setSelectedCourse(null)}
                className="relative z-10 w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  {(() => { const Icon = getIcon(selectedCourseData.category); return <Icon className="w-9 h-9 text-white" />; })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedCourseData.title}</h2>
                  <p className="text-white/80 text-sm">{selectedCourseData.description}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 -mt-0 pt-4 pb-2">
              <div className="grid grid-cols-3 gap-3">
                <div className={`rounded-2xl p-3 text-center ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-lime-400' : 'text-indigo-600'}`}>{selectedCourseData.lessons.length}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-lime-200/50' : 'text-gray-500'}`}>Darslar</p>
                </div>
                <div className={`rounded-2xl p-3 text-center ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-lime-300' : 'text-amber-500'}`}>+{selectedCourseData.totalXp}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-lime-200/50' : 'text-gray-500'}`}>XP</p>
                </div>
                <div className={`rounded-2xl p-3 text-center ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`}>{selectedCourseProgress}%</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-lime-200/50' : 'text-gray-500'}`}>Tugallangan</p>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-2 pb-32" style={{ overscrollBehavior: 'contain' }}>
              <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Darslar ro'yxati</h3>
              <div className="space-y-2">
                {selectedCourseData.lessons.map((lesson, index) => {
                  const isDone = lesson.completed || startedLessons.includes(lesson.id);
                  const prevDone = index === 0 || selectedCourseData.lessons[index - 1].completed || startedLessons.includes(selectedCourseData.lessons[index - 1].id);
                  const isLocked = !isDone && !prevDone;
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border ${
                        isDone
                          ? theme === 'dark' ? 'bg-emerald-950/60 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                          : isLocked
                            ? theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800 opacity-60' : 'bg-gray-50 border-gray-100 opacity-60'
                            : theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isDone ? 'bg-emerald-500' : isLocked ? (theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-200') : (theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100')
                        }`}>
                          {isDone ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : isLocked ? (
                            <LockKeyhole className="w-4 h-4 text-gray-400" />
                          ) : (
                            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-lime-300' : 'text-gray-500'}`}>{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${isDone ? (theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700') : isLocked ? (theme === 'dark' ? 'text-zinc-500' : 'text-gray-400') : (theme === 'dark' ? 'text-white' : 'text-gray-900')}`}>
                            {lesson.title}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>{lesson.duration} daqiqa</p>
                        </div>
                      </div>
                      {!isDone && !isLocked && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startLesson(selectedCourseData.id, lesson.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-lime-400/15' : 'bg-indigo-100'}`}
                        >
                          <Play className={`w-5 h-5 ml-0.5 ${theme === 'dark' ? 'text-lime-400' : 'text-indigo-600'}`} />
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-xl border-t px-6 pt-4 ${theme === 'dark' ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-gray-100'}`} style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startCourse}
                className={`w-full font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg ${theme === 'dark' ? 'bg-lime-400 text-black shadow-lime-500/20' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
              >
                <Play className="w-5 h-5" />
                Darsni boshlash
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Lesson Player */}
      <LessonPlayer
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        lessonTitle={activeLesson?.title || ''}
        steps={activeLesson ? (lessonSteps[activeLesson.id] || []) : []}
        xpReward={10}
        onComplete={handleLessonComplete}
      />
    </div>
  );
}
