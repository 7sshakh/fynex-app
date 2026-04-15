import { motion } from 'framer-motion';
import { User, BookOpen, Target, MapPin, CheckCircle2 } from 'lucide-react';
import type { OnboardingData } from './OnboardingContainer';

interface Props {
  data: OnboardingData;
}

const userTypeLabels: Record<string, string> = {
  school: 'Maktab o\'quvchisi',
  university: 'Talaba',
  applicant: 'Abituriyent',
  other: 'Boshqa',
};

const goalLabels: Record<string, string> = {
  university: 'Imtihonlardan o\'tish / Universitetga kirish',
  english: 'Ingliz tilini o\'rganish (IELTS)',
  programming: 'Dasturlashni o\'rganish',
  school: 'Maktab natijalarini yaxshilash',
};

const gradeLabels: Record<string, string> = {
  '1-4': '1–4 sinf',
  '5-8': '5–8 sinf',
  '9': '9-sinf',
  '10': '10-sinf',
  '11': '11-sinf',
};

export default function StepSummary({ data }: Props) {
  const items = [
    {
      icon: User,
      label: 'Foydalanuvchi turi',
      value: userTypeLabels[data.userType] || '—',
    },
    ...(data.grade
      ? [{
          icon: BookOpen,
          label: 'Sinf darajasi',
          value: gradeLabels[data.grade] || '—',
        }]
      : []),
    {
      icon: Target,
      label: 'Asosiy maqsad',
      value: goalLabels[data.goal] || '—',
    },
    ...(data.target.university
      ? [{
          icon: MapPin,
          label: 'Maqsad universitet',
          value: `${data.target.university} (${data.target.type === 'abroad' ? 'Xorij' : 'O\'zbekiston'})`,
        }]
      : []),
  ];

  return (
    <motion.div
      key="step-summary"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <CheckCircle2 className="h-8 w-8 text-lime-300" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black tracking-[-0.04em]">Hammasi tayyor!</h2>
          <p className="text-sm text-white/60">Sizning ma'lumotlaringiz</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-4 py-4"
              style={{
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Icon className="h-5 w-5 text-lime-300/70" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {item.label}
                </div>
                <div className="mt-0.5 text-[15px] font-bold text-white/90">{item.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5 text-center text-xs text-white/35"
      >
        Keyin bu ma'lumotlar asosida shaxsiy o'quv rejangiz tuziladi
      </motion.p>
    </motion.div>
  );
}
