import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Target, Users } from 'lucide-react';
import type { OnboardingData } from './OnboardingContainer';

interface Props {
  data: OnboardingData;
  onSelect: (userType: OnboardingData['userType']) => void;
}

const userTypes: { id: OnboardingData['userType']; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { id: 'school', label: 'Maktab o\'quvchisi', icon: BookOpen, desc: 'Maktabda o\'qiyapman' },
  { id: 'university', label: 'Talaba', icon: GraduationCap, desc: 'Universitetda o\'qiyapman' },
  { id: 'applicant', label: 'Abituriyent', icon: Target, desc: 'Universitetga tayyorlanmoqdaman' },
  { id: 'other', label: 'Boshqa', icon: Users, desc: 'Mustaqil o\'rganmoqdaman' },
];

export default function StepUserType({ data, onSelect }: Props) {
  return (
    <motion.div
      key="step-user-type"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">Siz kimsiz?</h2>
      <p className="mb-8 text-sm text-white/60">O'zingizni tanlang, biz sizga mos yo'l tuzamiz</p>

      <div className="grid grid-cols-2 gap-3">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.userType === type.id;

          return (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type.id)}
              className="flex flex-col items-center gap-3 rounded-[22px] border p-5 text-center transition-all"
              style={{
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(195,255,46,0.16), rgba(195,255,46,0.04))'
                  : 'rgba(255,255,255,0.04)',
                borderColor: isSelected ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 24px rgba(195,255,46,0.12)' : 'none',
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(195,255,46,0.3), rgba(195,255,46,0.1))'
                    : 'rgba(255,255,255,0.06)',
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.5)' }}
                />
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ color: isSelected ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}
                >
                  {type.label}
                </div>
                <div className="mt-1 text-[11px] text-white/40">{type.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
