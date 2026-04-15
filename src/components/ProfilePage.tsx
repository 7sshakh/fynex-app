import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
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

  const stats = [
    { label: 'XP', value: user?.xp || 0, icon: Zap, accent: colors.primary },
    { label: 'Tugallangan', value: user?.completedCourses.length || 0, icon: BookOpen, accent: colors.secondary },
    { label: 'Streak', value: user?.streak || 0, icon: Flame, accent: colors.tertiary },
  ];

  const settingsItems = [
    {
      icon: Bell,
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
          <Bell className="h-5 w-5" style={{ color: colors.primary }} />
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
        className="mb-6 flex items-center gap-5 rounded-[28px] p-6"
        style={{ background: colors.surfaceContainer }}
      >
        <div className="relative">
          <div className="rounded-full border-4 p-1" style={{ borderColor: `${colors.primary}22` }}>
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-black"
              style={{ background: colors.surfaceContainerHighest, color: colors.primary }}
            >
              {initials}
            </div>
          </div>
          {user?.isPro && (
            <div className="absolute -bottom-1 -right-1 rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: colors.primary, color: colors.onPrimary }}>
              PRO
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-extrabold tracking-[-0.04em]" style={{ color: colors.onSurface }}>
            {user?.name || 'Foydalanuvchi'}
          </h2>
          <p className="text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>
            {user?.phone || '+998'}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: colors.surfaceContainerHigh }}>
            <span className="h-2 w-2 rounded-full" style={{ background: colors.primary }} />
            <span className="text-[11px] font-bold" style={{ color: colors.primary }}>
              {user?.isPro ? 'PRO foydalanuvchi' : 'Aktiv'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAccountSettings(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: colors.surfaceContainerHigh }}
        >
          <Settings className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
        </button>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <div className="flex h-32 flex-col justify-between rounded-[28px] p-5" style={{ background: colors.surfaceContainerLow }}>
          <Zap className="h-8 w-8" style={{ color: colors.primary }} />
          <div>
            <div className="text-2xl font-black tracking-[-0.05em]" style={{ color: colors.onSurface }}>
              {user?.xp || 0}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: colors.onSurfaceVariant }}>
              Umumiy XP
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {stats.slice(1).map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3 rounded-[24px] p-4" style={{ background: colors.surfaceContainerLow }}>
                <Icon className="h-5 w-5" style={{ color: stat.accent }} />
                <div>
                  <div className="text-lg font-black leading-none" style={{ color: colors.onSurface }}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold" style={{ color: colors.onSurfaceVariant }}>
                    {stat.label}
                  </div>
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
          className="relative mb-8 overflow-hidden rounded-[28px] p-6"
          style={{ background: 'linear-gradient(135deg,#ff734a,#b92902)' }}
        >
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black italic tracking-[-0.05em] text-white">PRO ga o'tish</h3>
              <p className="mt-1 max-w-[220px] text-xs font-semibold text-white/80">
                Barcha kurslar va qo'shimcha imkoniyatlar siz uchun ochiladi.
              </p>
              <div className="mt-4">
                <span className="text-xl font-black text-white">9,999 UZS</span>
                <span className="text-xs font-bold text-white/70"> /oy</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProModal(true)}
              className="rounded-full bg-white px-5 py-2 text-sm font-black transition-transform active:scale-95"
              style={{ color: colors.tertiary }}
            >
              Obuna bo'lish
            </button>
          </div>
        </motion.section>
      )}

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
                <Field label="Ism" icon={User} primaryColor={colors.primary} textColor={colors.onSurface}>
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                    style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                    placeholder="Ismingiz"
                  />
                </Field>

                <Field label="Telefon" icon={Phone} primaryColor={colors.primary} textColor={colors.onSurface}>
                  <input
                    value={editPhone}
                    onChange={(event) => setEditPhone(event.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                    style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                    placeholder="+998 90 123 45 67"
                  />
                </Field>

                <Field label="Email" icon={Mail} primaryColor={colors.primary} textColor={colors.onSurface}>
                  <input
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                    style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                    placeholder="email@example.com"
                  />
                </Field>

                <Field label="Interfeys tili" icon={Globe} primaryColor={colors.primary} textColor={colors.onSurface}>
                  <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                    O'zbek tili
                  </div>
                </Field>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAccountSettings(false)}
                  className="rounded-[22px] py-3 text-sm font-bold"
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
                  className="rounded-[22px] py-3 text-sm font-black uppercase"
                  style={{ background: colors.primary, color: colors.onPrimary }}
                >
                  Saqlash
                </button>
              </div>
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
