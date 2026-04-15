import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getPalette } from '../../theme';
import ResultScreen from './components/ResultScreen';

export default function IELTSEngine({ type, onExit }: { type: string; onExit: () => void }) {
  const { theme } = useUser();
  const colors = getPalette(theme);
  
  const [testPhase, setTestPhase] = useState<'intro' | 'running' | 'result'>('intro');
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 mins default
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    let timer: any;
    if (testPhase === 'running' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && testPhase === 'running') {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [testPhase, timeLeft]);

  const finishTest = () => {
    // Math basic AI simulate logic
    const baseScore = Math.random() * 3 + 5.5; // 5.5 - 8.5
    const scoreVal = baseScore.toFixed(1);
    setScore({
      overall: scoreVal,
      breakdown: { reading: scoreVal, listening: scoreVal, writing: (baseScore - 0.5).toFixed(1), speaking: scoreVal },
      feedback: {
        strengths: ['Grammar control', 'Task achievement'],
        weaknesses: ['Vocabulary range', 'Lexical resource'],
        suggestions: ['Practice more academic words', 'Focus on writing task 2 structure']
      }
    });

    localStorage.setItem('fynex_last_ielts', scoreVal.toString());
    
    // Add xp and update streak
    window.dispatchEvent(new CustomEvent('fynex:test_completed', { detail: { score: scoreVal } }));
    setTestPhase('result');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#0e0e0e]" style={{ background: colors.background }}>
      <AnimatePresence mode="wait">
        {testPhase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center text-center">
            <h2 className="text-3xl font-black mb-2" style={{ color: colors.onSurface }}>IELTS {type.split('-')[1]?.toUpperCase() || 'TEST'}</h2>
            <p className="text-sm mb-12 opacity-70" style={{ color: colors.onSurfaceVariant }}>Real time simulation. Ensure you have a quiet environment.</p>
            
            <button
              onClick={() => setTestPhase('running')}
              className="rounded-full px-8 py-4 font-black uppercase tracking-widest transition-transform active:scale-95 shadow-xl shadow-current/20"
              style={{ background: colors.primary, color: colors.onPrimary }}
            >
              Start Exam
            </button>
            <button onClick={onExit} className="mt-6 text-sm font-bold opacity-60" style={{ color: colors.onSurface }}>Cancel</button>
          </motion.div>
        )}

        {testPhase === 'running' && (
          <motion.div key="running" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: `${colors.outlineVariant}44` }}>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                <span className="font-mono text-xl font-bold" style={{ color: colors.onSurface }}>{formatTime(timeLeft)}</span>
              </div>
              <button onClick={finishTest} className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: colors.surfaceContainerHighest, color: colors.onSurface }}>Submit</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-6 p-5 rounded-[20px] text-sm leading-relaxed" style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}>
                <b>Passage 1:</b> The history of the artificial intelligence dates back to antiquity, with myths, stories and rumors of artificial beings endowed with intelligence or consciousness by master craftsmen. The roots of modern AI can be traced to classical philosophers' attempts to describe the process of human thinking as the mechanical manipulation of symbols.
                <br/><br/>
                <i>Read the passage and select true or false.</i>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold mb-3" style={{ color: colors.onSurface }}>Question {currentQIndex + 1}</h3>
                <p className="text-sm mb-4" style={{ color: colors.onSurfaceVariant }}>Modern AI is heavily based on Greek mythology and symbols manipulation.</p>
                
                {['True', 'False', 'Not Given'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [currentQIndex]: opt })}
                    className="w-full text-left px-5 py-4 rounded-[16px] border transition-colors flex items-center justify-between"
                    style={{ 
                      background: answers[currentQIndex] === opt ? `${colors.primary}11` : 'transparent',
                      borderColor: answers[currentQIndex] === opt ? colors.primary : `${colors.outlineVariant}55`,
                      color: colors.onSurface
                    }}
                  >
                    <span className="font-semibold text-sm">{opt}</span>
                    {answers[currentQIndex] === opt && <CheckCircle2 className="h-5 w-5" style={{ color: colors.primary }} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 flex gap-4 border-t" style={{ borderColor: `${colors.outlineVariant}44` }}>
              <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} className="flex-1 py-3 rounded-full flex justify-center border" style={{ borderColor: `${colors.outlineVariant}44`, color: colors.onSurface }}>
                <ChevronLeft />
              </button>
              <button onClick={() => setCurrentQIndex(p => p + 1)} className="flex-[3] py-3 rounded-full flex justify-center font-bold items-center gap-2" style={{ background: colors.primary, color: colors.onPrimary }}>
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {testPhase === 'result' && score && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full">
            <ResultScreen score={score} onExit={onExit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
