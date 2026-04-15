import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import StepUserType from './StepUserType';
import StepGrade from './StepGrade';
import StepGoal from './StepGoal';
import StepTarget from './StepTarget';
import StepSummary from './StepSummary';

// ── Data types (future-ready for AI personalization) ──
export interface OnboardingData {
  userType: 'school' | 'university' | 'applicant' | 'other';
  grade: '1-4' | '5-8' | '9' | '10' | '11' | '';
  goal: 'university' | 'english' | 'programming' | 'school' | '';
  target: {
    type: 'local' | 'abroad' | '';
    university: string;
  };
}

const INITIAL_DATA: OnboardingData = {
  userType: '' as OnboardingData['userType'],
  grade: '',
  goal: '',
  target: { type: '', university: '' },
};

type StepId = 'userType' | 'grade' | 'goal' | 'target' | 'summary';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingContainer({ onComplete }: Props) {
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState<StepId>('userType');

  // Build dynamic step list based on selections
  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ['userType'];
    if (data.userType === 'school') s.push('grade');
    s.push('goal');
    if (data.goal === 'university') s.push('target');
    s.push('summary');
    return s;
  }, [data.userType, data.goal]);

  const stepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;
  const isLast = stepIndex === totalSteps - 1;
  const isFirst = stepIndex === 0;

  // Determine if Next should be enabled
  const canNext = useMemo(() => {
    switch (currentStep) {
      case 'userType':
        return !!data.userType;
      case 'grade':
        return !!data.grade;
      case 'goal':
        return !!data.goal;
      case 'target':
        return !!data.target.type && !!data.target.university;
      case 'summary':
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  const goNext = () => {
    if (!canNext) return;
    if (isLast) {
      // Save and finish
      localStorage.setItem('fynex_onboarding', JSON.stringify(data));
      localStorage.setItem('fynex_onboarding_completed', 'true');
      onComplete(data);
      return;
    }
    setCurrentStep(steps[stepIndex + 1]);
  };

  const goBack = () => {
    if (isFirst) return;
    setCurrentStep(steps[stepIndex - 1]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white">
      {/* Background effects — same as LoginPage */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ opacity: [0.26, 0.42, 0.26], scale: [0.96, 1.04, 0.96] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-lime-300/20 blur-[110px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.22, 0.1], x: [-12, 16, -12] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-orange-500/12 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.82)_74%,#000_100%)]" />
      </div>

      <main className="relative z-10 flex min-h-full flex-col px-6 pb-8 pt-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between pt-4"
        >
          {!isFirst ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm font-bold text-white/60 transition-colors hover:text-lime-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </motion.button>
          ) : (
            <div />
          )}

          {/* Step counter */}
          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-bold text-white/50 backdrop-blur-xl">
            {stepIndex + 1} / {totalSteps}
          </div>
        </motion.header>

        {/* Progress bar */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #c3ff2e, #b2ed12)' }}
            initial={false}
            animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step content */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <AnimatePresence mode="wait">
            {currentStep === 'userType' && (
              <StepUserType
                data={data}
                onSelect={(v) => {
                  setData((d) => ({
                    ...d,
                    userType: v,
                    grade: v !== 'school' ? '' : d.grade,
                  }));
                }}
              />
            )}
            {currentStep === 'grade' && (
              <StepGrade
                data={data}
                onSelect={(v) => setData((d) => ({ ...d, grade: v }))}
              />
            )}
            {currentStep === 'goal' && (
              <StepGoal
                data={data}
                onSelect={(v) => {
                  setData((d) => ({
                    ...d,
                    goal: v,
                    target: v !== 'university' ? { type: '', university: '' } : d.target,
                  }));
                }}
              />
            )}
            {currentStep === 'target' && (
              <StepTarget
                data={data}
                onUpdate={(t) => setData((d) => ({ ...d, target: t }))}
              />
            )}
            {currentStep === 'summary' && <StepSummary data={data} />}
          </AnimatePresence>
        </div>

        {/* Bottom button */}
        <div className="mx-auto mt-auto w-full max-w-md pt-6">
          <motion.button
            whileTap={{ scale: 0.985 }}
            onClick={goNext}
            disabled={!canNext}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-full text-lg font-black transition-all disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 55%, #b1ef1a 100%)',
              color: '#0a0d09',
              boxShadow: '0 12px 40px rgba(195,255,46,0.18)',
            }}
          >
            {isLast ? (
              <>
                O'qishni boshlash
                <Rocket className="h-5 w-5" />
              </>
            ) : (
              <>
                Davom etish
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Step indicator dots */}
        <footer className="mt-5 flex justify-center gap-2">
          {steps.map((_, i) => {
            const active = i === stepIndex;
            return (
              <motion.div
                key={i}
                animate={{ width: active ? 28 : 8, opacity: active ? 1 : 0.35 }}
                className="h-1.5 rounded-full"
                style={{ background: active ? '#c3ff2e' : 'rgba(255,255,255,0.18)' }}
              />
            );
          })}
        </footer>
      </main>
    </div>
  );
}
