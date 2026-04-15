import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getPalette } from '../../theme';

export default function DrillEngine({ drill, onExit }: { drill: any; onExit: () => void }) {
  const { theme } = useUser();
  const colors = getPalette(theme);

  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(drill.id === 'speed' ? 60 : 300); // Speed challenge timer
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // MOCK QUESTIONS
  const questions = [
    { q: "Identify the incorrectly spelled word:", options: ["Accommodation", "Reccomend", "Separate", "Questionnaire"], ans: "Reccomend" },
    { q: "What is an antonym for 'Obscure'?", options: ["Clear", "Hidden", "Vague", "Dark"], ans: "Clear" },
    { q: "Which sentence is grammatically correct?", options: ["He don't like it.", "She goes to school everyday.", "They are playing good.", "I has been waiting."], ans: "She goes to school everyday." },
    { q: "Choose the precise synonym for 'Abundant':", options: ["Scarce", "Plentiful", "Minimal", "Empty"], ans: "Plentiful" }
  ];

  useEffect(() => {
    let timer: any;
    if (!isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    let currentStreak = parseInt(localStorage.getItem('fynex_practice_streak') || '0', 10);
    localStorage.setItem('fynex_practice_streak', (currentStreak + 1).toString());
    window.dispatchEvent(new CustomEvent('fynex:drill_completed', { detail: { score } }));
  };

  const handleAnswer = (opt: string) => {
    if (opt === questions[step].ans) {
      setScore(s => s + 1);
      
      const nextBg = document.getElementById('drill-bg');
      if (nextBg) {
        nextBg.style.transition = 'background 0.2s';
        nextBg.style.background = '#4cd96433';
        setTimeout(() => nextBg.style.background = colors.background, 200);
      }
      
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        handleFinish();
      }
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div id="drill-bg" className="flex flex-col h-full w-full transition-colors" style={{ background: colors.background }}>
      <div className="flex items-center justify-between px-5 pb-4 border-b shadow-sm sticky top-0 z-50" style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)', borderColor: `${colors.outlineVariant}44`, background: colors.background }}>
        <button onClick={onExit} className="p-2 -ml-2 rounded-full active:bg-black/5 dark:active:bg-white/5"><X className="h-5 w-5" style={{ color: colors.onSurface }}/></button>
        <div className="font-bold font-mono" style={{ color: drill.color || colors.primary }}>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>
        <div className="text-sm font-bold opacity-50" style={{ color: colors.onSurface }}>
          {step + 1}/{questions.length}
        </div>
      </div>

      <div className="flex-1 p-5  flex flex-col">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: isWrong ? [-10, 10, -10, 10, 0] : 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: isWrong ? 0.4 : 0.2 }}
              className="flex-1 flex flex-col justify-center"
            >
              <h2 className="text-2xl font-black mb-8 leading-tight text-center" style={{ color: colors.onSurface }}>
                {questions[step].q}
              </h2>

              <div className="space-y-3">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left p-5 rounded-[24px] font-bold transition-transform active:scale-95 shadow-sm"
                    style={{ background: colors.surfaceContainerLow, color: colors.onSurface, border: `1px solid ${colors.outlineVariant}33` }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-2xl" style={{ background: colors.primary }}>
                <Check className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-2" style={{ color: colors.onSurface }}>Score: {score}/{questions.length}</h1>
              <p className="text-sm mb-10 opacity-70" style={{ color: colors.onSurfaceVariant }}>Daily drill completed! Streak updated.</p>
              <button
                onClick={onExit}
                className="w-full py-4 rounded-full font-black flex justify-center items-center gap-2 transition-transform active:scale-95 inset-x-0 bottom-5 fixed mx-5 shadow-lg shadow-current/10"
                style={{ background: colors.primary, color: colors.onPrimary, maxWidth: 'calc(100% - 40px)' }}
              >
                Back to Lab
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
