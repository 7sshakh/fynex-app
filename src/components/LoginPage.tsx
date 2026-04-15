import { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Rocket,
  GraduationCap, BookOpen, Target, Users,
  Languages, Code2, TrendingUp,
  Globe, MapPin, User, CheckCircle2,
} from 'lucide-react';
import { useUser } from '../context/UserContext';

type Step = 'phone' | 'otp' | 'name' | 'userType' | 'grade' | 'goal' | 'target' | 'summary' | 'loading';

interface OnboardingData {
  userType: 'school' | 'university' | 'applicant' | 'other' | '';
  grade: '1-4' | '5-8' | '9' | '10' | '11' | '';
  goal: 'university' | 'english' | 'programming' | 'school' | '';
  target: { type: 'local' | 'abroad' | ''; university: string };
}

const USER_TYPES = [
  { id: 'school' as const, label: "Maktab o'quvchisi", icon: BookOpen, desc: "Maktabda o'qiyapman" },
  { id: 'university' as const, label: 'Talaba', icon: GraduationCap, desc: "Universitetda o'qiyapman" },
  { id: 'applicant' as const, label: 'Abituriyent', icon: Target, desc: 'Universitetga tayyorlanmoqdaman' },
  { id: 'other' as const, label: 'Boshqa', icon: Users, desc: "Mustaqil o'rganmoqdaman" },
];

const GRADES = [
  { id: '1-4' as const, label: '1–4 sinf' },
  { id: '5-8' as const, label: '5–8 sinf' },
  { id: '9' as const, label: '9-sinf' },
  { id: '10' as const, label: '10-sinf' },
  { id: '11' as const, label: '11-sinf' },
];

const GOALS = [
  { id: 'university' as const, label: "Imtihonlardan o'tish", icon: GraduationCap, desc: 'Universitetga kirish' },
  { id: 'english' as const, label: "Ingliz tilini o'rganish", icon: Languages, desc: 'IELTS / General English' },
  { id: 'programming' as const, label: "Dasturlashni o'rganish", icon: Code2, desc: 'IT sohasida ishlash' },
  { id: 'school' as const, label: 'Maktab natijalarini yaxshilash', icon: TrendingUp, desc: 'Baholarni oshirish' },
];

const ABROAD_UNIS = ['Harvard', 'MIT', 'Stanford', 'Oxford', 'Cambridge'];
const LOCAL_UNIS = [
  'Toshkent Davlat Universiteti', 'INHA University Tashkent', 'Webster University',
  'Turin Politexnika Universiteti', 'Toshkent Tibbiyot Akademiyasi', 'Toshkent Moliya Instituti',
];

const LABELS: Record<string, Record<string, string>> = {
  userType: { school: "Maktab o'quvchisi", university: 'Talaba', applicant: 'Abituriyent', other: 'Boshqa' },
  goal: { university: "Imtihonlardan o'tish", english: "Ingliz tili (IELTS)", programming: "Dasturlash", school: "Maktab natijalari" },
  grade: { '1-4': '1–4 sinf', '5-8': '5–8 sinf', '9': '9-sinf', '10': '10-sinf', '11': '11-sinf' },
};

