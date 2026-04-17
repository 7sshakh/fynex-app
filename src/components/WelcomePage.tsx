import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles, BookOpen, Globe, Rocket } from 'lucide-react';
import { getTranslations } from '../lib/i18n';

type Lang = 'en' | 'uz' | 'ru';

const LANGS: { id: Lang; label: string; native: string; flag: string }[] = [
  { id: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'uz', label: "O'zbek", native: "O'zbekcha", flag: '🇺🇿' },
  { id: 'ru', label: 'Русский', native: 'Русский', flag: '🇷🇺' },
];

interface SlideData {
  tag: string;
  title: string;
  subtitle: string;
  gradient: string;
  iconBg: string;
  icon: React.ReactNode;
  particles: { x: string; y: string; size: number; delay: number; emoji: string }[];
}

const getSlideData = (lang: Lang): SlideData[] => {
  const t = getTranslations(lang);
  return [
    {
      tag: 'FYNEX',
      title: t.welcome_title_1,
      subtitle: t.welcome_subtitle_1,
      gradient: 'linear-gradient(160deg, #0a1a0a 0%, #0d1f0d 30%, #0e0e0e 100%)',
      iconBg: 'linear-gradient(135deg, #c3ff2e, #a8e600)',
      icon: <Sparkles className="h-8 w-8 text-black" />,
      particles: [
        { x: '15%', y: '20%', size: 6, delay: 0, emoji: '✨' },
        { x: '78%', y: '15%', size: 8, delay: 0.5, emoji: '⚡' },
        { x: '85%', y: '60%', size: 5, delay: 1.2, emoji: '💡' },
        { x: '10%', y: '70%', size: 7, delay: 0.8, emoji: '🎯' },
      ],
    },
    {
      tag: t.welcome_tag_2,
      title: t.welcome_title_2,
      subtitle: t.welcome_subtitle_2,
      gradient: 'linear-gradient(160deg, #0a0a1f 0%, #0d0d28 30%, #0e0e0e 100%)',
      iconBg: 'linear-gradient(135deg, #818cf8, #6366f1)',
      icon: <BookOpen className="h-8 w-8 text-white" />,
      particles: [
        { x: '80%', y: '22%', size: 8, delay: 0.3, emoji: '📚' },
        { x: '12%', y: '35%', size: 6, delay: 0.7, emoji: '🧠' },
        { x: '75%', y: '72%', size: 5, delay: 1, emoji: '🏆' },
        { x: '20%', y: '80%', size: 7, delay: 0.2, emoji: '🔥' },
      ],
    },
    {
      tag: t.welcome_tag_3,
      title: t.welcome_title_3,
      subtitle: t.welcome_subtitle_3,
      gradient: 'linear-gradient(160deg, #1a0a0a 0%, #200d0d 30%, #0e0e0e 100%)',
      iconBg: 'linear-gradient(135deg, #fb923c, #f97316)',
      icon: <Globe className="h-8 w-8 text-white" />,
      particles: [
        { x: '82%', y: '18%', size: 6, delay: 0.4, emoji: '🌍' },
        { x: '8%', y: '25%', size: 7, delay: 0.9, emoji: '🇺🇿' },
        { x: '88%', y: '55%', size: 5, delay: 0.6, emoji: '🇬🇧' },
        { x: '15%', y: '65%', size: 6, delay: 1.1, emoji: '🇷🇺' },
      ],
    },
  ];
};

