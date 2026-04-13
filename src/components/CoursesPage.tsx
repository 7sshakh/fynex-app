import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCourses, categories } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { 
  Globe, Calculator, Atom, Code, Sparkles, Lock, 
  Play, Check 
} from 'lucide-react';

export default function CoursesPage() {
  const { user, updateXp, completeCourse } = useUser();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [startedLessons, setStartedLessons] = useState<string[]>([]);

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
    if (!startedLessons.includes(lessonId)) {
      setStartedLessons((current) => [...current, lessonId]);
      updateXp(10);
    }
    if (getCourseProgress(courseId) >= 100) {
      completeCourse(courseId);
    }
  };

  const startCourse = () => {
    if (!selectedCourseData) return;
    const nextLesson = selectedCourseData.lessons.find((lesson) => !lesson.completed) ?? selectedCourseData.lessons[0];
    startLesson(selectedCourseData.id, nextLesson.id);
  };

  return (
    <div className="page-content min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Kurslar</h1>
        <p className="text-gray-500">O'rganishni boshlang</p>
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
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-gray-600 border border-gray-200'
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
                className={`relative bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${
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
                      <h3 className="font-bold text-gray-900 truncate pr-2">{course.title}</h3>
                      {course.isPro && !user?.isPro && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-xs font-medium shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {completedLessons}/{course.lessons.length} dars
                        </span>
                        <span className="text-xs text-amber-600 font-medium">
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
            className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
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
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-indigo-600">{selectedCourseData.lessons.length}</p>
                  <p className="text-xs text-gray-500">Darslar</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-500">+{selectedCourseData.totalXp}</p>
                  <p className="text-xs text-gray-500">XP</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-500">{selectedCourseProgress}%</p>
                  <p className="text-xs text-gray-500">Tugallangan</p>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-32">
              <h3 className="font-bold text-gray-900 mb-3">Darslar ro'yxati</h3>
              <div className="space-y-2">
                {selectedCourseData.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border ${
                      lesson.completed || startedLessons.includes(lesson.id)
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        lesson.completed || startedLessons.includes(lesson.id) ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}>
                        {lesson.completed || startedLessons.includes(lesson.id) ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-gray-500">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${lesson.completed || startedLessons.includes(lesson.id) ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-400">{lesson.duration} daqiqa</p>
                      </div>
                    </div>
                    {!(lesson.completed || startedLessons.includes(lesson.id)) && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startLesson(selectedCourseData.id, lesson.id)}
                        className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 text-indigo-600 ml-0.5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 pt-4 pb-safe">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startCourse}
                className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Play className="w-5 h-5" />
                Darsni boshlash
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
