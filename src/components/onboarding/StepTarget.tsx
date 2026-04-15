import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';
import type { OnboardingData } from './OnboardingContainer';

interface Props {
  data: OnboardingData;
  onUpdate: (target: OnboardingData['target']) => void;
}

const abroadUnis = ['Harvard', 'MIT', 'Stanford', 'Oxford', 'Cambridge'];

const localUnis = [
  'Toshkent Davlat Universiteti',
  'INHA University Tashkent',
  'Webster University',
  'Turin Politexnika Universiteti',
  'Toshkent Tibbiyot Akademiyasi',
  'Toshkent Moliya Instituti',
];

export default function StepTarget({ data, onUpdate }: Props) {
  const [customUni, setCustomUni] = useState('');
  const targetType = data.target.type;
  const selectedUni = data.target.university;

  const selectType = (type: 'local' | 'abroad') => {
    onUpdate({ type, university: '' });
    setCustomUni('');
  };

  const selectUni = (uni: string) => {
    onUpdate({ type: targetType, university: uni });
  };

  const applyCustom = () => {
    if (customUni.trim()) {
      onUpdate({ type: targetType, university: customUni.trim() });
    }
  };

  return (
    <motion.div
      key="step-target"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">Qayerda o'qimoqchisiz?</h2>
      <p className="mb-6 text-sm text-white/60">Universitetingizni tanlang</p>

      {/* Local vs Abroad toggle */}
      <div className="mb-6 flex gap-3">
        {[
          { id: 'local' as const, label: 'O\'zbekiston', icon: MapPin },
          { id: 'abroad' as const, label: 'Xorijda', icon: Globe },
        ].map((opt) => {
          const Icon = opt.icon;
          const isSelected = targetType === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectType(opt.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border py-4 font-bold transition-all"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(195,255,46,0.16), rgba(195,255,46,0.04))'
                  : 'rgba(255,255,255,0.04)',
                borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
                color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.7)',
              }}
            >
              <Icon className="h-5 w-5" />
              {opt.label}
            </motion.button>
          );
        })}
      </div>

      {/* University list */}
      {targetType && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="flex flex-col gap-2"
        >
          {targetType === 'abroad' && (
            <>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Mashhur universitetlar
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {abroadUnis.map((uni) => {
                  const isSelected = selectedUni === uni;
                  return (
                    <motion.button
                      key={uni}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectUni(uni)}
                      className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #c3ff2e, #b2ed12)'
                          : 'rgba(255,255,255,0.04)',
                        borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.1)',
                        color: isSelected ? '#0a0d09' : 'rgba(255,255,255,0.75)',
                      }}
                    >
                      {uni}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Yoki boshqa universitetni kiriting
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUni}
                  onChange={(e) => setCustomUni(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyCustom();
                    }
                  }}
                  placeholder="Universitet nomi..."
                  className="flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 focus:border-lime-300/35 focus:outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={applyCustom}
                  disabled={!customUni.trim()}
                  className="rounded-2xl px-4 py-3 text-sm font-bold transition-all disabled:opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(195,255,46,0.2), rgba(195,255,46,0.08))',
                    color: '#c3ff2e',
                    border: '1px solid rgba(195,255,46,0.2)',
                  }}
                >
                  OK
                </motion.button>
              </div>
            </>
          )}

          {targetType === 'local' && (
            <>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Universitetni tanlang
              </div>
              {localUnis.map((uni) => {
                const isSelected = selectedUni === uni;
                return (
                  <motion.button
                    key={uni}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectUni(uni)}
                    className="rounded-[18px] border px-5 py-3.5 text-left text-sm font-semibold transition-all"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(195,255,46,0.14), rgba(195,255,46,0.04))'
                        : 'rgba(255,255,255,0.04)',
                      borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {uni}
                  </motion.button>
                );
              })}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