export default function WelcomePage({ onComplete }: { onComplete: (lang: Lang) => void }) {
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [showButton, setShowButton] = useState(false);
  const [direction, setDirection] = useState(1);

  const SLIDES = getSlideData(lang);
  const t = getTranslations(lang);
  
  const isLast = current === SLIDES.length - 1;
  const slide = SLIDES[current];

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
      setShowButton(false);
    }
  };

  const selectLang = (l: Lang) => {
    setLang(l);
    setTimeout(() => setShowButton(true), 300);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {/* ── Animated background ── */}
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{ background: slide.gradient }}
      />

      {/* ── Floating particles ── */}
      {slide.particles.map((p, i) => (
        <motion.div
          key={`${current}-${i}`}
          className="absolute pointer-events-none select-none"
          style={{ left: p.x, top: p.y, fontSize: p.size * 3 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.4, 0.2, 0.4, 0],
            scale: [0.5, 1, 0.8, 1, 0.5],
            y: [0, -20, 0, -15, 0],
          }}
          transition={{ repeat: Infinity, duration: 5, delay: p.delay, ease: 'easeInOut' }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* ── Background glow blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: current === 0 ? '#c3ff2e' : current === 1 ? '#6366f1' : '#f97316' }}
        />
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute -right-16 bottom-1/3 h-60 w-60 rounded-full blur-[90px]"
          style={{ background: current === 0 ? '#b2ed12' : current === 1 ? '#818cf8' : '#fb923c' }}
        />
      </div>

      {/* ── Content ── */}
      <main className="relative z-10 flex h-full flex-col px-7 pb-10 pt-safe-top">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between pt-8 mb-4">
          {current > 0 ? (
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] backdrop-blur-xl"
            >
              <ChevronLeft className="h-5 w-5 text-white/70" />
            </motion.button>
          ) : (
            <div className="h-10 w-10" />
          )}

          {/* Dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current ? 28 : 8,
                  opacity: i === current ? 1 : 0.3,
                }}
                className="h-2 rounded-full"
                style={{ background: i === current ? (current === 0 ? '#c3ff2e' : current === 1 ? '#818cf8' : '#fb923c') : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>

          <div className="h-10 w-10" />
        </div>

        {/* ── Slide Content ── */}
        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 250, damping: 20 }}
                className="mb-8"
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-[26px] shadow-xl"
                  style={{ background: slide.iconBg, boxShadow: `0 16px 48px ${current === 0 ? 'rgba(195,255,46,0.25)' : current === 1 ? 'rgba(99,102,241,0.3)' : 'rgba(249,115,22,0.3)'}` }}
                >
                  {slide.icon}
                </div>
              </motion.div>

              {/* Tag */}
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-3 text-[11px] font-black uppercase tracking-[0.3em]"
                style={{ color: current === 0 ? '#c3ff2e' : current === 1 ? '#818cf8' : '#fb923c' }}
              >
                {slide.tag}
              </motion.span>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-4 text-[36px] font-black leading-[1.1] tracking-[-0.04em] text-white"
                style={{ whiteSpace: 'pre-line' }}
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="text-[15px] leading-[1.65] text-white/55 font-medium max-w-[320px]"
              >
                {slide.subtitle}
              </motion.p>

              {/* ── Language Picker (Slide 3 only) ── */}
              {isLast && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex gap-3"
                >
                  {LANGS.map((l) => {
                    const sel = lang === l.id;
                    return (
                      <motion.button
                        key={l.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => selectLang(l.id)}
                        className="flex flex-1 flex-col items-center gap-2 rounded-[20px] border py-5 transition-all"
                        style={{
                          background: sel
                            ? 'linear-gradient(180deg, rgba(249,115,22,0.18), rgba(249,115,22,0.04))'
                            : 'rgba(255,255,255,0.03)',
                          borderColor: sel ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.06)',
                          boxShadow: sel ? '0 0 24px rgba(249,115,22,0.12)' : 'none',
                        }}
                      >
                        <motion.span
                          className="text-2xl"
                          animate={sel ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {l.flag}
                        </motion.span>
                        <span
                          className="text-[13px] font-bold"
                          style={{ color: sel ? '#fb923c' : 'rgba(255,255,255,0.6)' }}
                        >
                          {l.native}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom Button ── */}
        <div className="pb-2">
          {isLast ? (
            <AnimatePresence>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 30, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onComplete(lang)}
                  className="flex h-16 w-full items-center justify-center gap-3 rounded-full text-lg font-black"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                    color: '#ffffff',
                    boxShadow: '0 12px 40px rgba(249,115,22,0.3)',
                  }}
                >
                  <Rocket className="h-5 w-5" />
                  <span>{t.welcome_start}</span>
                </motion.button>
              )}
            </AnimatePresence>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goNext}
              className="flex h-16 w-full items-center justify-center gap-2 rounded-full text-lg font-black"
              style={{
                background: current === 0
                  ? 'linear-gradient(135deg, #c3ff2e 0%, #b2ed12 50%, #a8e600 100%)'
                  : 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
                color: current === 0 ? '#0a0d09' : '#ffffff',
                boxShadow: current === 0 ? '0 12px 40px rgba(195,255,46,0.2)' : '0 12px 40px rgba(99,102,241,0.25)',
              }}
            >
              <span>{t.welcome_next}</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}
