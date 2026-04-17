import { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Rocket,
  GraduationCap, BookOpen, Target, Users,
  Languages, Code2, TrendingUp,
  MapPin, User, CheckCircle2, Building2
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { type Lang, type Translations } from '../lib/i18n';

type Step = 'intro' | 'phone' | 'otp' | 'name' | 'userType' | 'grade' | 'subject' | 'offlineCourse' | 'centerPicker' | 'centerDuration' | 'level' | 'advice' | 'summary' | 'loading';

interface OnboardingData {
  userType: 'school' | 'university' | 'applicant' | 'other' | '';
  grade: '1-4' | '5-8' | '9' | '10' | '11' | '';
  subject: string;
  offlineCourse: 'no_fynex' | 'plan_to_go' | 'currently_going' | '';
  centerName: string;
  centerDuration: string;
  currentLevel: string;
}

const CENTERS = [
  { id: 'Inter Nation', name: 'Inter Nation', colors: ['#D60000', '#FF3B30'] },
  { id: 'Cambridge', name: 'Cambridge LC', colors: ['#002B5E', '#0055A4'] },
  { id: 'Master IELTS', name: 'Master IELTS', colors: ['#FACC15', '#CA8A04'] },
  { id: 'Everest School', name: 'Everest School', colors: ['#10B981', '#059669'] },
  { id: 'Registan', name: 'Registan LC', colors: ['#EF4444', '#DC2626'] },
  { id: 'ELC', name: 'ELC (English Learning)', colors: ['#6366F1', '#4F46E5'] },
  { id: 'Najot Talim', name: "Najot Ta'lim", colors: ['#14B8A6', '#0D9488'] },
  { id: 'PDP Academy', name: 'PDP Academy', colors: ['#F97316', '#EA580C'] },
  { id: 'Mohirdev', name: 'Mohirdev', colors: ['#8B5CF6', '#7C3AED'] },
  { id: 'Westminster', name: 'Westminster IU', colors: ['#0EA5E9', '#0284C7'] },
  { id: 'Berlitz', name: 'Berlitz', colors: ['#EC4899', '#DB2777'] },
  { id: 'British Council', name: 'British Council', colors: ['#1E3A8A', '#1E40AF'] },
];

export default function LoginPage() {
  const { login, t, lang } = useUser();

  const USER_TYPES = useMemo(() => [
    { id: 'school' as const, label: t.login_school, icon: BookOpen, desc: t.login_school_desc },
    { id: 'university' as const, label: t.login_student, icon: GraduationCap, desc: t.login_student_desc },
    { id: 'applicant' as const, label: t.login_applicant, icon: Target, desc: t.login_applicant_desc },
    { id: 'other' as const, label: t.login_other, icon: Users, desc: t.login_other_desc },
  ], [t]);

  const GRADES = useMemo(() => [
    { id: '1-4' as const, label: `1–4 ${t.login_class}` },
    { id: '5-8' as const, label: `5–8 ${t.login_class}` },
    { id: '9' as const, label: `9-${t.login_class}` },
    { id: '10' as const, label: `10-${t.login_class}` },
    { id: '11' as const, label: `11-${t.login_class}` },
  ], [t]);

  const SUBJECTS = useMemo(() => [
    { id: 'english', label: t.login_subject_en, icon: Languages, desc: t.login_subject_en_desc },
    { id: 'russian', label: t.login_subject_ru, icon: Languages, desc: t.login_subject_ru_desc },
    { id: 'programming', label: t.login_subject_it, icon: Code2, desc: t.login_subject_it_desc },
    { id: 'math', label: t.login_subject_math, icon: TrendingUp, desc: t.login_subject_math_desc },
  ], [t]);

  const OFFLINE_CHOICES = useMemo(() => [
    { id: 'no_fynex' as const, label: t.login_no_fynex, icon: Rocket, desc: t.login_no_fynex_desc },
    { id: 'plan_to_go' as const, label: t.login_plan_to_go, icon: MapPin, desc: t.login_plan_to_go_desc },
    { id: 'currently_going' as const, label: t.login_currently_going, icon: Building2, desc: t.login_currently_going_desc },
  ], [t]);

  const DURATIONS = useMemo(() => [
    { id: '<1', label: t.dur_less_1 },
    { id: '1-3', label: t.dur_1_3 },
    { id: '3-6', label: t.dur_3_6 },
    { id: '6+', label: t.dur_6_plus },
  ], [t]);

  const LEVELS = useMemo(() => [
    { id: 'Beginner', label: lang === 'ru' ? 'Beginner (с нуля)' : lang === 'en' ? 'Beginner (from zero)' : 'Beginner (noldan)' },
    { id: 'Elementary', label: 'Elementary (A1-A2)' },
    { id: 'Pre-Intermediate', label: 'Pre-Intermediate (B1)' },
    { id: 'Intermediate', label: 'Intermediate (B1+)' },
    { id: 'Upper-Intermediate', label: lang === 'ru' ? 'Upper-Intermediate (B2)' : 'Upper-Intermediate (B2)' },
    { id: 'Advanced', label: 'Advanced / IELTS (C1+)' },
  ], [lang]);

  const copy = useMemo(() => ({
    phoneTitle: t.login_welcome,
    phoneDesc: t.login_enter_phone,
    phoneLabel: t.login_phone,
    introTitle: lang === 'ru' ? 'Kodni Telegram bot orqali oling' : lang === 'en' ? 'Get your code from the Telegram bot' : 'Kodni Telegram bot orqali oling',
    introDesc: lang === 'ru'
      ? '@FynexEduBot ichiga kiring, telefon raqamingizni share contact orqali yuboring va 6 xonali kodni oling. Keyin shu yerga qaytib davom eting.'
      : lang === 'en'
        ? 'Open @FynexEduBot, send your phone number with share contact, get the 6-digit code, then return here and continue.'
        : "@FynexEduBot ichiga kiring, telefon raqamingizni share contact orqali yuboring va 6 xonali kodni oling. Keyin shu yerga qaytib davom eting.",
    introButton: lang === 'ru' ? 'Davom etish' : lang === 'en' ? 'Continue' : 'Davom etish',
    otpAttempts: lang === 'ru' ? 'Попытка' : lang === 'en' ? 'Attempt' : 'Urinish',
    otpViaTelegram: lang === 'ru' ? 'Получить код в Telegram' : lang === 'en' ? 'Get code from Telegram' : 'Kodni Telegramdan oling',
    phoneCheckError: lang === 'ru'
      ? 'Avval @FynexEduBot orqali shu raqam uchun kod oling.'
      : lang === 'en'
        ? 'First get a code for this number from @FynexEduBot.'
        : "Avval @FynexEduBot orqali shu raqam uchun kod oling.",
    addCenter: lang === 'ru' ? 'добавить' : lang === 'en' ? 'add' : "qo'shish",
    adviceNoFynex: lang === 'ru'
      ? 'Для вас это хороший старт. Можно спокойно начать с уровня Beginner и бесплатно пройти базу внутри Fynex.'
      : lang === 'en'
        ? 'This is a good start for you. You can begin from Beginner and build your foundation inside Fynex for free.'
        : "Siz uchun bu yaxshi start. Beginner darajasidan boshlab, Fynex ichida asoslarni bepul mustahkamlashingiz mumkin.",
    advicePlan: lang === 'ru'
      ? 'Если вы еще выбираете учебный центр, Fynex поможет не терять темп. Пока выбираете, закрепляйте темы через Practice Lab и короткие уроки.'
      : lang === 'en'
        ? 'If you are still choosing a learning center, Fynex can keep your pace moving. While deciding, strengthen topics through Practice Lab and short lessons.'
        : "Agar hali markaz tanlayotgan bo'lsangiz, Fynex sizga tempni yo'qotmaslikka yordam beradi. Tanlov paytida Practice Lab va qisqa darslar bilan mavzularni mustahkamlang.",
    advicePlanLead: lang === 'ru'
      ? 'Хороший офлайн-центр вместе с приложением обычно дает результат быстрее.'
      : lang === 'en'
        ? 'A strong offline learning center together with the app usually gives faster results.'
        : "Sifatli oflayn markaz va ilova birga bo'lsa, natija odatda tezroq bo'ladi.",
    adviceCurrentPrefix: lang === 'ru'
      ? 'Сейчас вы учитесь в'
      : lang === 'en'
        ? 'You are currently studying at'
        : "Hozir siz",
    adviceCurrentSuffix: lang === 'ru'
      ? 'Fynex будет полезен для qo‘shimcha practice va muntazam mustahkamlash.'
      : lang === 'en'
        ? 'Fynex will help with extra practice and steady reinforcement.'
        : "Fynex sizga qo'shimcha practice va muntazam mustahkamlashda yordam beradi.",
    summaryUserType: t.login_user_type,
    summaryClass: t.login_class,
    summarySubject: t.login_subject_label,
    summaryCenter: t.login_center_label,
    summaryPlan: t.login_plan_note,
  }), [lang, t]);

  const LOADING_STEPS = useMemo(() => [
    t.login_loading_1,
    t.login_loading_2,
    t.login_loading_3,
    t.login_loading_4,
  ], [t]);

  const LABELS: Record<string, Record<string, string>> = useMemo(() => ({
    userType: { school: t.login_school, university: t.login_student, applicant: t.login_applicant, other: t.login_other },
    grade: { '1-4': `1–4 ${t.login_class}`, '5-8': `5–8 ${t.login_class}`, '9': `9-${t.login_class}`, '10': `10-${t.login_class}`, '11': `11-${t.login_class}` },
    subject: { english: t.login_subject_en, programming: t.login_subject_it, russian: t.login_subject_ru, math: t.login_subject_math },
  }), [t]);
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [otpAttempt, setOtpAttempt] = useState(0);
  const [resendSec, setResendSec] = useState(45);
  const [searchCenter, setSearchCenter] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [ob, setOb] = useState<OnboardingData>({ userType: '', grade: '', subject: '', offlineCourse: '', centerName: '', centerDuration: '', currentLevel: '' });
  const [selectedCountry, setSelectedCountry] = useState<{code: string, name: string, flag: string, digitCount: number}>({ code: '+998', name: "O'zbekiston", flag: '🇺🇿', digitCount: 9 });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const COUNTRIES = [
    { code: '+998', name: "O'zbekiston", flag: '🇺🇿', digitCount: 9 },
    { code: '+7', name: 'Rossiya', flag: '🇷🇺', digitCount: 10 },
    { code: '+996', name: "Qirg'iziston", flag: '🇰🇬', digitCount: 9 },
    { code: '+7', name: "Qozog'iston", flag: '🇰🇿', digitCount: 10 },
  ];

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const otpRef = useRef<HTMLInputElement | null>(null);
  const fullPhone = `${selectedCountry.code}${phone}`;

  /* ── dynamic step list ── */
  const allSteps = useMemo<Step[]>(() => {
    const s: Step[] = ['intro', 'phone', 'otp', 'name', 'userType'];
    if (ob.userType === 'school') s.push('grade');
    s.push('subject');
    
    if (ob.subject === 'english') {
      s.push('offlineCourse');
      if (ob.offlineCourse === 'currently_going') {
        s.push('centerPicker', 'centerDuration', 'level');
      } else if (ob.offlineCourse === 'plan_to_go') {
        s.push('level');
      }
      s.push('advice');
    }
    
    s.push('summary');
    return s;
  }, [ob]);

  const idx = allSteps.indexOf(step);
  const isOnboarding = idx >= 4;
  const obIdx = idx - 4; // 0-based onboarding step
  const obTotal = allSteps.length - 4;
  const loginIdx = Math.min(idx, 3);

  /* ── auto-focus ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 'phone') phoneRef.current?.focus();
      if (step === 'otp') otpRef.current?.focus();
      if (step === 'name') nameRef.current?.focus();
    }, 280);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'otp') return;
    if (resendSec <= 0) return;
    const timer = window.setInterval(() => {
      setResendSec((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, resendSec]);

  useEffect(() => {
    if (step !== 'otp') return;
    if (otpStatus !== 'idle') return;
    if (otpCode.length === 6) {
      void goOtp();
    }
  }, [otpCode, otpStatus, step]);

  /* ── can proceed? ── */
  const canNext = useMemo(() => {
    switch (step) {
      case 'phone': return phone.length === selectedCountry.digitCount;
      case 'intro': return true;
      case 'otp': return false;
      case 'name': return name.trim().length >= 2;
      case 'userType': return !!ob.userType;
      case 'grade': return !!ob.grade;
      case 'subject': return !!ob.subject;
      case 'offlineCourse': return !!ob.offlineCourse;
      case 'centerPicker': return !!ob.centerName;
      case 'centerDuration': return !!ob.centerDuration;
      case 'level': return !!ob.currentLevel;
      case 'advice': return true;
      case 'summary': return true;
      default: return false;
    }
  }, [step, phone, name, ob, selectedCountry]);

  /* ── navigation ── */
  const goPhone = async () => {
    if (phone.length !== selectedCountry.digitCount) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    setPhoneError('');
    try {
      const telegramId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? null;
      const resp = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, telegram_id: telegramId }),
      });
      if (!resp.ok) {
        setPhoneError(copy.phoneCheckError);
        return;
      }
    } catch {
      setPhoneError(copy.phoneCheckError);
      return;
    }
    setResendSec(45);
    setTimeout(() => setStep('otp'), 180);
  };

  const goOtp = async () => {
    if (otpCode.length !== 6) return;
    setOtpStatus('checking');
    try {
      const resp = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, code: otpCode }),
      });
      const data = await resp.json();
      if (data?.ok) {
        setOtpStatus('success');
        setTimeout(() => { setOtpStatus('idle'); setStep('name'); }, 900);
      } else {
        setOtpStatus('error');
        setOtpAttempt((a) => a + 1);
        setTimeout(() => { setOtpCode(''); setOtpStatus('idle'); otpRef.current?.focus(); }, 900);
      }
    } catch {
      setOtpStatus('error');
      setOtpAttempt((a) => a + 1);
      setTimeout(() => { setOtpCode(''); setOtpStatus('idle'); otpRef.current?.focus(); }, 900);
    }
  };

  const goNext = () => {
    if (!canNext) return;
    if (step === 'intro') { setStep('phone'); return; }
    if (step === 'phone') { goPhone(); return; }
    if (step === 'name') { (document.activeElement as HTMLElement | null)?.blur?.(); }
    if (step === 'summary') { finish(); return; }
    const next = idx + 1;
    if (next < allSteps.length) setTimeout(() => setStep(allSteps[next]), 120);
  };

  const goBack = () => {
    if (idx <= 0) return;
    if (step === 'otp') setOtpStatus('idle');
    setStep(allSteps[idx - 1]);
  };

  const resendCode = async () => {
    if (resendSec > 0) return;
    setOtpStatus('checking');
    try {
      const telegramId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? null;
      const resp = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, telegram_id: telegramId }),
      });
      if (!resp.ok) {
        setPhoneError(copy.phoneCheckError);
        return;
      }
    } catch {
      setPhoneError(copy.phoneCheckError);
      return;
    }
    setOtpCode('');
    setOtpStatus('idle');
    setOtpAttempt(0);
    setResendSec(45);
    otpRef.current?.focus();
  };

  const getOtpBotLink = () => {
    return 'https://t.me/FynexEduBot';
  };

  const finish = async () => {
    setStep('loading');
    setLoadingStep(0);
    
    // Animate loading steps
    const stepTimers = [700, 1400, 2100];
    stepTimers.forEach((ms, i) => setTimeout(() => setLoadingStep(i + 1), ms));
    
    // Generate roadmap dynamically
    const { generateRoadmap } = await import('../lib/roadmap');
    const { loadProgress, saveProgress } = await import('../lib/progress');
    const roadmap = generateRoadmap(ob as any);
    const initialProgress = loadProgress();

    setTimeout(() => {
      localStorage.setItem('fynex_roadmap', JSON.stringify(roadmap));
      saveProgress(initialProgress);
      localStorage.setItem('fynex_onboarding', JSON.stringify(ob));
      localStorage.setItem('fynex_onboarding_completed', 'true');
      login(fullPhone, name.trim());
    }, 3200);
  };

  /* ── OTP helper ── */
  const handleOtpChange = (value: string) => {
    if (otpStatus !== 'idle') return;
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(digits);
  };

  /* ── shared styles ── */
  const cardStyle = 'rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl';
  const btnGradient = { background: 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 55%, #b1ef1a 100%)', color: '#0a0d09', boxShadow: '0 12px 40px rgba(195,255,46,0.18)' };
  const selCard = (sel: boolean) => ({
    background: sel ? 'linear-gradient(180deg, rgba(195,255,46,0.16), rgba(195,255,46,0.04))' : 'rgba(255,255,255,0.04)',
    borderColor: sel ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
    boxShadow: sel ? '0 0 24px rgba(195,255,46,0.12)' : 'none',
  });
  const selRow = (sel: boolean) => ({
    background: sel ? 'linear-gradient(135deg, rgba(195,255,46,0.14), rgba(195,255,46,0.04))' : 'rgba(255,255,255,0.04)',
    borderColor: sel ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)',
    boxShadow: sel ? '0 0 20px rgba(195,255,46,0.1)' : 'none',
  });

  const displayName = name.trim() || t.login_meet.split(' ')[0]; // Fallback if name is empty
  const slide = { initial: { opacity: 0, x: 28 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 }, transition: { duration: 0.28, ease: 'easeOut' as const } };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black text-white">
      {/* BG blobs */}
      <div className="pointer-events-none fixed inset-0">
        <motion.div animate={{ opacity: [0.26, 0.42, 0.26], scale: [0.96, 1.04, 0.96] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }} className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-lime-300/20 blur-[110px]" />
        <motion.div animate={{ opacity: [0.1, 0.22, 0.1], x: [-12, 16, -12] }} transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }} className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-orange-500/12 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.82)_74%,#000_100%)]" />
      </div>

      <main className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-8 pt-10">

        {/* ── LOGO (only login steps) ── */}
        {!isOnboarding && (
          <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col items-center pt-4">
            <div className="relative mb-4">
              <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.55, 0.3] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} className="absolute inset-0 rounded-2xl bg-lime-300/30 blur-2xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/20 bg-white/[0.05] backdrop-blur-xl">
                <div className="h-10 w-10" style={{ background: 'linear-gradient(145deg, #e0ff7a 0%, #c3ff2e 50%, #a8e600 100%)', clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)', boxShadow: '0 6px 24px rgba(195,255,46,0.35)' }} />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-[-0.06em] text-lime-300">Fynex</h1>
            <p className="mt-2 text-center text-sm text-white/65">{t.login_welcome}</p>
          </motion.header>
        )}

        {/* ── ONBOARDING HEADER ── */}
        {isOnboarding && (
          <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-2 flex items-center justify-between pt-4">
            <motion.button whileTap={{ scale: 0.95 }} onClick={goBack} className="flex items-center gap-1.5 text-sm font-bold text-white/60 transition-colors hover:text-lime-300">
              <ArrowLeft className="h-4 w-4" /> {t.login_back}
            </motion.button>
            <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-bold text-white/50 backdrop-blur-xl">
              {obIdx + 1} / {obTotal}
            </div>
          </motion.header>
        )}

        {/* ── PROGRESS BAR (onboarding only) ── */}
        {isOnboarding && (
          <div className="mb-6 mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #c3ff2e, #b2ed12)' }} initial={false} animate={{ width: `${((obIdx + 1) / obTotal) * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
          </div>
        )}

        {/* ── STEP CONTENT ── */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <AnimatePresence mode="wait">

            {/* ═══ INTRO ═══ */}
            {step === 'intro' && (
              <motion.section key="intro" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <h2 className="mb-3 text-4xl font-black tracking-[-0.06em]">{copy.introTitle}</h2>
                  <p className="mb-8 text-sm leading-7 text-white/68">{copy.introDesc}</p>
                  <a
                    href={getOtpBotLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black"
                    style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    @FynexEduBot
                  </a>
                </div>
              </motion.section>
            )}

            {/* ═══ PHONE ═══ */}
            {step === 'phone' && (
              <motion.section key="phone" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">{copy.phoneTitle}</h2>
                  <p className="mb-6 text-sm text-white/68">{copy.phoneDesc}</p>
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">{copy.phoneLabel}</div>
                  <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 focus-within:border-lime-300/35">
                    <span className="shrink-0 text-lg font-black tracking-wide text-lime-300">{selectedCountry.flag} {selectedCountry.code}</span>
                    <input ref={phoneRef} type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel-national" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digitCount)); if (phoneError) setPhoneError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goPhone(); } }} className="w-full bg-transparent text-lg font-bold tracking-[0.16em] text-white placeholder:text-white/25 focus:outline-none" placeholder={selectedCountry.digitCount === 9 ? "90 123 45 67" : "912 345 67 89"} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white/50 hover:text-lime-300 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <svg className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <div className="flex justify-center gap-3">
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.code + c.name}
                              type="button"
                              onClick={() => { setSelectedCountry(c); setPhone(''); setShowCountryDropdown(false); }}
                              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${selectedCountry.code === c.code ? 'bg-lime-300/20 border border-lime-300/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                            >
                              <span className="text-2xl">{c.flag}</span>
                              <span className="text-xs font-bold text-white/80">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {phoneError && (
                    <p className="mt-4 text-sm font-medium text-red-400">{phoneError}</p>
                  )}
                </div>
              </motion.section>
            )}

            {/* ═══ OTP ═══ */}
            {step === 'otp' && (
              <motion.section key="otp" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300"><ArrowLeft className="h-4 w-4" /> {t.login_back}</button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">{t.login_verify}</h2>
                  <p className="mb-7 text-sm text-white/68">{fullPhone} {t.login_code_sent}</p>
                  <motion.div key={otpAttempt} animate={otpStatus === 'error' ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : otpStatus === 'success' ? { scale: [1, 1.04, 1] } : { x: 0, scale: 1 }} transition={{ duration: otpStatus === 'error' ? 0.46 : 0.34, ease: 'easeOut' }} className="mb-5">
                    <input
                      ref={otpRef}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => handleOtpChange(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goOtp(); } }}
                      placeholder="123456"
                      className="w-full bg-transparent text-center text-4xl font-black tracking-[0.4em] text-white placeholder:text-white/20 focus:outline-none"
                      style={{
                        color: otpStatus === 'success' ? '#4ade80' : otpStatus === 'error' ? '#f87171' : '#ffffff',
                      }}
                    />
                  </motion.div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div className="h-full rounded-full" style={{ background: otpStatus === 'success' ? '#4ade80' : otpStatus === 'error' ? '#f87171' : 'linear-gradient(90deg, #c3ff2e, #b2ed12)' }} initial={false} animate={{ width: `${(otpCode.length / 6) * 100}%` }} transition={{ duration: 0.2 }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.52)' }}>{copy.otpAttempts}: {otpAttempt}</p>
                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={resendSec > 0}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all"
                      style={{
                        background: resendSec > 0 ? 'rgba(255,255,255,0.06)' : 'rgba(195,255,46,0.15)',
                        color: resendSec > 0 ? 'rgba(255,255,255,0.35)' : 'rgba(195,255,46,0.9)',
                        opacity: resendSec > 0 ? 0.5 : 1,
                      }}
                    >
                      {resendSec > 0 ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{resendSec}s</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>{t.login_next}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <motion.div initial={false} animate={{ opacity: otpStatus === 'idle' ? 0 : 1, y: otpStatus === 'idle' ? 8 : 0 }} className="mt-auto pt-8 text-center text-sm font-medium text-white/65 min-h-6">
                  {otpStatus === 'checking' && <span className="text-lime-300">{t.login_checking}</span>}
                  {otpStatus === 'success' && <span className="text-green-400">{t.login_confirmed}</span>}
                  {otpStatus === 'error' && <span className="text-red-400">{t.login_wrong_code}</span>}
                </motion.div>
              </motion.section>
            )}

            {/* ═══ NAME ═══ */}
            {step === 'name' && (
              <motion.section key="name" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300"><ArrowLeft className="h-4 w-4" /> {t.login_back}</button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">{t.login_meet}</h2>
                  <p className="mb-8 text-sm text-white/68">{t.login_enter_name}</p>
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">{t.login_name}</div>
                  <input ref={nameRef} type="text" inputMode="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goNext(); } }} className="w-full rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 text-lg font-bold text-white placeholder:text-white/25 focus:border-lime-300/35 focus:outline-none" placeholder={t.login_your_name} />
                </div>
              </motion.section>
            )}

            {/* ═══ USER TYPE ═══ */}
            {step === 'userType' && (
              <motion.section key="userType" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, {t.login_who_are_you}</h2>
                <p className="mb-8 text-sm text-white/60">{t.login_select_option}</p>
                <div className="grid grid-cols-2 gap-3">
                  {USER_TYPES.map((t) => {
                    const Icon = t.icon;
                    const sel = ob.userType === t.id;
                    return (
                      <motion.button key={t.id} whileTap={{ scale: 0.97 }} onClick={() => setOb((d) => ({ ...d, userType: t.id, grade: t.id !== 'school' ? '' : d.grade }))} className="flex flex-col items-center gap-3 rounded-[22px] border p-5 text-center transition-all" style={selCard(sel)}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: sel ? 'linear-gradient(135deg, rgba(195,255,46,0.3), rgba(195,255,46,0.1))' : 'rgba(255,255,255,0.06)' }}>
                          <Icon className="h-6 w-6" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.5)' }} />
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}>{t.label}</div>
                          <div className="mt-1 text-[11px] text-white/40">{t.desc}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ GRADE ═══ */}
            {step === 'grade' && (
              <motion.section key="grade" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, {t.login_grade}</h2>
                <p className="mb-8 text-sm text-white/60">{t.login_grade_desc}</p>
                <div className="flex flex-col gap-3">
                  {GRADES.map((g) => {
                    const sel = ob.grade === g.id;
                    return (
                      <motion.button key={g.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, grade: g.id }))} className="flex items-center gap-4 rounded-[20px] border px-6 py-4 text-left transition-all" style={selRow(sel)}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black" style={{ background: sel ? 'linear-gradient(135deg, #c3ff2e, #b2ed12)' : 'rgba(255,255,255,0.06)', color: sel ? '#0a0d09' : 'rgba(255,255,255,0.5)' }}>{g.id}</div>
                        <span className="text-base font-bold" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.85)' }}>{g.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ SUBJECT (formerly Goal) ═══ */}
            {step === 'subject' && (
              <motion.section key="subject" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, {t.login_subject}</h2>
                <p className="mb-8 text-sm text-white/60">{t.login_subject_desc}</p>
                <div className="flex flex-col gap-3">
                  {SUBJECTS.map((g) => {
                    const Icon = g.icon;
                    const sel = ob.subject === g.id;
                    return (
                      <motion.button key={g.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, subject: g.id, offlineCourse: '', centerName: '', centerDuration: '', currentLevel: '' }))} className="flex items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-all" style={selRow(sel)}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: sel ? 'linear-gradient(135deg, rgba(195,255,46,0.3), rgba(195,255,46,0.1))' : 'rgba(255,255,255,0.06)' }}>
                          <Icon className="h-6 w-6" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.45)' }} />
                        </div>
                        <div>
                          <div className="text-[15px] font-bold" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}>{g.label}</div>
                          <div className="mt-0.5 text-[12px] text-white/40">{g.desc}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ OFFLINE COURSE ═══ */}
            {step === 'offlineCourse' && (
              <motion.section key="offlineCourse" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, {t.login_offline_course}</h2>
                <p className="mb-8 text-sm text-white/60">{t.login_offline_desc}</p>
                <div className="flex flex-col gap-3">
                  {OFFLINE_CHOICES.map((c) => {
                    const Icon = c.icon;
                    const sel = ob.offlineCourse === c.id;
                    return (
                      <motion.button key={c.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, offlineCourse: c.id, centerName: '', centerDuration: '', currentLevel: '' }))} className="flex items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-all" style={selRow(sel)}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: sel ? 'linear-gradient(135deg, rgba(195,255,46,0.3), rgba(195,255,46,0.1))' : 'rgba(255,255,255,0.06)' }}>
                          <Icon className="h-6 w-6" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.45)' }} />
                        </div>
                        <div>
                          <div className="text-[15px] font-bold" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}>{c.label}</div>
                          <div className="mt-0.5 text-[12px] text-white/40">{c.desc}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ CENTER PICKER ═══ */}
            {step === 'centerPicker' && (
              <motion.section key="centerPicker" {...slide} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{t.login_center}</h2>
                <p className="mb-4 text-sm text-white/60">{t.login_center_desc}</p>
                
                <div className="mb-4 shrink-0">
                  <input type="text" value={searchCenter} onChange={(e) => setSearchCenter(e.target.value)} placeholder={t.login_center_search} className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm font-medium focus:border-lime-300/40 focus:outline-none" />
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
                  {CENTERS.filter((c) => c.name.toLowerCase().includes(searchCenter.toLowerCase())).map((c) => {
                    const sel = ob.centerName === c.name;
                    return (
                      <motion.button key={c.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, centerName: c.name }))} className="flex items-center w-full gap-4 rounded-[20px] border px-4 py-3.5 transition-all text-left" style={selRow(sel)}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-xl italic" style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}>
                          {c.name[0]}
                        </div>
                        <span className="text-[15px] font-bold" style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.9)' }}>{c.name}</span>
                      </motion.button>
                    );
                  })}
                  {searchCenter.length > 2 && !CENTERS.find(c => c.name.toLowerCase() === searchCenter.trim().toLowerCase()) && (
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, centerName: searchCenter.trim() }))} className="flex items-center w-full gap-4 rounded-[20px] border border-white/20 px-4 py-3.5 transition-all text-left bg-white/[0.02]" style={selRow(ob.centerName === searchCenter.trim())}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold bg-white/10 text-white">
                        +
                      </div>
                      <span className="text-[15px] font-bold">"{searchCenter}" {copy.addCenter}</span>
                    </motion.button>
                  )}
                </div>
              </motion.section>
            )}

            {/* ═══ CENTER DURATION ═══ */}
            {step === 'centerDuration' && (
              <motion.section key="centerDuration" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{ob.centerName} {t.login_duration}</h2>
                <p className="mb-8 text-sm text-white/60">{t.login_duration_desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {DURATIONS.map((dur) => {
                    const sel = ob.centerDuration === dur.id;
                    return (
                      <motion.button key={dur.id} whileTap={{ scale: 0.96 }} onClick={() => setOb((d) => ({ ...d, centerDuration: dur.id }))} className="flex items-center justify-center rounded-[20px] border px-3 py-5 text-center font-bold transition-all" style={selRow(sel)}>
                        <span style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.85)' }}>{dur.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ LEVEL ═══ */}
            {step === 'level' && (
              <motion.section key="level" {...slide} className="flex flex-col flex-1 min-h-0">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{t.login_level}</h2>
                <p className="mb-6 text-sm text-white/60">{t.login_level_desc}</p>
                <div className="flex flex-col gap-2.5 overflow-y-auto pb-4 scrollbar-hide">
                  {LEVELS.map((lvl) => {
                    const sel = ob.currentLevel === lvl.label;
                    return (
                      <motion.button key={lvl.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, currentLevel: lvl.label }))} className="rounded-[18px] border px-5 py-4 text-left text-[15px] font-bold transition-all" style={selRow(sel)}>
                        <span style={{ color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.85)' }}>{lvl.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* ═══ ADVICE ═══ */}
            {step === 'advice' && (
              <motion.section key="advice" {...slide} className="flex flex-col">
                <div className="mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(195,255,46,0.2), rgba(195,255,46,0.05))' }}>
                    <BookOpen className="h-8 w-8 text-lime-300" />
                  </div>
                </div>
                <h2 className="mb-3 text-3xl font-black tracking-[-0.04em]">{t.login_advice}</h2>
                
                {ob.offlineCourse === 'no_fynex' && (
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-white/80">
                    {copy.adviceNoFynex}
                  </div>
                )}
                
                {ob.offlineCourse === 'plan_to_go' && (
                  <div className="rounded-[24px] border border-lime-300/20 bg-lime-300/[0.04] p-5 text-sm leading-relaxed text-white/80">
                    {copy.advicePlanLead}<br/><br/>
                    {copy.advicePlan}
                  </div>
                )}

                {ob.offlineCourse === 'currently_going' && (
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-white/80">
                    {copy.adviceCurrentPrefix} <b>{ob.centerName}</b> <b>{ob.currentLevel}</b> ({ob.centerDuration}).<br/><br/>
                    {copy.adviceCurrentSuffix}
                  </div>
                )}
              </motion.section>
            )}

            {/* ═══ SUMMARY ═══ */}
            {step === 'summary' && (
              <motion.section key="summary" {...slide} className="flex flex-col">
                <div className="mb-6 flex items-center gap-3">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 className="h-8 w-8 text-lime-300" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-black tracking-[-0.04em]">{displayName}, {t.login_summary}</h2>
                    <p className="text-sm text-white/60">{t.login_summary_desc}</p>
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  {[
                    { icon: User, label: copy.summaryUserType, value: LABELS.userType[ob.userType] || '—' },
                    ...(ob.grade ? [{ icon: BookOpen, label: copy.summaryClass, value: LABELS.grade[ob.grade] || '—' }] : []),
                    { icon: Target, label: copy.summarySubject, value: LABELS.subject[ob.subject] || '—' },
                    ...(ob.centerName ? [{ icon: Building2, label: copy.summaryCenter, value: ob.centerName }] : []),
                  ].map((item, i, arr) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex items-center gap-4 py-4" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]"><Icon className="h-5 w-5 text-lime-300/70" /></div>
                        <div className="flex-1">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{item.label}</div>
                          <div className="mt-0.5 text-[15px] font-bold text-white/90">{item.value}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5 text-center text-xs text-white/35">
                  {copy.summaryPlan}
                </motion.p>
              </motion.section>
            )}

            {/* ═══ LOADING ═══ */}
            {step === 'loading' && (
              <motion.section key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center pb-20">
                {/* Orbital rings animation */}
                <div className="relative mb-10 flex h-36 w-36 items-center justify-center">
                  {/* Outer ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: 'rgba(195,255,46,0.15)', borderTopColor: 'rgba(195,255,46,0.6)' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  />
                  {/* Middle ring */}
                  <motion.div
                    className="absolute inset-3 rounded-full border-2"
                    style={{ borderColor: 'rgba(195,255,46,0.08)', borderRightColor: 'rgba(195,255,46,0.4)' }}
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                  />
                  {/* Inner ring */}
                  <motion.div
                    className="absolute inset-6 rounded-full border"
                    style={{ borderColor: 'rgba(195,255,46,0.06)', borderBottomColor: 'rgba(195,255,46,0.3)' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                  />
                  {/* Center glow */}
                  <motion.div
                    className="absolute inset-10 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(195,255,46,0.2), transparent)' }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                  {/* Center Fynex icon */}
                  <motion.div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(195,255,46,0.2), rgba(195,255,46,0.05))', border: '1px solid rgba(195,255,46,0.25)' }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  >
                    <div className="h-8 w-8" style={{ background: 'linear-gradient(145deg, #e0ff7a, #c3ff2e, #a8e600)', clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)' }} />
                  </motion.div>
                  {/* Orbiting dots */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-lime-300"
                      style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
                      animate={{
                        x: [Math.cos((i * Math.PI) / 2) * 60, Math.cos((i * Math.PI) / 2 + Math.PI * 2) * 60],
                        y: [Math.sin((i * Math.PI) / 2) * 60, Math.sin((i * Math.PI) / 2 + Math.PI * 2) * 60],
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.6, 1.2, 0.6],
                      }}
                      transition={{ repeat: Infinity, duration: 3, delay: i * 0.3, ease: 'linear' }}
                    />
                  ))}
                </div>

                <h2 className="mb-3 text-center text-2xl font-black tracking-[-0.04em]">
                  {displayName}, {t.login_plan_creating}
                </h2>

                {/* Loading steps */}
                <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
                  {LOADING_STEPS.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: loadingStep >= i ? 1 : 0.2, x: loadingStep >= i ? 0 : -12 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ background: loadingStep >= i ? 'rgba(195,255,46,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${loadingStep >= i ? 'rgba(195,255,46,0.4)' : 'rgba(255,255,255,0.08)'}` }}
                      >
                        {loadingStep > i ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-lime-300" />
                        ) : loadingStep === i ? (
                          <motion.div className="h-2 w-2 rounded-full bg-lime-300" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        )}
                      </motion.div>
                      <span className="text-[13px] font-medium" style={{ color: loadingStep >= i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ── BOTTOM BUTTON ── */}
        {(step !== 'otp' && step !== 'loading') && (
          <div className="mx-auto mt-auto w-full max-w-md pt-6">
            <motion.button whileTap={{ scale: 0.985 }} onClick={goNext} disabled={!canNext} className="flex h-16 w-full items-center justify-center gap-2 rounded-full text-lg font-black transition-all disabled:opacity-40" style={btnGradient}>
              {step === 'summary'
                ? (<><span>{t.login_start_learning}</span><Rocket className="h-5 w-5" /></>)
                : step === 'intro'
                  ? (<><span>{copy.introButton}</span><ArrowRight className="h-5 w-5" /></>)
                  : (<><span>{t.login_next}</span><ArrowRight className="h-5 w-5" /></>)}
            </motion.button>
          </div>
        )}

        {/* ── DOTS (login) / nothing (onboarding has progress bar) ── */}
        {!isOnboarding && step !== 'otp' && (
          <footer className="mt-5 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => {
              const active = i === loginIdx;
              return <motion.div key={i} animate={{ width: active ? 32 : 10, opacity: active ? 1 : 0.4 }} className="h-1.5 rounded-full" style={{ background: active ? '#c3ff2e' : 'rgba(255,255,255,0.18)' }} />;
            })}
          </footer>
        )}
      </main>
    </div>
  );
}
