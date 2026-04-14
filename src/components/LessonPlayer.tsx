import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, RotateCcw, Home, Zap, Volume2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import type { LessonStep, QuizStep, FillBlankStep, FlashcardStep } from '../data/lessonContent';

interface LessonPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  steps: LessonStep[];
  xpReward: number;
  onComplete: () => void;
}

/* ───── theme tokens ───── */
const light = {
  bg: '#f9f9ff', surface: '#f3f3fa', card: '#ffffff', text: '#191c20', sub: '#464555',
  primary: '#4f46e5', primaryGrad: 'linear-gradient(135deg,#4f46e5,#6366f1)',
  primaryBg: 'rgba(79,70,229,0.08)', progressTrack: '#e7e8ee',
  correct: '#10b981', correctBg: 'rgba(16,185,129,0.08)', correctBorder: '#10b981',
  wrong: '#ef4444', wrongBg: 'rgba(239,68,68,0.08)',
  accent: '#f59e0b', accentBg: 'rgba(245,158,11,0.1)',
  headerBg: 'rgba(249,249,255,0.9)', border: 'rgba(0,0,0,0.06)',
  cardShadow: '0 2px 12px rgba(79,70,229,0.06)',
};
const dark = {
  bg: '#0a0d09', surface: '#131713', card: '#1a1f1a', text: '#e8f5e9', sub: '#9ca3af',
  primary: '#c3ff2e', primaryGrad: 'linear-gradient(135deg,#c3ff2e,#9fdc16)',
  primaryBg: 'rgba(195,255,46,0.08)', progressTrack: '#1f2b1f',
  correct: '#34d399', correctBg: 'rgba(52,211,153,0.1)', correctBorder: '#34d399',
  wrong: '#f87171', wrongBg: 'rgba(248,113,113,0.1)',
  accent: '#fbbf24', accentBg: 'rgba(251,191,36,0.12)',
  headerBg: 'rgba(15,18,16,0.92)', border: 'rgba(195,255,46,0.08)',
  cardShadow: '0 2px 12px rgba(195,255,46,0.04)',
};

