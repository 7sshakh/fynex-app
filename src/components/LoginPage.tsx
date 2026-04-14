import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Phone, MessageCircle, ArrowRight, Check } from 'lucide-react';

export default function LoginPage() {
  const { login } = useUser();
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fullPhone = `+998${phone}`;

  useEffect(() => {
    const focusDelay = window.setTimeout(() => {
      if (step === 'phone') {
        phoneInputRef.current?.focus();
      } else if (step === 'otp') {
        otpRefs.current[0]?.focus();
      } else if (step === 'name') {
        nameInputRef.current?.focus();
      }
    }, 240);

    return () => window.clearTimeout(focusDelay);
  }, [step]);

  const handlePhoneSubmit = () => {
    if (phone.length === 9) {
      (document.activeElement as HTMLElement | null)?.blur?.();
      setTimeout(() => setStep('otp'), 220);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    if (otp.join('').length === 6) {
      (document.activeElement as HTMLElement | null)?.blur?.();
      setTimeout(() => setStep('name'), 220);
    }
  };

  const handleNameSubmit = () => {
    if (name.trim().length >= 2) {
      login(fullPhone, name.trim());
    }
  };

  return (
    <div
      className="relative h-full flex items-center justify-center overflow-hidden p-6"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 120%, rgba(193, 255, 46, 0.28) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
          linear-gradient(180deg, #050505 0%, #0a0a0a 40%, #111210 100%)
        `,
      }}
    >
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-lime-300/20 blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.08, 0.15, 0.08], x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-violet-500/15 blur-[80px]"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex min-h-[calc(100dvh-48px)] w-full max-w-md flex-col justify-center"
      >
        {/* Logo with enhanced glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            {/* Outer glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl bg-lime-300/30 blur-xl"
            />
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-lime-300/20 bg-gradient-to-b from-lime-300/10 to-lime-300/5 backdrop-blur-xl shadow-2xl shadow-lime-300/10">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="relative h-10 w-10"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(145deg, #e0ff7a 0%, #c3ff2e 50%, #a8e600 100%)',
                    clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)',
                    boxShadow: '0 4px 20px rgba(195, 255, 46, 0.4)',
                  }}
                />
              </motion.div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-lime-400 text-[10px] font-bold text-black shadow-lg shadow-lime-300/30"
            >
              <span>2</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Title with better typography */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-center text-[32px] font-bold tracking-tight text-white"
          style={{ textShadow: '0 2px 20px rgba(195, 255, 46, 0.15)' }}
        >
          Fynex <span className="text-lime-300">2.0</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 text-center text-[15px] text-white/60"
        >
          Bepul ta'lim platformasi
        </motion.p>

        {/* Main card with enhanced glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          className="rounded-[32px] border border-white/10 bg-white/[0.08] px-6 py-8 shadow-2xl backdrop-blur-2xl sm:px-7"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Xush kelibsiz!</h2>
                  <p className="text-white/70 text-sm">Telefon raqamingizni kiriting</p>
                </div>

                {/* Phone input with refined styling */}
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-lime-300/60 transition-colors" />
                  <div className="w-full bg-black/20 border border-white/10 rounded-2xl py-[14px] pl-12 pr-4 flex items-center gap-3 focus-within:border-lime-300/30 focus-within:bg-black/30 transition-all duration-200">
                    <span className="shrink-0 text-white/70 font-medium text-[15px]">+998</span>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handlePhoneSubmit();
                        }
                      }}
                      className="w-full bg-transparent text-white text-[15px] font-medium placeholder-white/30 focus:outline-none tracking-wide"
                      placeholder="90 123 45 67"
                    />
                  </div>
                </div>

                {/* Gradient button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(195, 255, 46, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhoneSubmit}
                  disabled={phone.length !== 9}
                  className="w-full font-semibold py-[14px] rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-[15px]"
                  style={{
                    background: phone.length === 9 
                      ? 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 50%, #b1ef1a 100%)' 
                      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    color: phone.length === 9 ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                    boxShadow: phone.length === 9 ? '0 4px 20px rgba(195, 255, 46, 0.15)' : 'none',
                  }}
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Tasdiqlash</h2>
                  <p className="text-white/70 text-sm">
                    {fullPhone} raqamiga yuborilgan<br />
                    6 xonali kodni kiriting
                  </p>
                </div>

                {/* Refined OTP inputs */}
                <div className="flex justify-center gap-[10px]">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`otp-${index}`}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200 }}
                      className={`w-11 h-[52px] bg-black/20 border rounded-xl text-center text-xl font-bold transition-all duration-200 focus:outline-none
                        ${digit ? 'border-lime-300/50 text-lime-300 bg-lime-300/10' : 'border-white/10 text-white focus:border-lime-300/30'}`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(195, 255, 46, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOtpSubmit}
                  disabled={otp.join('').length !== 6}
                  className="w-full font-semibold py-[14px] rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-[15px]"
                  style={{
                    background: otp.join('').length === 6 
                      ? 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 50%, #b1ef1a 100%)' 
                      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    color: otp.join('').length === 6 ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                    boxShadow: otp.join('').length === 6 ? '0 4px 20px rgba(195, 255, 46, 0.15)' : 'none',
                  }}
                >
                  <span>Tasdiqlash</span>
                  <Check className="w-5 h-5" />
                </motion.button>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-white/60 text-sm hover:text-white transition-colors"
                >
                  Raqamni o'zgartirish
                </button>
              </motion.div>
            )}

            {step === 'name' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Ismingizni kiriting</h2>
                  <p className="text-white/70 text-sm">Sizni qanday chaqirishimiz kerak?</p>
                </div>

                {/* Name input with refined styling */}
                <div className="relative group">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-lime-300/60 transition-colors" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNameSubmit();
                      }
                    }}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-[14px] pl-12 pr-4 text-white text-[15px] font-medium placeholder-white/30 focus:outline-none focus:border-lime-300/30 focus:bg-black/30 transition-all duration-200"
                    placeholder="Ismingiz"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(195, 255, 46, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNameSubmit}
                  disabled={name.trim().length < 2}
                  className="w-full font-semibold py-[14px] rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-[15px]"
                  style={{
                    background: name.trim().length >= 2 
                      ? 'linear-gradient(135deg, #d4ff5c 0%, #c3ff2e 50%, #b1ef1a 100%)' 
                      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    color: name.trim().length >= 2 ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                    boxShadow: name.trim().length >= 2 ? '0 4px 20px rgba(195, 255, 46, 0.15)' : 'none',
                  }}
                >
                  <span>Boshlang</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer with subtle styling */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-white/40 text-xs mt-8 tracking-wide"
        >
          Davom etish orqali siz <span className="text-white/60">shartlarni</span> qabul qilasiz
        </motion.p>
      </motion.div>
    </div>
  );
}
