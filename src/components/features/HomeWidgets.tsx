import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Smile, Frown, Meh, Coffee, Zap, Brain, X, ChevronRight,
  Clock, BookOpen, Flame, Target, CalendarDays, Lightbulb,
  Bookmark, Volume2, RotateCcw, Trophy, Timer, Sparkles, Heart
} from 'lucide-react';
import { getPalette } from '../../theme';
import { useUser } from '../../context/UserContext';
import { hideNav, showNav } from '../BottomNav';
import {
  loadFeatures, saveFeatures, updateFeatures, todayKey,
  DAILY_FACTS, type Mood, type FeatureState, getLocalizedDailyFact
} from '../../lib/featureStore';

// ═══════════════════════════════════════════════════════════
// 1. MOOD SENSOR — "Bugun qanday kayfiyatdasiz?"
// ═══════════════════════════════════════════════════════════
const getMoods = (t: any): { id: Mood; emoji: string; label: string; color: string }[] => [
  { id: 'great', emoji: '🔥', label: t.mood_great, color: '#4ade80' },
  { id: 'good', emoji: '😊', label: t.mood_good, color: '#60a5fa' },
  { id: 'neutral', emoji: '😐', label: t.mood_neutral, color: '#fbbf24' },
  { id: 'tired', emoji: '😴', label: t.mood_tired, color: '#f97316' },
  { id: 'stressed', emoji: '😰', label: t.mood_stressed, color: '#ef4444' },
];