export default function LoginPage() {
  const { login } = useUser();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [otpAttempt, setOtpAttempt] = useState(0);
  const [customUni, setCustomUni] = useState('');
  const [ob, setOb] = useState<OnboardingData>({ userType: '', grade: '', goal: '', target: { type: '', university: '' } });

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const otpRef = useRef<HTMLInputElement | null>(null);
  const fullPhone = `+998${phone}`;

  /* ── dynamic step list ── */
  const allSteps = useMemo<Step[]>(() => {
    const s: Step[] = ['phone', 'otp', 'name', 'userType'];
    if (ob.userType === 'school') s.push('grade');
    s.push('goal');
    if (ob.goal === 'university') s.push('target');
    s.push('summary');
    return s;
  }, [ob.userType, ob.goal]);

  const idx = allSteps.indexOf(step);
  const isOnboarding = idx >= 3;
  const obIdx = idx - 3; // 0-based onboarding step
  const obTotal = allSteps.length - 3;
  const loginIdx = Math.min(idx, 2); // 0,1,2 for login dots

  /* ── auto-focus ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 'phone') phoneRef.current?.focus();
      if (step === 'otp') otpRef.current?.focus();
      if (step === 'name') nameRef.current?.focus();
    }, 280);
    return () => clearTimeout(t);
  }, [step]);

  /* ── OTP auto-submit ── */
  useEffect(() => {
    if (step !== 'otp' || otpStatus !== 'idle') return;
    if (otpCode.length === 6) goOtp();
  }, [otpCode, otpStatus, step]);

  /* ── can proceed? ── */
  const canNext = useMemo(() => {
    switch (step) {
      case 'phone': return phone.length === 9;
      case 'otp': return false;
      case 'name': return name.trim().length >= 2;
      case 'userType': return !!ob.userType;
      case 'grade': return !!ob.grade;
      case 'goal': return !!ob.goal;
      case 'target': return !!ob.target.type && !!ob.target.university;
      case 'summary': return true;
      default: return false;
    }
  }, [step, phone, name, ob]);

  /* ── navigation ── */
  const goPhone = () => {
    if (phone.length !== 9) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    setTimeout(() => setStep('otp'), 180);
  };

  const goOtp = () => {
    if (otpCode.length !== 6) return;
    setOtpStatus('checking');
    setTimeout(() => {
      if (otpCode === '123456') {
        setOtpStatus('success');
        setTimeout(() => { setOtpStatus('idle'); setStep('name'); }, 900);
      } else {
        setOtpStatus('error');
        setOtpAttempt((a) => a + 1);
        setTimeout(() => { setOtpCode(''); setOtpStatus('idle'); otpRef.current?.focus(); }, 900);
      }
    }, 450);
  };

  const goNext = () => {
    if (!canNext) return;
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

  const finish = async () => {
    setStep('loading');
    
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
    }, 2800);
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

  const displayName = name.trim() || 'Do\'stim';
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
            <p className="mt-2 text-center text-sm text-white/65">Ta'limni chiroyli va qulay boshlaymiz</p>
          </motion.header>
        )}

        {/* ── ONBOARDING HEADER ── */}
        {isOnboarding && (
          <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-2 flex items-center justify-between pt-4">
            <motion.button whileTap={{ scale: 0.95 }} onClick={goBack} className="flex items-center gap-1.5 text-sm font-bold text-white/60 transition-colors hover:text-lime-300">
              <ArrowLeft className="h-4 w-4" /> Orqaga
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

            {/* ═══ PHONE ═══ */}
            {step === 'phone' && (
              <motion.section key="phone" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Xush kelibsiz</h2>
                  <p className="mb-8 text-sm text-white/68">Telefon raqamingizni kiriting</p>
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">Telefon</div>
                  <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 focus-within:border-lime-300/35">
                    <span className="shrink-0 text-lg font-black tracking-wide text-lime-300">+998</span>
                    <input ref={phoneRef} type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goPhone(); } }} className="w-full bg-transparent text-lg font-bold tracking-[0.16em] text-white placeholder:text-white/25 focus:outline-none" placeholder="90 123 45 67" />
                  </div>
                </div>
              </motion.section>
            )}

            {/* ═══ OTP ═══ */}
            {step === 'otp' && (
              <motion.section key="otp" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300"><ArrowLeft className="h-4 w-4" /> Orqaga</button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Tasdiqlash</h2>
                  <p className="mb-7 text-sm text-white/68">{fullPhone} raqamiga yuborilgan kodni kiriting</p>
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
                </div>
                <motion.div initial={false} animate={{ opacity: otpStatus === 'idle' ? 0 : 1, y: otpStatus === 'idle' ? 8 : 0 }} className="mt-auto pt-8 text-center text-sm font-medium text-white/65 min-h-6">
                  {otpStatus === 'checking' && <span className="text-lime-300">Kod tekshirilmoqda...</span>}
                  {otpStatus === 'success' && <span className="text-green-400">Kod tasdiqlandi ✓</span>}
                  {otpStatus === 'error' && <span className="text-red-400">Kod xato, qayta kiriting</span>}
                </motion.div>
              </motion.section>
            )}

            {/* ═══ NAME ═══ */}
            {step === 'name' && (
              <motion.section key="name" {...slide} className="flex h-full flex-col">
                <div className={cardStyle}>
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300"><ArrowLeft className="h-4 w-4" /> Orqaga</button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Tanishaylik</h2>
                  <p className="mb-8 text-sm text-white/68">Ismingizni kiriting va boshlaymiz</p>
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">Ism</div>
                  <input ref={nameRef} type="text" inputMode="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goNext(); } }} className="w-full rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 text-lg font-bold text-white placeholder:text-white/25 focus:border-lime-300/35 focus:outline-none" placeholder="Ismingiz" />
                </div>
              </motion.section>
            )}

            {/* ═══ USER TYPE ═══ */}
            {step === 'userType' && (
              <motion.section key="userType" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, siz kimsiz? 🤔</h2>
                <p className="mb-8 text-sm text-white/60">O'zingizga mos variantni tanlang</p>
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
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, nechanchi sinfda o'qiysiz? 📚</h2>
                <p className="mb-8 text-sm text-white/60">Sinf darajangizni tanlang</p>
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

            {/* ═══ GOAL ═══ */}
            {step === 'goal' && (
              <motion.section key="goal" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, Fynex sizga nima uchun kerak? 🎯</h2>
                <p className="mb-8 text-sm text-white/60">Asosiy maqsadingizni tanlang</p>
                <div className="flex flex-col gap-3">
                  {GOALS.map((g) => {
                    const Icon = g.icon;
                    const sel = ob.goal === g.id;
                    return (
                      <motion.button key={g.id} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, goal: g.id, target: g.id !== 'university' ? { type: '', university: '' } : d.target }))} className="flex items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-all" style={selRow(sel)}>
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

            {/* ═══ TARGET ═══ */}
            {step === 'target' && (
              <motion.section key="target" {...slide} className="flex flex-col">
                <h2 className="mb-2 text-3xl font-black tracking-[-0.04em]">{displayName}, qayerda o'qimoqchisiz? 🌍</h2>
                <p className="mb-6 text-sm text-white/60">Universitetingizni tanlang</p>

                <div className="mb-6 flex gap-3">
                  {([{ id: 'local' as const, label: "O'zbekiston", icon: MapPin }, { id: 'abroad' as const, label: 'Xorijda', icon: Globe }]).map((o) => { const Icon = o.icon; const sel = ob.target.type === o.id; return (
                    <motion.button key={o.id} whileTap={{ scale: 0.97 }} onClick={() => { setOb((d) => ({ ...d, target: { type: o.id, university: '' } })); setCustomUni(''); }} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border py-4 font-bold transition-all" style={{ background: sel ? 'linear-gradient(135deg, rgba(195,255,46,0.16), rgba(195,255,46,0.04))' : 'rgba(255,255,255,0.04)', borderColor: sel ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.08)', color: sel ? '#c3ff2e' : 'rgba(255,255,255,0.7)' }}>
                      <Icon className="h-5 w-5" />{o.label}
                    </motion.button>
                  ); })}
                </div>

                {ob.target.type && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} className="flex flex-col gap-2">
                    {ob.target.type === 'abroad' && (
                      <>
                        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Mashhur universitetlar</div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ABROAD_UNIS.map((u) => { const sel = ob.target.university === u; return (
                            <motion.button key={u} whileTap={{ scale: 0.95 }} onClick={() => setOb((d) => ({ ...d, target: { ...d.target, university: u } }))} className="rounded-full border px-4 py-2 text-sm font-semibold transition-all" style={{ background: sel ? 'linear-gradient(135deg, #c3ff2e, #b2ed12)' : 'rgba(255,255,255,0.04)', borderColor: sel ? 'rgba(195,255,46,0.5)' : 'rgba(255,255,255,0.1)', color: sel ? '#0a0d09' : 'rgba(255,255,255,0.75)' }}>
                              {u}
                            </motion.button>
                          ); })}
                        </div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Yoki boshqa</div>
                        <div className="flex gap-2">
                          <input type="text" value={customUni} onChange={(e) => setCustomUni(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && customUni.trim()) { e.preventDefault(); setOb((d) => ({ ...d, target: { ...d.target, university: customUni.trim() } })); } }} placeholder="Universitet nomi..." className="flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 focus:border-lime-300/35 focus:outline-none" />
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { if (customUni.trim()) setOb((d) => ({ ...d, target: { ...d.target, university: customUni.trim() } })); }} disabled={!customUni.trim()} className="rounded-2xl px-4 py-3 text-sm font-bold transition-all disabled:opacity-30" style={{ background: 'linear-gradient(135deg, rgba(195,255,46,0.2), rgba(195,255,46,0.08))', color: '#c3ff2e', border: '1px solid rgba(195,255,46,0.2)' }}>OK</motion.button>
                        </div>
                      </>
                    )}
                    {ob.target.type === 'local' && (
                      <>
                        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Universitetni tanlang</div>
                        {LOCAL_UNIS.map((u) => { const sel = ob.target.university === u; return (
                          <motion.button key={u} whileTap={{ scale: 0.98 }} onClick={() => setOb((d) => ({ ...d, target: { ...d.target, university: u } }))} className="rounded-[18px] border px-5 py-3.5 text-left text-sm font-semibold transition-all" style={selRow(sel)}>
                            {u}
                          </motion.button>
                        ); })}
                      </>
                    )}
                  </motion.div>
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
                    <h2 className="text-3xl font-black tracking-[-0.04em]">{displayName}, hammasi tayyor! 🎉</h2>
                    <p className="text-sm text-white/60">Sizning ma'lumotlaringiz</p>
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  {[
                    { icon: User, label: 'Foydalanuvchi turi', value: LABELS.userType[ob.userType] || '—' },
                    ...(ob.grade ? [{ icon: BookOpen, label: 'Sinf', value: LABELS.grade[ob.grade] || '—' }] : []),
                    { icon: Target, label: 'Maqsad', value: LABELS.goal[ob.goal] || '—' },
                    ...(ob.target.university ? [{ icon: MapPin, label: 'Universitet', value: `${ob.target.university} (${ob.target.type === 'abroad' ? 'Xorij' : "O'zbekiston"})` }] : []),
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
                  Bu ma'lumotlar asosida sizga shaxsiy o'quv reja tuziladi ✨
                </motion.p>
              </motion.section>
            )}

            {/* ═══ LOADING ═══ */}
            {step === 'loading' && (
              <motion.section key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center pb-20">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] shadow-[0_0_40px_rgba(195,255,46,0.15)]"
                  style={{ background: 'linear-gradient(135deg, rgba(195,255,46,0.25), rgba(195,255,46,0.05))', border: '1px solid rgba(195,255,46,0.3)' }}
                >
                  <Rocket className="h-10 w-10 text-lime-300" />
                </motion.div>
                <h2 className="mb-2 text-center text-2xl font-black tracking-[-0.04em]">Siz uchun shaxsiy reja <br/> tuzmoqdamiz...</h2>
                <div className="mt-4 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="h-2 w-2 rounded-full bg-lime-300" />
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
              {step === 'summary' ? (<><span>O'qishni boshlash</span><Rocket className="h-5 w-5" /></>) : (<><span>Davom etish</span><ArrowRight className="h-5 w-5" /></>)}
            </motion.button>
          </div>
        )}

        {/* ── DOTS (login) / nothing (onboarding has progress bar) ── */}
        {!isOnboarding && step !== 'otp' && (
          <footer className="mt-5 flex justify-center gap-2">
            {[0, 1, 2].map((i) => {
              const active = i === loginIdx;
              return <motion.div key={i} animate={{ width: active ? 32 : 10, opacity: active ? 1 : 0.4 }} className="h-1.5 rounded-full" style={{ background: active ? '#c3ff2e' : 'rgba(255,255,255,0.18)' }} />;
            })}
          </footer>
        )}
      </main>
    </div>
  );
}
