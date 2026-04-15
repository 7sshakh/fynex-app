import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getPalette } from '../../theme';
import DrillEngine from './DrillEngine';

export default function PracticeSystem({ onClose }: { onClose: () => void }) {
  const { theme, user } = useUser();
  const colors = getPalette(theme);
  const UI_BG = theme === 'dark' ? '#070707' : '#ffffff';

  const [phase, setPhase] = useState<'dash' | 'drill'>('dash');
  const [selectedDrill, setSelectedDrill] = useState<any>(null);

  const streak = localStorage.getItem('fynex_practice_streak') || '0';

  const drills = [
    { id: 'speed', title: '60s Speed Challenge', desc: 'As much reading comprehension as you can solve in 60s.', time: '1 min', tag: 'Reading', color: '#ff3b30', icon: Clock },
    { id: 'quiz', title: 'Daily Quick Quiz', desc: '5 questions exactly tailored for your target score.', time: '3 min', tag: 'Mixed', color: colors.primary, icon: Play },
    { id: 'weakness', title: 'Mistake Fixer', desc: 'Remedial drill based on what you got wrong yesterday.', time: '5 min', tag: 'Grammar', color: '#ff9500', icon: ShieldAlert },
  ];

  const handleStart = (d: any) => {
    setSelectedDrill(d);
    setPhase('drill');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[99999] overflow-y-auto"
      style={{ background: UI_BG }}
    >
      <div className="flex items-center justify-between px-5 pb-4 sticky top-0 z-50 backdrop-blur-md" style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)', background: `${UI_BG}e6` }}>
        <h2 className="text-xl font-black flex items-center gap-2" style={{ color: colors.onSurface }}>
          Practice Lab
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-red-500/15 px-3 py-1.5 rounded-full text-red-500 font-black text-sm shadow-sm">
            <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Flame className="h-4 w-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </motion.div>
            {streak}
          </div>
          <button onClick={onClose} className="rounded-full p-2 bg-white/5 active:scale-90 transition-transform">
            <X className="h-6 w-6" style={{ color: colors.onSurface }} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {phase === 'dash' && (
            <motion.div key="dash" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-6 p-5 rounded-[24px] flex items-center justify-between" style={{ background: colors.surfaceContainerLow }}>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.onSurface }}>Keep it up!</h3>
                  <p className="text-xs opacity-70 mt-1" style={{ color: colors.onSurfaceVariant }}>Daily practice limits learning drop-off.</p>
                </div>
                <Cpu className="h-10 w-10 opacity-30" style={{ color: colors.primary }} />
              </div>

              <h3 className="text-sm font-black uppercase tracking-wider mb-3 ml-2" style={{ color: colors.onSurfaceVariant }}>Recommended for {user?.name || "You"}</h3>

              <div className="grid gap-4">
                {drills.map((drill) => {
                  const Icon = drill.icon;
                  return (
                    <motion.div
                      key={drill.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStart(drill)}
                      className="rounded-[24px] p-5 cursor-pointer relative overflow-hidden shadow-sm"
                      style={{ background: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}33` }}
                    >
                      <motion.div 
                        className="absolute right-[-20%] top-[-20%] p-3 opacity-20"
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      >
                        <Icon className="h-32 w-32 drop-shadow-2xl" style={{ color: drill.color }} />
                      </motion.div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: drill.color }}>
                          <span>{drill.tag}</span> • <span>{drill.time}</span>
                        </div>
                        <h4 className="text-lg font-black mb-1 leading-tight" style={{ color: colors.onSurface }}>{drill.title}</h4>
                        <p className="text-xs mb-4 max-w-[80%]" style={{ color: colors.onSurfaceVariant }}>{drill.desc}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: drill.color }}>
                          <Play className="h-3 w-3" /> Start Drill
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {phase === 'drill' && (
            <motion.div key="drill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100000]" style={{ background: colors.background }}>
              <DrillEngine drill={selectedDrill} onExit={() => setPhase('dash')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