export function MoodSensor({ onClose }: { onClose: () => void }) {
  const { theme, t } = useUser();
  const colors = getPalette(theme);
  const [selected, setSelected] = useState<Mood | null>(null);

  const handleSelect = (mood: Mood) => {
    setSelected(mood);
    updateFeatures(s => ({ ...s, mood: { current: mood, setAt: todayKey() } }));
    setTimeout(onClose, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10030] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-[32px] border-t border-white/10 p-6"
        style={{ background: colors.surfaceContainer, paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <h3 className="mb-1 mt-4 text-xl font-black tracking-tight" style={{ color: colors.onSurface }}>
          {t.mood_title} 
        </h3>
        <p className="mb-6 text-sm" style={{ color: colors.onSurfaceVariant }}>
          {t.mood_desc}
        </p>
        <div className="flex justify-between gap-2">
          {getMoods(t).map((m) => {
            const sel = selected === m.id;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(m.id)}
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl py-4 transition-all"
                style={{
                  background: sel ? `${m.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${sel ? m.color : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: sel ? `0 0 20px ${m.color}33` : 'none',
                }}
              >
                <motion.span className="text-2xl" animate={sel ? { scale: [1, 1.3, 1] } : {}}>{m.emoji}</motion.span>
                <span className="text-[11px] font-bold" style={{ color: sel ? m.color : colors.onSurfaceVariant }}>{m.label}</span>
              </motion.button>
            );
          })}
        </div>
        {selected && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center text-sm font-medium" style={{ color: getMoods(t).find(m => m.id === selected)?.color }}>
            {selected === 'tired' || selected === 'stressed' ? t.mood_tired_resp : t.mood_great_resp}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. YESTERDAY RECAP — "Kecha nima o'rgandingiz?"
// ═══════════════════════════════════════════════════════════
export function YesterdayRecap({ onDismiss }: { onDismiss: () => void }) {
  const { theme, t, lang } = useUser();
  const colors = getPalette(theme);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const state = loadFeatures();
  const session = state.sessions.find(s => s.date === yKey);

  if (!session || session.minutes === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      className="mb-6 overflow-hidden rounded-[24px] border p-5 relative"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))', borderColor: 'rgba(99,102,241,0.2)' }}
    >
      <button onClick={onDismiss} className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-white/10">
        <X className="h-4 w-4 text-indigo-300/50" />
      </button>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <RotateCcw className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-black text-indigo-300">{t.recap_title} 📖</h3>
          <p className="mt-1 text-[12px] font-medium text-white/60">
            {session.minutes} {t.home_min} • {session.xpEarned} {t.leaderboard_xp} • {session.lessonsCompleted} {t.courses_lessons_count}
          </p>
          <p className="mt-2 text-[12px] text-white/50">{t.recap_desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. DAILY FACT — "Kunlik bilim donam"
// ═══════════════════════════════════════════════════════════
export function DailyFact() {
  const { theme, lang, t } = useUser();
  const colors = getPalette(theme);
  const state = loadFeatures();
  const today = todayKey();

  let factIdx = state.dailyFactIndex;
  if (state.dailyFactDate !== today) {
    factIdx = (state.dailyFactIndex + 1) % DAILY_FACTS.length;
    updateFeatures(s => ({ ...s, dailyFactIndex: factIdx, dailyFactDate: today }));
  }

  const fact = getLocalizedDailyFact(factIdx, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-[24px] border px-5 py-4"
      style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.06), rgba(250,204,21,0.02))', borderColor: 'rgba(250,204,21,0.15)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{fact.emoji}</span>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/80">{t.fact_label}</span>
          <p className="mt-1 text-[13px] leading-relaxed font-medium text-white/75">{fact.fact}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. QUICK FLASH — 60 soniyali tezkor mashq
// ═══════════════════════════════════════════════════════════
const getQuickWords = (t: any) => [
  { en: 'Accomplish', tr: t.word_accomplish }, { en: 'Crucial', tr: t.word_crucial },
  { en: 'Enhance', tr: t.word_enhance }, { en: 'Determine', tr: t.word_determine },
  { en: 'Significant', tr: t.word_significant }, { en: 'Abandon', tr: t.word_abandon },
  { en: 'Acquire', tr: t.word_acquire }, { en: 'Beneficial', tr: t.word_beneficial },
  { en: 'Comprehensive', tr: t.word_comprehensive }, { en: 'Demonstrate', tr: t.word_demonstrate },
  { en: 'Elaborate', tr: t.word_elaborate }, { en: 'Fundamental', tr: t.word_fundamental },
];

export function QuickFlashButton({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { theme, t } = useUser();
  const QUICK_WORDS = getQuickWords(t);
  const colors = getPalette(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isOpen || finished) return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, finished]);

  useEffect(() => {
    onOpenChange?.(isOpen);
    if (isOpen) hideNav();
    else showNav();
    return () => showNav();
  }, [isOpen, onOpenChange]);

  const nextWord = () => {
    setFlipped(false);
    setScore(s => s + 1);
    setCurrent(c => (c + 1) % QUICK_WORDS.length);
  };

  const startGame = () => {
    setIsOpen(true);
    setCurrent(Math.floor(Math.random() * QUICK_WORDS.length));
    setFlipped(false);
    setTimer(60);
    setScore(0);
    setFinished(false);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={startGame}
        className="mb-6 flex w-full items-center gap-4 rounded-[24px] border px-5 py-4 text-left transition-all"
        style={{ background: 'linear-gradient(135deg, rgba(232,121,249,0.08), rgba(232,121,249,0.02))', borderColor: 'rgba(232,121,249,0.2)' }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #e879f9, #a855f7)' }}>
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-black text-fuchsia-300">{t.quick_title} ⚡</h3>
          <p className="mt-0.5 text-[12px] text-white/50">{t.quick_desc}</p>
        </div>
        <ChevronRight className="ml-auto h-5 w-5 text-fuchsia-400/40" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10020] flex flex-col items-center justify-center"
            style={{ background: colors.background }}
          >
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-12 rounded-full p-2" style={{ background: colors.surfaceContainer }}>
              <X className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>

            {!finished ? (
              <div className="flex w-full max-w-sm flex-col items-center px-6">
                <div className="mb-6 flex w-full items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: colors.primary }}>{t.quick_learned}: {score}</span>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" style={{ color: timer < 10 ? '#ef4444' : colors.onSurfaceVariant }} />
                    <span className="text-2xl font-black tabular-nums" style={{ color: timer < 10 ? '#ef4444' : colors.onSurface }}>{timer}s</span>
                  </div>
                </div>

                <motion.div
                  key={current}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setFlipped(!flipped)}
                  className="flex h-52 w-full cursor-pointer items-center justify-center rounded-[28px] border"
                  style={{ background: colors.surfaceContainer, borderColor: `${colors.primary}33`, perspective: 1000, transformStyle: 'preserve-3d' }}
                >
                  <div style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }} className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.onSurfaceVariant }}>{t.quick_lang_en}</span>
                    <span className="mt-2 text-3xl font-black" style={{ color: colors.onSurface }}>{QUICK_WORDS[current].en}</span>
                    <span className="mt-4 text-xs" style={{ color: colors.onSurfaceVariant }}>{t.quick_flip}</span>
                  </div>
                  <div style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }} className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.primary }}>{t.quick_lang_tr}</span>
                    <span className="mt-2 text-3xl font-black" style={{ color: colors.primary }}>{QUICK_WORDS[current].tr}</span>
                  </div>
                </motion.div>

                {flipped && (
                  <motion.button
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={nextWord}
                    className="mt-6 w-full rounded-full py-4 text-center text-base font-black"
                    style={{ background: colors.primary, color: colors.onPrimary }}
                  >
                    {t.quick_known} →
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center px-8">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 2, duration: 0.5 }} className="mb-4 text-6xl">🎉</motion.div>
                <h2 className="text-3xl font-black" style={{ color: colors.onSurface }}>{t.quick_awesome}</h2>
                <p className="mt-2 text-lg font-bold" style={{ color: colors.primary }}>{score} {t.quick_words_learned}</p>
                <p className="mt-1 text-sm" style={{ color: colors.onSurfaceVariant }}>60 {t.home_min}</p>
                <button onClick={() => setIsOpen(false)} className="mt-8 rounded-full px-8 py-3 font-black" style={{ background: colors.primary, color: colors.onPrimary }}>
                  {t.profile_cancel}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. EXAM COUNTDOWN — "Imtihon kunigacha"
// ═══════════════════════════════════════════════════════════
export function ExamCountdown() {
  const { theme, t } = useUser();
  const colors = getPalette(theme);
  const state = loadFeatures();
  const [showSetup, setShowSetup] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalDate, setGoalDate] = useState('');

  if (!state.examGoal && !showSetup) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowSetup(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex w-full items-center gap-4 rounded-[24px] border px-5 py-4 text-left"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06]">
          <CalendarDays className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
        </div>
        <div>
          <h3 className="text-[14px] font-bold" style={{ color: colors.onSurface }}>{t.exam_setup_title}</h3>
          <p className="mt-0.5 text-[12px]" style={{ color: colors.onSurfaceVariant }}>{t.exam_setup_desc}</p>
        </div>
        <ChevronRight className="ml-auto h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
      </motion.button>
    );
  }

  if (showSetup) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-[24px] border p-5" style={{ background: colors.surfaceContainer, borderColor: `${colors.primary}33` }}>
        <h3 className="mb-4 text-lg font-black" style={{ color: colors.onSurface }}>{t.exam_goal_title} 🎯</h3>
        <input value={goalName} onChange={e => setGoalName(e.target.value)} placeholder={t.exam_placeholder} className="mb-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 focus:border-lime-300/40 focus:outline-none" />
        <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white focus:border-lime-300/40 focus:outline-none" />
        <div className="flex gap-2">
          <button onClick={() => setShowSetup(false)} className="flex-1 rounded-full py-3 text-sm font-bold text-white/60">{t.profile_cancel}</button>
          <button
            onClick={() => {
              if (goalName && goalDate) {
                updateFeatures(s => ({ ...s, examGoal: { name: goalName, date: goalDate, dailyMinutes: 30 } }));
                setShowSetup(false);
              }
            }}
            disabled={!goalName || !goalDate}
            className="flex-1 rounded-full py-3 text-sm font-black disabled:opacity-30"
            style={{ background: colors.primary, color: colors.onPrimary }}
          >
            {t.profile_save}
          </button>
        </div>
      </motion.div>
    );
  }

  const exam = state.examGoal!;
  const daysLeft = Math.max(0, Math.ceil((new Date(exam.date).getTime() - Date.now()) / 86400000));
  const urgency = daysLeft < 7 ? '#ef4444' : daysLeft < 30 ? '#f59e0b' : '#10b981';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-[24px] border p-5 relative"
      style={{ background: `linear-gradient(135deg, ${urgency}12, ${urgency}04)`, borderColor: `${urgency}33` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: urgency }}>{exam.name}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums" style={{ color: urgency }}>{daysLeft}</span>
            <span className="text-sm font-bold text-white/60">{t.exam_days_left}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="text-3xl">
          {daysLeft < 7 ? '🔥' : daysLeft < 30 ? '⏰' : '📅'}
        </motion.div>
      </div>
      <button onClick={() => updateFeatures(s => ({ ...s, examGoal: null }))} className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/10">
        <X className="h-3.5 w-3.5 text-white/30" />
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 6. FOCUS TIMER — Pomodoro
// ═══════════════════════════════════════════════════════════
export function FocusTimerWidget({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { theme, t } = useUser();
  const colors = getPalette(theme);
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s === 0) {
          if (minutes === 0) {
            setIsBreak(b => !b);
            setMinutes(isBreak ? 25 : 5);
            setSeconds(0);
            return 0;
          }
          setMinutes(m => m - 1);
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, minutes, isBreak]);

  const progress = isBreak
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  useEffect(() => {
    onOpenChange?.(open);
    if (open) hideNav();
    else showNav();
    return () => showNav();
  }, [open, onOpenChange]);

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex w-full items-center gap-4 rounded-[24px] border px-5 py-4 text-left"
        style={{
          background: isBreak ? 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.02))' : `linear-gradient(135deg, ${colors.primary}12, ${colors.primary}04)`,
          borderColor: isBreak ? 'rgba(52,211,153,0.2)' : `${colors.primary}33`,
        }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: isBreak ? 'rgba(52,211,153,0.2)' : `${colors.primary}22` }}>
          {isBreak ? <Coffee className="h-5 w-5 text-emerald-400" /> : <Timer className="h-5 w-5" style={{ color: colors.primary }} />}
        </div>
        <div>
          <h3 className="text-[14px] font-black" style={{ color: colors.onSurface }}>{t.focus_mode}</h3>
          <p className="mt-0.5 text-[12px]" style={{ color: colors.onSurfaceVariant }}>{t.focus_mode_desc}</p>
        </div>
        <ChevronRight className="ml-auto h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10020] flex flex-col"
            style={{ background: colors.background }}
          >
            <div
              className="px-5 pb-4"
              style={{
                paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 16px))',
                background: 'rgba(0,0,0,0.18)',
                borderBottom: `1px solid ${colors.outlineVariant}33`,
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black" style={{ color: colors.onSurface }}>{t.focus_mode}</h3>
                <button onClick={() => setOpen(false)} className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.surfaceContainer, color: colors.onSurfaceVariant }}>
                  {t.profile_cancel}
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-8">
              <motion.div animate={{ scale: isActive ? [1, 1.04, 1] : 1 }} transition={{ repeat: isActive ? Infinity : 0, duration: 1.4 }} className="mb-8 flex h-52 w-52 items-center justify-center rounded-full border-2" style={{ borderColor: `${colors.primary}55`, background: `${colors.primary}10` }}>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: colors.onSurfaceVariant }}>{isBreak ? t.focus_break : t.focus_work}</p>
                  <p className="mt-2 text-5xl font-black tabular-nums" style={{ color: colors.onSurface }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </p>
                </div>
              </motion.div>

              <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div className="h-full rounded-full" style={{ background: isBreak ? '#34d399' : colors.primary, width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>

              <div className="flex w-full max-w-md gap-3">
                <button
                  onClick={() => {
                    setIsActive((current) => !current);
                  }}
                  className="flex-1 rounded-full py-4 text-base font-black"
                  style={{ background: colors.primary, color: colors.onPrimary }}
                >
                  {isActive ? t.focus_stop : t.focus_start}
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setIsBreak(false);
                    setMinutes(25);
                    setSeconds(0);
                  }}
                  className="flex-1 rounded-full py-4 text-base font-black"
                  style={{ background: colors.surfaceContainer, color: colors.onSurfaceVariant }}
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// 7. WEEKLY REPORT CARD
// ═══════════════════════════════════════════════════════════
export function WeeklyReport({ onDismiss }: { onDismiss: () => void }) {
  const { theme, t } = useUser();
  const colors = getPalette(theme);
  const state = loadFeatures();

  // Calculate last 7 days stats
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last7.push(state.sessions.find(s => s.date === key) || { date: key, minutes: 0, xpEarned: 0, lessonsCompleted: 0, mistakeCount: 0 });
  }

  const totalMin = last7.reduce((a, s) => a + s.minutes, 0);
  const totalXp = last7.reduce((a, s) => a + s.xpEarned, 0);
  const totalLessons = last7.reduce((a, s) => a + s.lessonsCompleted, 0);
  const activeDays = last7.filter(s => s.minutes > 0).length;

  if (totalMin === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="mb-6 overflow-hidden rounded-[24px] border p-5 relative"
      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', borderColor: 'rgba(16,185,129,0.2)' }}
    >
      <button onClick={onDismiss} className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-white/10">
        <X className="h-4 w-4 text-emerald-300/40" />
      </button>
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-5 w-5 text-emerald-400" />
        <span className="text-sm font-black text-emerald-300">{t.weekly_results}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Daqiqa', key: 'home_min' as const, value: totalMin, icon: '⏱️' },
          { label: 'XP', key: 'leaderboard_xp' as const, value: totalXp, icon: '⚡' },
          { label: 'Darslar', key: 'courses_lessons_count' as const, value: totalLessons, icon: '📚' },
          { label: 'Faol kun', key: 'active_days' as const, value: activeDays, icon: '🔥' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-lg">{s.icon}</div>
            <div className="text-lg font-black" style={{ color: colors.onSurface }}>{s.value}</div>
            <div className="text-[10px] font-bold text-white/40">{t[s.key]}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 8. (REMOVED) SMART BREAK OVERLAY
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 9. SLEEP GUARD — "Ertaga davom etamiz?"
// ═══════════════════════════════════════════════════════════
export function SleepGuard({ onContinue, onSleep }: { onContinue: () => void; onSleep: () => void }) {
  const { t } = useUser();
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-6 w-full max-w-sm rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-2xl">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4 text-5xl">🌙</motion.div>
        <h2 className="mb-2 text-2xl font-black text-white">{t.sleep_title}</h2>
        <p className="mb-6 text-sm text-white/60 leading-relaxed">
          {t.sleep_desc}
        </p>
        <div className="flex flex-col gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onSleep} className="w-full rounded-full bg-indigo-500 py-4 text-base font-black text-white">
            {t.sleep_confirm}
          </motion.button>
          <button onClick={onContinue} className="w-full rounded-full py-3 text-sm font-bold text-white/40">
            {t.home_continue}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 10. ACHIEVEMENT POPUP
// ═══════════════════════════════════════════════════════════
export function AchievementPopup({ title, icon, onClose }: { title: string; icon: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);

  return (
    <motion.div
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed left-4 right-4 top-14 z-[10000] mx-auto max-w-sm overflow-hidden rounded-[24px] border border-amber-400/30 p-4"
      style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-4">
        <motion.span animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="text-3xl">{icon}</motion.span>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{getTranslations(getCurrentLang()).ach_new}</span>
          <p className="mt-0.5 text-sm font-bold text-white">{title}</p>
        </div>
        <Sparkles className="ml-auto h-5 w-5 text-amber-400" />
      </div>
    </motion.div>
  );
}
