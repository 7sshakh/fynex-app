import { motion } from 'framer-motion';
import type { OnboardingData } from './OnboardingContainer';

interface Props {
  data: OnboardingData;
  onSelect: (grade: OnboardingData['grade']) => void;
}

const grades: { id: NonNullable<OnboardingData['grade']>; label: string }[] = [
  { id: '1-4', label: '1–4 sinf' },
  { id: '5-8', label: '5–8 sinf' },
  { id: '9', label: '9-sinf' },
  { id: '10', label: '10-sinf' },
  { id: '11', label: '11-sinf' },
];

export default function StepGrade({ data, onSelect }: Props) {
  return (
    <motion.div
      key="step-grade"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">Nechanchi sinfda?</h2>
      <p className="mb-8 text-sm text-white/60">Sizning sinf darajangizni tanlang</p>

      <div className="flex flex-col gap-3">
        {grades.map((grade) => {
          const isSelected = data.grade === grade.id;

          return (
            <motion.button
              key={grade.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(grade.id)}
              className="flex items-center gap-4 rounded-[20px] border px-6 py-4 text-left transition-all"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(195,255,46,0.14), rgba(195,255,46,0.04))'
                  : 'rgba(255,255,255,0.04)',
                borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 20px rgba(195,255,46,0.1)' : 'none',
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #c3ff2e, #b2ed12)'
                    : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#0a0d09' : 'rgba(255,255,255,0.5)',
                }}
              >
                {grade.id}
              </div>
              <span
                className="text-base font-bold"
                style={{ color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.85)' }}
              >
                {grade.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