export default function LessonPlayer({ isOpen, onClose, lessonTitle, steps, xpReward, onComplete }: LessonPlayerProps) {
  const { theme } = useUser();
  const t = theme === 'dark' ? dark : light;
  const primaryTextOnGrad = theme === 'dark' ? '#0a0d09' : '#ffffff';

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  // quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // fill_blank state
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [blankAnswered, setBlankAnswered] = useState(false);

  // flashcard state
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0); setCompleted(false); setCorrectCount(0);
      setSelectedOption(null); setAnswered(false);
      setSelectedWord(null); setBlankAnswered(false); setFlipped(false);
    }
  }, [isOpen]);

  const resetStepState = useCallback(() => {
    setSelectedOption(null); setAnswered(false);
    setSelectedWord(null); setBlankAnswered(false); setFlipped(false);
  }, []);

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      resetStepState();
      setCurrentStep(s => s + 1);
    } else {
      setCompleted(true);
      onComplete();
    }
  }, [currentStep, steps.length, resetStepState, onComplete]);

  const progress = steps.length > 0 ? ((currentStep + (answered || blankAnswered || flipped ? 1 : 0)) / steps.length) * 100 : 0;

  if (!isOpen) return null;

  const step = steps[currentStep];

  /* ───── Completion Screen ───── */
  const renderCompletion = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-[100px] leading-none mb-4">🏆</div>
        <h2 style={{ color: t.text }} className="text-3xl font-extrabold tracking-tight mb-2">Dars tugadi!</h2>
        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl mb-3" style={{ background: t.primaryBg }}>
          <Zap className="w-5 h-5" style={{ color: t.accent }} />
          <span className="text-2xl font-bold" style={{ color: t.accent }}>+{xpReward} XP</span>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-6">
          {[
            { label: "To'g'ri", value: `${correctCount}/${steps.length}` },
            { label: 'Vaqt', value: `${mins}:${secs}` },
            { label: 'XP', value: `+${xpReward}` },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-2xl text-center" style={{ background: t.surface }}>
              <p className="text-[10px] uppercase tracking-widest mb-1 font-bold" style={{ color: t.sub }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: t.text }}>{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  /* ───── Quiz View ───── */
  const renderQuiz = (q: QuizStep) => {
    const handleSelect = (idx: number) => {
      if (answered) return;
      setSelectedOption(idx);
      setAnswered(true);
      if (idx === q.correctIndex) setCorrectCount(c => c + 1);
    };
    return (
      <motion.div key={`quiz-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 overflow-y-auto px-6 pt-6 pb-32" style={{ overscrollBehavior: 'contain' }}>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4" style={{ background: t.primaryBg, color: t.primary }}>Savol</span>
        <h2 className="text-2xl font-extrabold tracking-tight leading-tight mb-8" style={{ color: t.text }}>{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style: React.CSSProperties = { background: t.card, color: t.text, border: '2px solid transparent', boxShadow: t.cardShadow };
            if (answered) {
              if (idx === q.correctIndex) style = { background: t.correctBg, color: t.correct, border: `2px solid ${t.correctBorder}` };
              else if (idx === selectedOption) style = { background: t.wrongBg, color: t.wrong, border: `2px solid ${t.wrong}` };
            } else if (idx === selectedOption) {
              style = { ...style, border: `2px solid ${t.primary}` };
            }
            return (
              <motion.button key={idx} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(idx)} className="w-full p-5 rounded-2xl flex items-center justify-between text-left" style={style}>
                <span className="font-semibold">{opt}</span>
                {answered && idx === q.correctIndex && <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: t.correct }}><Check className="w-4 h-4 text-white" /></div>}
                {!answered && <span className="w-6 h-6 rounded-full" style={{ border: `2px solid ${t.progressTrack}` }} />}
              </motion.button>
            );
          })}
        </div>
        {answered && q.explanation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl" style={{ background: t.primaryBg, borderLeft: `4px solid ${t.primary}` }}>
            <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>Tushuntirish</p>
            <p className="text-sm leading-relaxed" style={{ color: t.sub }}>{q.explanation}</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  /* ───── Fill in the Blank View ───── */
  const renderFillBlank = (fb: FillBlankStep) => {
    const handleWordSelect = (word: string) => {
      if (blankAnswered) return;
      setSelectedWord(word);
      setBlankAnswered(true);
      if (word === fb.correctWord) setCorrectCount(c => c + 1);
    };
    const isCorrect = selectedWord === fb.correctWord;
    return (
      <motion.div key={`fb-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 overflow-y-auto px-6 pt-6 pb-32" style={{ overscrollBehavior: 'contain' }}>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4" style={{ background: t.primaryBg, color: t.primary }}>Mashq</span>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: t.text }}>Bo'sh joyni to'ldiring</h2>
        <p className="text-sm mb-8" style={{ color: t.sub }}>Gapning ma'nosiga qarab mos so'zni tanlang.</p>
        <div className="p-8 rounded-2xl mb-8 text-center" style={{ background: t.surface }}>
          <p className="text-xl font-bold leading-relaxed" style={{ color: t.text }}>
            {fb.before}{' '}
            <span className="inline-block px-4 py-1 mx-1 rounded-xl font-bold" style={blankAnswered
              ? { background: isCorrect ? t.correctBg : t.wrongBg, color: isCorrect ? t.correct : t.wrong, borderBottom: `3px solid ${isCorrect ? t.correct : t.wrong}` }
              : { background: t.primaryBg, color: t.primary, borderBottom: `3px solid ${t.primary}` }
            }>{selectedWord || '___'}</span>
            {' '}{fb.after}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fb.options.map((word) => {
            let bg = t.card; let color = t.text; let border = 'transparent';
            if (blankAnswered) {
              if (word === fb.correctWord) { bg = t.correctBg; color = t.correct; border = t.correct; }
              else if (word === selectedWord) { bg = t.wrongBg; color = t.wrong; border = t.wrong; }
            } else if (word === selectedWord) { border = t.primary; }
            return (
              <motion.button key={word} whileTap={{ scale: 0.95 }} onClick={() => handleWordSelect(word)} className="p-5 rounded-2xl font-semibold text-center" style={{ background: bg, color, border: `2px solid ${border}`, boxShadow: t.cardShadow }}>
                {word}
              </motion.button>
            );
          })}
        </div>
        {fb.hint && !blankAnswered && (
          <div className="mt-6 p-4 rounded-2xl flex items-start gap-3" style={{ background: t.accentBg }}>
            <span className="text-lg">💡</span>
            <div>
              <p className="font-bold text-xs uppercase mb-1" style={{ color: t.accent }}>Maslahat</p>
              <p className="text-sm" style={{ color: t.sub }}>{fb.hint}</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  /* ───── Flashcard View ───── */
  const renderFlashcard = (fc: FlashcardStep) => (
    <motion.div key={`fc-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col items-center px-6 pt-6 pb-32 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-6 self-start" style={{ background: t.primaryBg, color: t.primary }}>Lug'at</span>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => { setFlipped(f => !f); if (!flipped) setCorrectCount(c => c + 1); }}
        className="w-full aspect-[4/5] max-w-sm rounded-3xl flex flex-col items-center justify-center cursor-pointer mb-6 relative overflow-hidden"
        style={{ background: flipped ? t.primary : t.card, boxShadow: `0 24px 48px ${theme === 'dark' ? 'rgba(195,255,46,0.08)' : 'rgba(79,70,229,0.12)'}` }}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.3 }} className="text-center p-8">
              <div className="flex items-center gap-2 mb-8 mx-auto px-3 py-1.5 rounded-full w-fit" style={{ background: t.surface }}>
                <Volume2 className="w-4 h-4" style={{ color: t.primary }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: t.primary }}>Pronunciation</span>
              </div>
              <h2 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: t.primary }}>{fc.word}</h2>
              <p className="text-xl" style={{ color: t.sub }}>{fc.pronunciation}</p>
              <p className="mt-10 text-xs flex items-center gap-2 justify-center" style={{ color: `${t.sub}80` }}>
                <RotateCcw className="w-4 h-4" /> Tarjimani ko'rish uchun bosing
              </p>
            </motion.div>
          ) : (
            <motion.div key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.3 }} className="text-center p-8">
              <h2 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: primaryTextOnGrad }}>{fc.translation}</h2>
              {fc.definition && <p className="text-lg" style={{ color: `${primaryTextOnGrad}cc` }}>{fc.definition}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  /* ───── Render current step ───── */
  const renderStep = () => {
    if (completed) return renderCompletion();
    if (!step) return renderCompletion();
    switch (step.type) {
      case 'quiz': return renderQuiz(step as QuizStep);
      case 'fill_blank': return renderFillBlank(step as FillBlankStep);
      case 'flashcard': return renderFlashcard(step as FlashcardStep);
    }
  };

  const canGoNext = answered || blankAnswered || flipped || completed;

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: t.bg, height: '100dvh' }}>
      {/* Header */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, flexShrink: 0, paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 16px))', backdropFilter: 'blur(12px)' }} className="px-4 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95" style={{ background: t.primaryBg }}>
              <ArrowLeft className="w-5 h-5" style={{ color: t.primary }} />
            </button>
            <h1 className="font-bold tracking-tight" style={{ color: t.text }}>{lessonTitle}</h1>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: t.accentBg }}>
            <Zap className="w-3.5 h-3.5" style={{ color: t.accent }} />
            <span className="font-bold text-sm" style={{ color: t.accent }}>+{xpReward} XP</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.progressTrack }}>
          <motion.div animate={{ width: `${completed ? 100 : progress}%` }} transition={{ duration: 0.4 }} className="h-full rounded-full" style={{ background: t.primaryGrad }} />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

      {/* Bottom Bar */}
      <div className="flex-shrink-0 px-6 py-4 pb-safe" style={{ background: t.headerBg, borderTop: `1px solid ${t.border}`, backdropFilter: 'blur(12px)' }}>
        {completed ? (
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-95" style={{ border: `2px solid ${t.border}`, color: t.primary, background: 'transparent' }}>
              <Home className="w-4 h-4" /> Ortga
            </button>
            <button onClick={onClose} className="flex-[2] py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-95" style={{ background: t.primaryGrad, color: primaryTextOnGrad }}>
              Keyingi darsga <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: t.accentBg }}>
              <span className="text-sm font-medium" style={{ color: t.accent }}>{currentStep + 1}/{steps.length}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              disabled={!canGoNext}
              className="px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2"
              style={{ background: canGoNext ? t.primaryGrad : t.progressTrack, color: canGoNext ? primaryTextOnGrad : t.sub, opacity: canGoNext ? 1 : 0.5 }}
            >
              Keyingisi <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
