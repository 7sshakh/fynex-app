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

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && selectedCourseData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.2 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-6 pb-36 overflow-y-auto max-h-[80vh] overscroll-contain">
                {/* Hero */}
                <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${selectedCourseData.color} flex items-center justify-center mb-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  {(() => {
                    const Icon = getIcon(selectedCourseData.category);
                    return <Icon className="w-16 h-16 text-white/90" />;
                  })()}
                </div>

                {/* Info */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCourseData.title}</h2>
                    <p className="text-gray-500">{selectedCourseData.description}</p>
                  </div>
                  {selectedCourseData.isPro && !user?.isPro && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-sm font-medium">
                      PRO
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
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

                {/* Lessons */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Darslar ro'yxati</h3>
                  <div className="space-y-2">
                    {selectedCourseData.lessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-2xl border ${
                          lesson.completed
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            lesson.completed ? 'bg-emerald-500' : 'bg-gray-100'
                          }`}>
                            {lesson.completed ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${lesson.completed ? 'text-emerald-700' : 'text-gray-900'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-400">{lesson.duration} daqiqa</p>
                          </div>
                        </div>
                        {!lesson.completed && (
                          <button
                            onClick={() => startLesson(selectedCourseData.id, lesson.id)}
                            className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center"
                          >
                            <Play className="w-4 h-4 text-indigo-600 ml-0.5" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startCourse}
                    className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <Play className="w-5 h-5" />
                    Darsni boshlash
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
