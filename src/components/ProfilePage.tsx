import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageCircle,
  ChevronRight,
  Crown,
  Globe,
  Headphones,
  LogOut,
  Mail,
  Moon,
  Phone,
  Settings,
  Shield,
  User,
  Zap,
  BookOpen,
  Flame,
  Check,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import SupportChat from './SupportChat';
import { getPalette } from '../theme';

export default function ProfilePage() {
  const {
    user,
    logout,
    togglePro,
    theme,
    toggleTheme,
    notificationsEnabled,
    toggleNotifications,
    updateName,
    updatePhone,
    updateEmail,
  } = useUser();
  const colors = getPalette(theme);

  const [showProModal, setShowProModal] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  useEffect(() => {
    if (showAccountSettings) {
      setEditName(user?.name || '');
      setEditPhone(user?.phone || '');
      setEditEmail(user?.email || '');
    }
  }, [showAccountSettings, user]);

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const settingsItems = [
    {
      icon: MessageCircle,
      label: 'Bildirishnomalar',
      toggle: true,
      value: notificationsEnabled,
      onClick: toggleNotifications,
    },
    {
      icon: Moon,
      label: 'Tungi rejim',
      toggle: true,
      value: theme === 'dark',
      onClick: toggleTheme,
    },
    {
      icon: Headphones,
      label: 'Yordam markazi',
      value: 'Online chat',
      onClick: () => setShowSupportChat(true),
    },
    {
      icon: Shield,
      label: 'Maxfiylik siyosati',
      value: 'Ko‘rish',
      onClick: () => window.alert('Maxfiylik siyosati alohida sahifa sifatida keyingi bosqichda ulanadi.'),
    },
  ];

  return (
    <div className="page-content min-h-full px-6 pb-8" style={{ background: colors.background }}>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 -mx-6 mb-6 flex items-center justify-between px-6 pb-4 pt-safe-top backdrop-blur-xl"
        style={{ background: theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(255,255,255,0.92)' }}
      >
        <h1 className="text-lg font-black italic tracking-[-0.04em]" style={{ color: colors.primary }}>
          Profil
        </h1>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setShowSupportChat(true)} className="active:scale-95 transition-transform">
            <MessageCircle className="h-5 w-5" style={{ color: colors.primary }} />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: colors.surfaceContainer }}>
            <span className="text-xs font-black" style={{ color: colors.onSurface }}>
              {initials}
            </span>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-5 rounded-[24px] p-6 relative overflow-hidden group shadow-lg shadow-purple-900/10 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}
      >
        <div className="absolute right-[-10%] top-[-50%] h-40 w-40 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute right-0 bottom-0 p-4 opacity-10">
          <User className="h-28 w-28 text-white" />
        </div>

        <div className="relative z-10">
          <div className="rounded-full border-2 p-1" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-black shadow-inner"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
            >
              {initials}
            </div>
          </div>
          {user?.isPro && (
            <div className="absolute -bottom-1 -right-1 rounded-full px-2 py-0.5 text-[10px] font-black shadow-md bg-yellow-400 text-yellow-950">
              PRO
            </div>
          )}
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <h2 className="truncate text-2xl font-black tracking-tight text-white leading-tight mb-1 drop-shadow-md">
            {user?.name || 'Foydalanuvchi'}
          </h2>
          <p className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-widest">
            {user?.phone || '+998'}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/20 backdrop-blur-sm shadow-sm ring-1 ring-white/30">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">
              {user?.isPro ? 'PRO faydalanuvchi' : 'Aktiv'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAccountSettings(true)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner shadow-white/20 hover:bg-white/30 transition-colors"
        >
          <Settings className="h-5 w-5 text-white" />
        </button>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <div 
          className="flex aspect-square flex-col justify-between rounded-[24px] p-5 relative overflow-hidden group shadow-lg shadow-yellow-900/10 cursor-default" 
          style={{ background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' }}
        >
          <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute right-0 bottom-0 p-2 opacity-15">
            <Zap className="h-24 w-24 text-white" />
          </div>
          <div className="relative z-10 w-12 h-12 flex justify-center items-center rounded-full bg-white/20 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]">
            <Zap className="h-6 w-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-white drop-shadow-md">
              {user?.xp || 0}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80 mt-1">
              Umumiy XP
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {[
            { label: 'Tugallangan', value: user?.completedCourses.length || 0, icon: BookOpen, bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
            { label: 'Streak', value: user?.streak || 0, icon: Flame, bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="flex items-center gap-4 rounded-[24px] p-4 relative overflow-hidden group shadow-sm cursor-default" 
                style={{ background: stat.bg }}
              >
                <div className="absolute right-[-5%] top-[-10%] h-20 w-20 rounded-full bg-white/10 blur-sm group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-15">
                  <Icon className="h-16 w-16 text-white" />
                </div>
                
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[18px] bg-black/15 shadow-inner backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="relative z-10 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                    {stat.label}
                  </p>
                  <p className="text-xl font-black text-white drop-shadow-md">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {!user?.isPro && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 overflow-hidden rounded-[24px] p-6 shadow-xl shadow-amber-900/20 group cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          onClick={() => setShowProModal(true)}
        >
          <div className="absolute right-[-10%] top-[-20%] h-48 w-48 rounded-full bg-white/20 blur-xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute right-[-5%] bottom-[-5%] p-4 opacity-20">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <Crown className="h-32 w-32 text-white drop-shadow-2xl" />
            </motion.div>
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="max-w-[65%]">
              <span className="inline-block px-2 py-0.5 rounded-full bg-white text-yellow-600 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm ring-2 ring-white/50">
                Premium
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white mb-2 leading-tight">Cheksizlikka o'tish</h3>
              <p className="text-xs font-semibold text-white/90 leading-relaxed mb-5">
                Barcha kurslar va imkoniyatlar bilan to'liq quvvatga chiqing.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white drop-shadow-md">9,999 UZS</span>
                <span className="text-xs font-black text-white/70 uppercase">/oy</span>
              </div>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.4)]">
              <ChevronRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mb-8"
      >
        <h4 className="mb-4 px-1 text-xs font-black uppercase tracking-[0.22em]" style={{ color: colors.onSurfaceVariant }}>
          Sizning Yutuqlaringiz
        </h4>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {[
            { id: 1, icon: Flame, title: "Birinchi Qadam", desc: "Dastlabki dars", done: true, color: colors.tertiary },
            { id: 2, icon: Zap, title: "Tezkor O'quvchi", desc: "1000 XP topildi", done: (user?.xp || 0) >= 1000, color: colors.primary },
            { id: 3, icon: BookOpen, title: "Kitobxon", desc: "1 ta kurs", done: (user?.completedCourses.length || 0) >= 1, color: colors.secondary },
            { id: 4, icon: Crown, title: "Chempion", desc: "Top 1 reyting", done: false, color: '#fbbf24' },
          ].map((ach) => {
            const AchIcon = ach.icon;
            return (
              <div key={ach.id} className="flex min-w-[120px] shrink-0 flex-col items-center gap-3 rounded-[24px] p-5 text-center transition-all" style={{ background: colors.surfaceContainerLow, opacity: ach.done ? 1 : 0.4 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${ach.color}22` }}>
                  <AchIcon className="h-6 w-6" style={{ color: ach.color }} />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold leading-tight" style={{ color: colors.onSurface }}>{ach.title}</h5>
                  <p className="mt-1 text-[9px] font-semibold" style={{ color: colors.onSurfaceVariant }}>{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      <section className="space-y-6">
        <h4 className="px-1 text-xs font-black uppercase tracking-[0.22em]" style={{ color: colors.onSurfaceVariant }}>
          Sozlamalar
        </h4>

        <div className="space-y-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex w-full items-center justify-between rounded-[24px] p-4 text-left"
                style={{ background: colors.surfaceContainerLow }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceBright }}>
                    <Icon className="h-5 w-5" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: colors.onSurface }}>
                    {item.label}
                  </span>
                </div>

                {'toggle' in item && item.toggle ? (
                  <div
                    className="flex h-6 w-12 items-center rounded-full px-1"
                    style={{ background: item.value ? colors.primary : colors.surfaceContainerHighest }}
                  >
                    <div
                      className="h-4 w-4 rounded-full transition-transform"
                      style={{
                        background: item.value ? colors.onPrimary : colors.outline,
                        transform: item.value ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: colors.onSurfaceVariant }}>
                      {item.value}
                    </span>
                    <ChevronRight className="h-4 w-4" style={{ color: colors.onSurfaceVariant }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-[24px] p-5 font-black transition-transform active:scale-[0.985]"
          style={{ background: 'rgba(255,115,81,0.12)', color: colors.error }}
        >
          <LogOut className="h-5 w-5" />
          Chiqish
        </button>
      </section>

      <SupportChat isOpen={showSupportChat} onClose={() => setShowSupportChat(false)} />

      <AnimatePresence>
        {showProModal && (
          <ModalBackdrop onClose={() => setShowProModal(false)} fullscreen>
            <div className="min-h-full overflow-y-auto p-6" style={{ background: colors.background, paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 24px))' }}>
              <div className="mb-5 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px]" style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)' }}>
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>

              <h2 className="mb-2 text-center text-2xl font-black tracking-[-0.05em]" style={{ color: colors.onSurface }}>
                Fynex PRO
              </h2>
              <p className="mb-6 text-center text-sm" style={{ color: colors.onSurfaceVariant }}>
                Barcha premium kurslar va qo‘shimcha imkoniyatlar ochiladi.
              </p>

              <div className="mb-6 rounded-[24px] p-5 text-center" style={{ background: colors.surfaceContainerLow }}>
                <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                  Bir oylik obuna
                </p>
                <p className="text-4xl font-black" style={{ color: colors.primary }}>
                  9,999 <span className="text-2xl">UZS</span>
                </p>
              </div>

              <div className="mb-6 space-y-3">
                {['Barcha kurslar ochiq', 'Reklamasiz tajriba', 'Priority qo‘llab-quvvatlash', 'Offline imkoniyatlar'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[20px] px-4 py-3" style={{ background: colors.surfaceContainerLow }}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${colors.primary}18` }}>
                      <Check className="h-4 w-4" style={{ color: colors.primary }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.onSurface }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  togglePro();
                  setShowProModal(false);
                }}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-[22px] py-4 text-sm font-black uppercase transition-transform active:scale-[0.985]"
                style={{ background: colors.primary, color: colors.onPrimary }}
              >
                <Crown className="h-5 w-5" />
                PRO ga o'tish
              </button>

              <button
                type="button"
                onClick={() => setShowProModal(false)}
                className="w-full rounded-[22px] py-4 text-sm font-bold"
                style={{ background: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}
              >
                Keyinroq
              </button>
            </div>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccountSettings && (
          <ModalBackdrop onClose={() => setShowAccountSettings(false)} fullscreen>
            <div className="min-h-full overflow-y-auto p-6" style={{ background: colors.background, paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 24px))' }}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: colors.surfaceContainerLow }}>
                  <User className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-[-0.04em]" style={{ color: colors.onSurface }}>
                    Akkaunt sozlamalari
                  </h2>
                  <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                    Profil ma'lumotlarini yangilang
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Field label="Ism" icon={User} primaryColor={colors.primary} textColor={colors.onSurface}>
                    <input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      className="w-full rounded-[20px] px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface, '--tw-ring-color': colors.primary } as any}
                      placeholder="Ismingiz"
                    />
                  </Field>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <Field label="Telefon" icon={Phone} primaryColor={colors.primary} textColor={colors.onSurface}>
                    <input
                      value={editPhone}
                      onChange={(event) => setEditPhone(event.target.value)}
                      className="w-full rounded-[20px] px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface, '--tw-ring-color': colors.primary } as any}
                      placeholder="+998 90 123 45 67"
                    />
                  </Field>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Field label="Email" icon={Mail} primaryColor={colors.primary} textColor={colors.onSurface}>
                    <input
                      value={editEmail}
                      onChange={(event) => setEditEmail(event.target.value)}
                      className="w-full rounded-[20px] px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface, '--tw-ring-color': colors.primary } as any}
                      placeholder="email@example.com"
                    />
                  </Field>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <Field label="Interfeys tili" icon={Globe} primaryColor={colors.primary} textColor={colors.onSurface}>
                    <div className="rounded-[20px] px-5 py-4 text-sm font-bold" style={{ background: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                      O'zbek tili
                    </div>
                  </Field>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAccountSettings(false)}
                  className="rounded-[24px] py-4 text-sm font-bold transition-transform active:scale-95"
                  style={{ background: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateName(editName.trim() || user?.name || '');
                    updatePhone(editPhone.trim() || user?.phone || '');
                    updateEmail(editEmail.trim());
                    setShowAccountSettings(false);
                  }}
                  className="rounded-[24px] py-4 text-sm font-black uppercase transition-transform active:scale-95 shadow-lg shadow-black/5"
                  style={{ background: colors.primary, color: colors.onPrimary }}
                >
                  Saqlash
                </button>
              </motion.div>
            </div>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalBackdrop({
  children,
  onClose,
  fullscreen = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  fullscreen?: boolean;
}) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm ${fullscreen ? 'flex items-stretch p-0' : 'flex items-end p-4'}`}
      onClick={onClose}
    >
      <motion.div
        initial={fullscreen ? { opacity: 0, scale: 0.985 } : { y: 48 }}
        animate={fullscreen ? { opacity: 1, scale: 1 } : { y: 0 }}
        exit={fullscreen ? { opacity: 0, scale: 0.985 } : { y: 48 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className={fullscreen ? 'h-full w-full' : 'mx-auto w-full max-w-md'}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function Field({
  label,
  icon: Icon,
  children,
  primaryColor,
  textColor,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
  primaryColor: string;
  textColor: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: primaryColor }} />
        <span className="text-sm font-semibold" style={{ color: textColor }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
