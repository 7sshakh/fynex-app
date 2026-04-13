import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { 
  Settings, Bell, Globe, LogOut, Crown, Check,
  Zap, BookOpen, Flame, ChevronRight, ArrowLeft,
  Shield, Download, Headphones, Sparkles, User, Mail, Phone, Pen, Trash2, Languages
} from 'lucide-react';
import SupportChat from './SupportChat';

export default function ProfilePage() {
  const { user, logout, togglePro, theme, toggleTheme, notificationsEnabled, toggleNotifications, offlineEnabled, toggleOffline, updateName, updatePhone, updateEmail } = useUser();
  const [showProModal, setShowProModal] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Account settings state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'edit'|'verify'>('edit');
  const [emailStep, setEmailStep] = useState<'edit'|'verify'>('edit');
  const [nameSaved, setNameSaved] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

  const openAccountSettings = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditEmail(user?.email || '');
    setPhoneStep('edit'); setEmailStep('edit');
    setPhoneCode(''); setEmailCode('');
    setNameSaved(false); setPhoneSaved(false); setEmailSaved(false);
    setShowAccountSettings(true);
  };

  const saveName = () => {
    if (editName.trim()) { updateName(editName.trim()); setNameSaved(true); setTimeout(() => setNameSaved(false), 2000); }
  };
  const sendPhoneCode = () => { setPhoneStep('verify'); };
  const verifyPhone = () => {
    if (phoneCode.length >= 4) { updatePhone(editPhone); setPhoneSaved(true); setPhoneStep('edit'); setTimeout(() => setPhoneSaved(false), 2000); }
  };
  const sendEmailCode = () => { setEmailStep('verify'); };
  const verifyEmail = () => {
    if (emailCode.length >= 4) { updateEmail(editEmail); setEmailSaved(true); setEmailStep('edit'); setTimeout(() => setEmailSaved(false), 2000); }
  };

  const settingsItems = useMemo(() => ([
    { icon: Bell, label: 'Bildirishnomalar', hasToggle: true, value: notificationsEnabled, onClick: toggleNotifications },
    { icon: Globe, label: 'Dark mode', hasToggle: true, value: theme === 'dark', onClick: toggleTheme },
    { icon: Download, label: 'Offline yuklab olish', hasToggle: true, value: offlineEnabled, onClick: toggleOffline },
    { icon: Headphones, label: 'Qo\'llab quvvatlash', value: 'Online chat', onClick: () => setShowSupportChat(true) },
    { icon: Shield, label: 'Maxfiylik siyosati', value: 'Ko\'rish', onClick: () => window.alert('Maxfiylik siyosati keyingi yangilanishda batafsil ulanadi.') },
  ]), [notificationsEnabled, offlineEnabled, theme, toggleNotifications, toggleOffline, toggleTheme]);

  const proBenefits = [
    'Barcha kurslar ochiq',
    'Reklama yo\'q',
    'VIP kurslar',
    'Priority qo\'llab quvvatlash',
    'Kelajakda offline rejim',
  ];

  useEffect(() => {
    document.body.style.overflow = showProModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showProModal]);

  return (
    <div className="page-content min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
      </motion.header>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              {user?.isPro && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                  <Crown className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Foydalanuvchi'}</h2>
              <p className="text-gray-500 text-sm">{user?.phone}</p>
              {user?.isPro ? (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-xs font-medium">
                  Bepul
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAccountSettings}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{user?.xp || 0}</p>
              <p className="text-xs text-gray-500">XP</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{user?.completedCourses.length || 0}</p>
              <p className="text-xs text-gray-500">Tugallangan</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{user?.streak || 0}</p>
              <p className="text-xs text-gray-500">Streak</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pro Upgrade Card */}
      {!user?.isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProModal(true)}
            className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-5 shadow-xl shadow-orange-200/50 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">PRO ga o'tish</p>
                  <p className="text-white text-xl font-bold">9,999 UZS/oy</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/70" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 space-y-3"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sozlamalar</h3>
        
        <div ref={settingsRef} />
        
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={item.onClick}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              
              {item.hasToggle ? (
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${item.value ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  <motion.div
                    animate={{ x: item.value ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{item.value}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Chiqish
        </motion.button>
      </motion.div>

      {/* Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-6 pb-safe overflow-y-auto max-h-[85vh]" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 2.5rem))' }}>
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200"
                  >
                    <Crown className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Fynex PRO</h2>
                  <p className="text-gray-500">Barcha imkoniyatlarni oching</p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-5 mb-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-white/80 text-sm mb-1">Bir oylik obuna</p>
                  <p className="text-white text-4xl font-bold">9,999 <span className="text-2xl">UZS</span></p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-gray-900">PRO afzalliklari:</h3>
                  {proBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      togglePro();
                      setShowProModal(false);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                  >
                    <Sparkles className="w-5 h-5" />
                    PRO ga o'tish
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProModal(false)}
                    className="w-full bg-gray-100 text-gray-600 font-medium py-4 rounded-2xl"
                  >
                    Keyinroq
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SupportChat isOpen={showSupportChat} onClose={() => setShowSupportChat(false)} />

      {/* Account Settings Fullscreen */}
      {showAccountSettings && createPortal(
        <div className={theme === 'dark' ? 'theme-dark' : ''} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
          {/* Background */}
          <div className={`absolute inset-0 ${theme === 'dark' ? 'theme-surface-dark' : 'theme-surface-light'}`} />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${theme === 'dark' ? 'bg-lime-300/5' : 'bg-indigo-200/30'}`} />
          </div>

          {/* Header */}
          <div className="relative px-4 pb-3" style={{ paddingTop: 48, flexShrink: 0 }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAccountSettings(false)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">Akkaunt sozlamalari</h1>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ overscrollBehavior: 'contain' }}>
            {/* Profile Avatar + Name Preview */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg shadow-indigo-200/50">
                <User className="w-9 h-9 text-white" />
              </div>
              <p className="font-bold text-gray-900 text-lg">{user?.name || 'Foydalanuvchi'}</p>
              <p className="text-gray-400 text-sm">{user?.phone}</p>
            </div>

            {/* Name */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Pen className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Ismni o'zgartirish</span>
                {nameSaved && <span className="text-xs text-emerald-500 font-medium ml-auto">✓ Saqlandi</span>}
              </div>
              <div className="flex gap-2">
                <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:border-indigo-300" placeholder="Ismingiz" />
                <button onClick={saveName} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white active:scale-95 shadow-sm shadow-indigo-200">Saqlash</button>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Telefon raqam</span>
                {phoneSaved && <span className="text-xs text-emerald-500 font-medium ml-auto">✓ O'zgartirildi</span>}
              </div>
              {phoneStep === 'edit' ? (
                <div className="flex gap-2">
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:border-emerald-300" placeholder="+998 XX XXX XX XX" />
                  <button onClick={sendPhoneCode} disabled={editPhone === user?.phone} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white active:scale-95 disabled:opacity-40 shadow-sm shadow-emerald-200">Kod yuborish</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={phoneCode} onChange={e => setPhoneCode(e.target.value)} maxLength={6} className="flex-1 rounded-xl px-3 py-2.5 text-sm text-center tracking-[0.5em] bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:border-emerald-300" placeholder="● ● ● ●" />
                  <button onClick={verifyPhone} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white active:scale-95 shadow-sm shadow-emerald-200">Tasdiqlash</button>
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-2">SMS kod orqali tasdiqlanadi</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Elektron pochta</span>
                {emailSaved && <span className="text-xs text-emerald-500 font-medium ml-auto">✓ Qo'shildi</span>}
              </div>
              {emailStep === 'edit' ? (
                <div className="flex gap-2">
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:border-blue-300" placeholder="email@example.com" />
                  <button onClick={sendEmailCode} disabled={!editEmail.includes('@')} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white active:scale-95 disabled:opacity-40 shadow-sm shadow-blue-200">Kod yuborish</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={emailCode} onChange={e => setEmailCode(e.target.value)} maxLength={6} className="flex-1 rounded-xl px-3 py-2.5 text-sm text-center tracking-[0.5em] bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:border-blue-300" placeholder="● ● ● ●" />
                  <button onClick={verifyEmail} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white active:scale-95 shadow-sm shadow-blue-200">Tasdiqlash</button>
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-2">Emailga tasdiqlash kodi yuboriladi</p>
            </div>

            {/* Extra settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 active:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Languages className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Interfeys tili</p>
                    <p className="text-xs text-gray-400">O'zbek tili</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
              <div className="h-px bg-gray-100 mx-4" />
              <button className="w-full flex items-center justify-between p-4 active:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Maxfiylik siyosati</p>
                    <p className="text-xs text-gray-400">Shaxsiy ma'lumotlar himoyasi</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Delete Account */}
            <button className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 bg-red-50 border border-red-100 active:scale-[0.98]" onClick={() => { if (window.confirm('Akkauntni o\'chirmoqchimisiz?')) { logout(); setShowAccountSettings(false); } }}>
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">Akkauntni o'chirish</span>
            </button>

            <div className="h-10" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
