import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, BarChart } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { getPalette } from '../../../theme';

export default function ResultScreen({ score, onExit }: { score: any; onExit: () => void }) {
  const { theme } = useUser();
  const colors = getPalette(theme);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 items-center w-full relative" style={{ background: colors.background }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-32 h-32 rounded-full mt-10 mb-6 flex items-center justify-center border-[8px]"
        style={{ borderColor: colors.primaryContainer, background: colors.primary }}
      >
        <span className="text-4xl font-black text-white">{score.overall}</span>
      </motion.div>

      <h2 className="text-3xl font-black mb-1" style={{ color: colors.onSurface }}>Great Job!</h2>
      <p className="text-sm font-semibold mb-8 opacity-70" style={{ color: colors.onSurfaceVariant }}>Your evaluated mock band score.</p>

      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        {[
          { label: 'Reading', val: score.breakdown.reading },
          { label: 'Listening', val: score.breakdown.listening },
          { label: 'Writing', val: score.breakdown.writing },
          { label: 'Speaking', val: score.breakdown.speaking },
        ].map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-[20px] p-4 flex flex-col"
            style={{ background: colors.surfaceContainerLow }}
          >
            <span className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: colors.onSurfaceVariant }}>{s.label}</span>
            <span className="text-2xl font-black" style={{ color: colors.onSurface }}>{s.val}</span>
          </motion.div>
        ))}
      </div>

      <div className="w-full rounded-[24px] p-5 mb-10" style={{ background: colors.surfaceContainerHighest }}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart className="h-4 w-4" style={{ color: colors.onSurfaceVariant }} />
          <h3 className="font-bold text-sm" style={{ color: colors.onSurface }}>AI Feedback</h3>
        </div>
        <div className="space-y-4 text-sm mt-3">
          <div>
            <h4 className="font-bold text-green-500 mb-1">Strengths</h4>
            <ul className="list-disc pl-4 opacity-80" style={{ color: colors.onSurface }}>
              {score.feedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-red-400 mb-1">Needs Improvement</h4>
            <ul className="list-disc pl-4 opacity-80" style={{ color: colors.onSurface }}>
              {score.feedback.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3 mt-auto">
        <button
          onClick={onExit}
          className="w-full py-4 rounded-full font-black flex justify-center items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-current/10"
          style={{ background: colors.primary, color: colors.onPrimary }}
        >
          Continue Learning <ArrowRight className="h-5 w-5" />
        </button>
        <button
          onClick={onExit}
          className="w-full py-4 rounded-full font-bold flex justify-center items-center gap-2"
          style={{ background: 'transparent', color: colors.onSurfaceVariant }}
        >
          <RefreshCw className="h-4 w-4" /> Review Answers
        </button>
      </div>
    </div>
  );
}
