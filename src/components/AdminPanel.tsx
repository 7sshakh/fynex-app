import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Crown, Shield, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getPalette } from '../theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminOverview {
  stats: {
    total_users: number;
    issued_certificates: number;
    active_sessions: number;
  };
  settings: Record<string, unknown>;
  bots: Array<Record<string, unknown>>;
}

export default function AdminPanel({ isOpen, onClose }: Props) {
  const { user, theme } = useUser();
  const colors = getPalette(theme);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [priceBasic, setPriceBasic] = useState('19999');
  const [pricePro, setPricePro] = useState('69000');
  const [subEnabled, setSubEnabled] = useState(true);
  const [botName, setBotName] = useState('Anvar S.');

  const adminId = user?.telegramId || 0;

  useEffect(() => {
    if (!isOpen || !adminId) return;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/overview?user_id=${adminId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!data?.ok) return;
        const info = data as { ok: boolean } & AdminOverview;
        setOverview({
          stats: info.stats,
          settings: info.settings || {},
          bots: info.bots || [],
        });
        const settings = info.settings || {};
        if (typeof settings.subscription_enabled === 'boolean') setSubEnabled(settings.subscription_enabled);
        if (typeof settings.price_basic === 'number' || typeof settings.price_basic === 'string') setPriceBasic(String(settings.price_basic));
        if (typeof settings.price_pro === 'number' || typeof settings.price_pro === 'string') setPricePro(String(settings.price_pro));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, adminId]);

  const stats = useMemo(
    () => [
      { label: 'Foydalanuvchilar', value: overview?.stats.total_users ?? 0 },
      { label: 'Sertifikatlar', value: overview?.stats.issued_certificates ?? 0 },
      { label: 'Faol sessiyalar', value: overview?.stats.active_sessions ?? 0 },
    ],
    [overview],
  );

  const saveSettings = async () => {
    if (!adminId) return;
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: adminId,
          settings: {
            subscription_enabled: subEnabled,
            price_basic: Number(priceBasic) || 19999,
            price_pro: Number(pricePro) || 69000,
          },
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  const addBot = async () => {
    if (!adminId || !botName.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/admin/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: adminId,
          display_name: botName.trim(),
          district: 'Yunusobod',
          region: 'Toshkent',
          country: 'Uzbekistan',
          is_verified: true,
          base_score: 28,
          growth_rate: 0.8,
          activity_days: 30,
        }),
      });
      const response = await fetch(`/api/admin/overview?user_id=${adminId}`);
      const data = await response.json();
      if (data?.ok) {
        setOverview({
          stats: data.stats,
          settings: data.settings || {},
          bots: data.bots || [],
        });
      }
      setBotName('');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10040] bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="h-full overflow-y-auto"
          style={{ background: colors.background, paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 16px))' }}
        >
          <div className="px-6 pb-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${colors.primary}22` }}>
                  <Shield className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2 className="text-lg font-black" style={{ color: colors.onSurface }}>Admin Panel</h2>
                  <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Fynex boshqaruv markazi</p>
                </div>
              </div>
              <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceContainer }}>
                <X className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
              </button>
            </div>

            {loading ? (
              <div className="rounded-2xl p-4 text-sm" style={{ background: colors.surfaceContainer, color: colors.onSurfaceVariant }}>
                Ma'lumotlar yuklanmoqda...
              </div>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-2xl p-3 text-center" style={{ background: colors.surfaceContainer }}>
                      <p className="text-lg font-black" style={{ color: colors.onSurface }}>{item.value}</p>
                      <p className="text-[10px] font-bold uppercase" style={{ color: colors.onSurfaceVariant }}>{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6 rounded-2xl p-4" style={{ background: colors.surfaceContainer }}>
                  <div className="mb-3 flex items-center gap-2">
                    <Crown className="h-4 w-4" style={{ color: colors.primary }} />
                    <h3 className="text-sm font-black" style={{ color: colors.onSurface }}>Obuna sozlamalari</h3>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>Subscription mode</span>
                    <button
                      onClick={() => setSubEnabled((value) => !value)}
                      className="rounded-full px-3 py-1 text-xs font-black"
                      style={{ background: subEnabled ? colors.primary : colors.surfaceContainerHigh, color: subEnabled ? colors.onPrimary : colors.onSurfaceVariant }}
                    >
                      {subEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={priceBasic}
                      onChange={(event) => setPriceBasic(event.target.value.replace(/\D/g, ''))}
                      className="rounded-xl px-3 py-2 text-sm"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                      placeholder="Basic price"
                    />
                    <input
                      value={pricePro}
                      onChange={(event) => setPricePro(event.target.value.replace(/\D/g, ''))}
                      className="rounded-xl px-3 py-2 text-sm"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                      placeholder="Pro price"
                    />
                  </div>
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="mt-3 w-full rounded-xl py-2 text-sm font-black"
                    style={{ background: colors.primary, color: colors.onPrimary }}
                  >
                    Sozlamalarni saqlash
                  </button>
                </div>

                <div className="rounded-2xl p-4" style={{ background: colors.surfaceContainer }}>
                  <div className="mb-3 flex items-center gap-2">
                    <Bot className="h-4 w-4" style={{ color: colors.primary }} />
                    <h3 className="text-sm font-black" style={{ color: colors.onSurface }}>Leaderboard botlari</h3>
                  </div>
                  <div className="mb-3 flex gap-2">
                    <input
                      value={botName}
                      onChange={(event) => setBotName(event.target.value)}
                      className="flex-1 rounded-xl px-3 py-2 text-sm"
                      style={{ background: colors.surfaceContainerLow, color: colors.onSurface }}
                      placeholder="Bot ismi"
                    />
                    <button
                      onClick={addBot}
                      disabled={saving}
                      className="rounded-xl px-3 py-2 text-xs font-black"
                      style={{ background: colors.primary, color: colors.onPrimary }}
                    >
                      Qo'shish
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(overview?.bots || []).slice(0, 8).map((item, idx) => (
                      <div key={`${item.id || idx}`} className="rounded-xl px-3 py-2 text-sm" style={{ background: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                        {String(item.display_name || 'Bot')} • {String(item.country || '')}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
