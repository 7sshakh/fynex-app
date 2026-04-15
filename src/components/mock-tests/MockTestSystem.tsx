import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, BookOpen, Headphones, PenTool, Mic, Target, Zap, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getPalette } from '../../theme';
import IELTSEngine from './IELTSEngine';

export default function MockTestSystem({ onClose }: { onClose: () => void }) {
  const { theme } = useUser();
  const colors = getPalette(theme);
  
  // Dashboard, selection, test, result
  const [phase, setPhase] = useState<'dashboard' | 'ielts-select' | 'sat-select' | 'test'>('dashboard');
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);

  // Stats
  const ieltsScore = localStorage.getItem('fynex_last_ielts') || '--';
  const satScore = localStorage.getItem('fynex_last_sat') || '--';

  const startTestMode = (type: string) => {
    setSelectedTestType(type);
    setPhase('test');
  };

  const UI_BG = theme === 'dark' ? '#070707' : '#ffffff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[99999] overflow-y-auto"
      style={{ background: UI_BG }}
    >
      <div className="flex h-16 items-center justify-between px-5 sticky top-0 z-50 backdrop-blur-md" style={{ background: `${UI_BG}e6` }}>
        <h2 className="text-xl font-black" style={{ color: colors.onSurface }}>Mock Tests</h2>
        <button onClick={onClose} className="rounded-full p-2 bg-white/5 active:scale-90 transition-transform">
          <X className="h-6 w-6" style={{ color: colors.onSurface }} />
        </button>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {phase === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="mb-6 mt-2 text-sm" style={{ color: colors.onSurfaceVariant }}>
                To'liq va qisqa imtihonlarni topshiring, o'z bahoingizni real vaqtda bilib oling.
              </p>
              
              <div
                className="mb-4 rounded-[28px] p-6 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDim})`, color: colors.onPrimary }}
              >
                <Target className="absolute -right-4 -top-4 h-32 w-32 opacity-20" />
                <h3 className="text-2xl font-black mb-1">IELTS</h3>
                <p className="text-sm font-semibold opacity-80 mb-6">Oxirgi natija: <span className="font-black text-xl">{ieltsScore}</span></p>
                
                <button
                  onClick={() => setPhase('ielts-select')}
                  className="flex bg-white items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-blue-900 transition-transform active:scale-95"
                >
                  <Play className="h-4 w-4" /> Boshlash
                </button>
              </div>

              <div
                className="rounded-[28px] p-6 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryDim})`, color: colors.onPrimary }}
              >
                <Zap className="absolute -right-4 -bottom-4 h-32 w-32 opacity-20" />
                <h3 className="text-2xl font-black mb-1">SAT</h3>
                <p className="text-sm font-semibold opacity-80 mb-6">Oxirgi natija: <span className="font-black text-xl">{satScore}</span></p>
                
                <button
                  onClick={() => { alert('SAT testlari ishlab chiqilmoqda'); }}
                  className="flex bg-white items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-blue-900 transition-transform active:scale-95 opacity-80"
                >
                  Tez Orada
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'ielts-select' && (
            <motion.div key="ielts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setPhase('dashboard')} className="p-2 rounded-full bg-white/5"><X className="h-5 w-5" style={{ color: colors.onSurface }}/></button>
                <h3 className="text-xl font-bold" style={{ color: colors.onSurface }}>IELTS Modullari</h3>
              </div>

              <div className="grid gap-3">
                {[
                  { id: 'full', title: "To'liq IELTS", icon: Target, time: '2h 45m' },
                  { id: 'reading', title: "Reading", icon: BookOpen, time: '60m' },
                  { id: 'listening', title: "Listening", icon: Headphones, time: '30m' },
                  { id: 'writing', title: "Writing", icon: PenTool, time: '60m' },
                  { id: 'speaking', title: "Speaking", icon: Mic, time: '15m' },
                ].map((test) => {
                  const Icon = test.icon;
                  return (
                    <div
                      key={test.id}
                      onClick={() => startTestMode(`ielts-${test.id}`)}
                      className="flex items-center gap-4 rounded-[20px] p-4 cursor-pointer transition-transform active:scale-95"
                      style={{ background: colors.surfaceContainerLow }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${colors.primary}22` }}>
                        <Icon className="h-6 w-6" style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold" style={{ color: colors.onSurface }}>{test.title}</h4>
                        <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: colors.onSurfaceVariant }}>
                          <Clock className="h-3 w-3" /> {test.time}
                        </div>
                      </div>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <Play className="h-3 w-3" style={{ color: colors.onSurface }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100000]" style={{ background: colors.background }}>
              <IELTSEngine type={selectedTestType!} onExit={() => setPhase('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
