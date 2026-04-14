import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

type Step = 'phone' | 'otp' | 'name';

export default function LoginPage() {
  const { login } = useUser();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fullPhone = `+998${phone}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (step === 'phone') phoneRef.current?.focus();
      if (step === 'otp') otpRefs.current[0]?.focus();
      if (step === 'name') nameRef.current?.focus();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [step]);

  const goPhone = () => {
    if (phone.length !== 9) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.setTimeout(() => setStep('otp'), 180);
  };

  const goOtp = () => {
    if (otp.join('').length !== 6) return;
    setOtpStatus('checking');
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.setTimeout(() => {
      if (otp.join('') === '123456') {
        setOtpStatus('success');
        window.setTimeout(() => {
          setOtpStatus('idle');
          setStep('name');
        }, 900);
      } else {
        setOtpStatus('error');
        window.setTimeout(() => {
          setOtp(['', '', '', '', '', '']);
          setOtpStatus('idle');
          otpRefs.current[0]?.focus();
        }, 900);
      }
    }, 450);
  };

  const finish = () => {
    if (name.trim().length < 2) return;
    login(fullPhone, name.trim());
  };

  const updateOtp = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (otpStatus !== 'idle') return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (value && index === 5) window.setTimeout(goOtp, 120);
  };

  const goBack = () => {
    if (step === 'otp') setStep('phone');
    if (step === 'name') setStep('otp');
    setOtpStatus('idle');
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white">
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
        <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col items-center pt-6">
          <div className="relative mb-5">
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-lime-300/30 blur-2xl"
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/20 bg-white/[0.05] backdrop-blur-xl">
              <div
                className="h-10 w-10"
                style={{
                  background: 'linear-gradient(145deg, #e0ff7a 0%, #c3ff2e 50%, #a8e600 100%)',
                  clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)',
                  boxShadow: '0 6px 24px rgba(195,255,46,0.35)',
                }}
              />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-[-0.06em] text-lime-300">Fynex</h1>
          <p className="mt-2 text-center text-sm text-white/65">Ta'limni chiroyli va qulay boshlaymiz</p>
        </motion.header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.section
                key="phone"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex h-full flex-col"
              >
                <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl">
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Xush kelibsiz</h2>
                  <p className="mb-8 text-sm text-white/68">Telefon raqamingizni kiriting</p>

                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">Telefon</div>
                  <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 focus-within:border-lime-300/35">
                    <span className="shrink-0 text-lg font-black tracking-wide text-lime-300">+998</span>
                    <input
                      ref={phoneRef}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 9))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          goPhone();
                        }
                      }}
                      className="w-full bg-transparent text-lg font-bold tracking-[0.16em] text-white placeholder:text-white/25 focus:outline-none"
                      placeholder="90 123 45 67"
                    />
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <motion.button
                    whileTap={{ scale: 0.985 }}
                    onClick={goPhone}
                    disabled={phone.length !== 9}
                    className="flex h-16 w-full items-center justify-center gap-2 rounded-full text-lg font-black transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 55%, #b1ef1a 100%)', color: '#0a0d09', boxShadow: '0 12px 40px rgba(195,255,46,0.18)' }}
                  >
                    Davom etish
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.section>
            )}

            {step === 'otp' && (
              <motion.section
                key="otp"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex h-full flex-col"
              >
                <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl">
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300">
                    <ArrowLeft className="h-4 w-4" />
                    Orqaga
                  </button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Tasdiqlash</h2>
                  <p className="mb-7 text-sm text-white/68">{fullPhone} raqamiga yuborilgan kodni kiriting</p>

                  <div className="mb-5 flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={digit}
                        onChange={(event) => updateOtp(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            goOtp();
                          }
                        }}
                        disabled={otpStatus === 'checking' || otpStatus === 'success'}
                        className="h-16 w-12 rounded-2xl border text-center text-2xl font-black text-white focus:outline-none disabled:opacity-100"
                        style={{
                          background: otpStatus === 'success' ? 'rgba(34,197,94,0.18)' : otpStatus === 'error' ? 'rgba(239,68,68,0.18)' : 'rgba(0,0,0,0.25)',
                          borderColor: otpStatus === 'success' ? 'rgba(34,197,94,0.72)' : otpStatus === 'error' ? 'rgba(239,68,68,0.72)' : 'rgba(255,255,255,0.10)',
                        }}
                      />
                    ))}
                  </div>

                  <div className="rounded-2xl border border-lime-300/10 bg-lime-300/[0.06] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-lime-300/80">Demo kod</p>
                    <p className="mt-1 text-base font-black text-lime-300">123456</p>
                  </div>
                </div>

                <div className="mt-auto pt-8 text-center text-sm font-medium text-white/65">
                  {otpStatus === 'checking' && 'Kod tekshirilmoqda...'}
                  {otpStatus === 'success' && <span className="text-green-400">Kod tasdiqlandi</span>}
                  {otpStatus === 'error' && <span className="text-red-400">Kod xato, qayta kiriting</span>}
                  {otpStatus === 'idle' && '6 xonali kod to‘liq kiritilgach avtomatik tekshiriladi'}
                </div>
              </motion.section>
            )}

            {step === 'name' && (
              <motion.section
                key="name"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex h-full flex-col"
              >
                <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl">
                  <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/65 transition-colors hover:text-lime-300">
                    <ArrowLeft className="h-4 w-4" />
                    Orqaga
                  </button>
                  <h2 className="mb-2 text-4xl font-black tracking-[-0.06em]">Tanishaylik</h2>
                  <p className="mb-8 text-sm text-white/68">Ismingizni kiriting va boshlaymiz</p>

                  <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-lime-300/90">Ism</div>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        finish();
                      }
                    }}
                    className="w-full rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 text-lg font-bold text-white placeholder:text-white/25 focus:border-lime-300/35 focus:outline-none"
                    placeholder=""
                  />
                </div>

                <div className="mt-auto pt-8">
                  <motion.button
                    whileTap={{ scale: 0.985 }}
                    onClick={finish}
                    disabled={name.trim().length < 2}
                    className="flex h-16 w-full items-center justify-center gap-2 rounded-full text-lg font-black transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 55%, #b1ef1a 100%)', color: '#0a0d09', boxShadow: '0 12px 40px rgba(195,255,46,0.18)' }}
                  >
                    Boshlash
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((index) => {
            const active = (step === 'phone' && index === 0) || (step === 'otp' && index === 1) || (step === 'name' && index === 2);
            return (
              <motion.div
                key={index}
                animate={{ width: active ? 32 : 10, opacity: active ? 1 : 0.4 }}
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
