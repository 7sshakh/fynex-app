import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Phone, MessageCircle, ArrowRight, Check } from 'lucide-react';

export default function LoginPage() {
  const { login } = useUser();
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const fullPhone = `+998${phone}`;

  const handlePhoneSubmit = () => {
    if (phone.length === 9) {
      setTimeout(() => setStep('otp'), 500);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = () => {
    if (otp.join('').length === 6) {
      setTimeout(() => setStep('name'), 500);
    }
  };

  const handleNameSubmit = () => {
    if (name.trim().length >= 2) {
      login(fullPhone, name.trim());
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-6"
      style={{
        background:
          'radial-gradient(circle at bottom, rgba(193, 255, 46, 0.24), transparent 30%), linear-gradient(180deg, #060706 0%, #0a0d09 58%, #14180c 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.1, 0.18, 0.1], y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-lime-300/15 blur-3xl"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-300/10 bg-lime-300/5 backdrop-blur-xl shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
                className="relative h-11 w-11"
              >
                <div
                  className="absolute inset-0 rounded-[0.9rem]"
                  style={{
                    background: 'linear-gradient(180deg, #dbff61 0%, #c3ff2e 55%, #9fdc16 100%)',
                    clipPath: 'polygon(20% 0%, 82% 0%, 60% 44%, 78% 44%, 56% 100%, 0% 100%, 26% 42%, 8% 42%)',
                  }}
                />
              </motion.div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-lime-300 text-[10px] text-black"
            >
              <span>+</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-center text-3xl font-bold text-lime-50"
        >
          Fynex 2.0
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center text-lime-100/70"
        >
          Bepul ta'lim platformasi
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-lime-300/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
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

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <div className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 flex items-center gap-2 focus-within:ring-2 focus-within:ring-white/40 transition-all">
                    <span className="shrink-0 text-white font-semibold">+998</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none"
                      placeholder="90 123 45 67"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhoneSubmit}
                  disabled={phone.length !== 9}
                  className="w-full bg-white text-indigo-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`otp-${index}`}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-12 h-14 bg-white/10 border border-white/20 rounded-2xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOtpSubmit}
                  disabled={otp.join('').length !== 6}
                  className="w-full bg-white text-indigo-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="Ismingiz"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNameSubmit}
                  disabled={name.trim().length < 2}
                  className="w-full bg-white text-indigo-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>Boshlang</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-white/50 text-xs mt-6"
        >
          Davom etish orqali siz shartlarni qabul qilasiz
        </motion.p>
      </motion.div>
    </div>
  );
}
