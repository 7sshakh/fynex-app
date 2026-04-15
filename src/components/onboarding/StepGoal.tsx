import { motion } from 'framer-motion';
import { GraduationCap, Languages, Code2, TrendingUp } from 'lucide-react';
import type { OnboardingData } from './OnboardingContainer';

interface Props {
  data: OnboardingData;
  onSelect: (goal: OnboardingData['goal']) => void;
}

const goals: { id: NonNullable<OnboardingData['goal']>; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { id: 'university', label: 'Imtihonlardan o\'tish', icon: GraduationCap, desc: 'Universitetga kirish' },
  { id: 'english', label: 'Ingliz tilini o\'rganish', icon: Languages, desc: 'IELTS / General English' },
  { id: 'programming', label: 'Dasturlashni o\'rganish', icon: Code2, desc: 'IT sohasida ishlash' },
  { id: 'school', label: 'Maktab natijalarini yaxshilash', icon: TrendingUp, desc: 'Baholarni oshirish' },
];

export default function StepGoal({ data, onSelect }: Props) {
  return (
    <motion.div
      key="step-goal"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">Asosiy maqsadingiz?</h2>
      <p className="mb-8 text-sm text-white/60">Bitta maqsadni tanlang — biz sizga yo'l tuzamiz</p>

      <div className="flex flex-col gap-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = data.goal === goal.id;

          return (
            <motion.button
              key={goal.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(goal.id)}
              className="flex items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-all"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(195,255,46,0.14), rgba(195,255,46,0.04))'
                  : 'rgba(255,255,255,0.04)',
                borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 20px rgba(195,255,46,0.1)' : 'none',
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(195,255,46,0.3), rgba(195,255,46,0.1))'
                    : 'rgba(255,255,255,0.06)',
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.45)' }}
                />
              </div>
              <div>
                <div
                  className="text-[15px] font-bold"
                  style={{ color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}
                >
                  {goal.label}
                </div>
                <div className="mt-0.5 text-[12px] text-white/40">{goal.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
