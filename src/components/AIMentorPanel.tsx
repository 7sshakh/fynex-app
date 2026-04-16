import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Brain, Send, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getPalette } from '../theme';

type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

const QUICK_PROMPTS = [
  "Present Perfect ni oddiy tilda tushuntir",
  "Speaking uchun 5 ta kuchli ibora ber",
  "Bugun 10 daqiqalik English plan tuz",
];

const E18_BLOCK = /\b(sex|porn|xxx|nude|erotik|эрот|18\+|onlyfans|intim)\b/i;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIMentorPanel({ isOpen, onClose }: Props) {
  const { user } = useUser();
  const { theme } = useUser();
  const colors = getPalette(theme);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const storageKey = useMemo(() => {
    const uid = user?.id || 'guest';
    return `fynex_ai_mentor_${uid}`;
  }, [user?.id]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setMessages([
          {
            id: 'intro',
            role: 'assistant',
            text: "Salom! Men Fynex AI Mentor. Siz tanlagan yo'nalishda aniq va qisqa yordam beraman.",
            ts: Date.now(),
          },
        ]);
        return;
      }
      const parsed = JSON.parse(raw) as AiMessage[];
      setMessages(parsed.length ? parsed : []);
    } catch {
      setMessages([]);
    }
  }, [isOpen, storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [isOpen, messages, storageKey]);

  const sendMessage = async (textRaw?: string) => {
    const text = (textRaw ?? input).trim();
    if (!text || sending) return;

    if (E18_BLOCK.test(text)) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: "Bu mavzuda yordam bera olmayman. Ta'lim va dars bo'yicha savol bering, mamnuniyat bilan yordam beraman.", ts: Date.now() },
      ]);
      if (!textRaw) setInput('');
      return;
    }

    const userMessage: AiMessage = { id: crypto.randomUUID(), role: 'user', text, ts: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    if (!textRaw) setInput('');

    const combinedPrompt = `[Fan: Learning]\n[Uslub: aniq, foydali, qisqa]\n${text}`;

    try {
      const response = await fetch('/api/mentor/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: user?.name || 'User',
          user_phone: user?.phone || '',
          user_telegram_id: user?.telegramId ?? null,
          message: combinedPrompt,
          history: messages.slice(-10).map((m) => ({ text: m.text, isBot: m.role === 'assistant' })),
        }),
      });
      const data = await response.json();
      const answer = typeof data?.ai_response === 'string' && data.ai_response.trim()
        ? data.ai_response.trim()
        : "Savolni qabul qildim. Shu fan bo'yicha yana aniqroq savol bersangiz, yanada foydali javob beraman.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: answer, ts: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: "Hozir aloqa sekin. Shu savolni qayta yuboring, darhol davom etamiz.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex flex-col"
        style={{ background: colors.background }}
      >
        <div
          className="px-4 pb-3"
          style={{
            paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 16px))',
            background: theme === 'dark' ? 'rgba(14,14,14,0.92)' : 'rgba(255,255,255,0.95)',
            borderBottom: `1px solid ${colors.outlineVariant}33`,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="mb-3 flex items-center gap-3">
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceContainer }}>
              <ArrowLeft className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}22` }}>
                <Brain className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black" style={{ color: colors.onSurface }}>
                  AI Mentor
                </h3>
                <p className="truncate text-xs" style={{ color: colors.onSurfaceVariant }}>
                  Faqat dars va o'qish bo'yicha aniq yordam
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4" style={{ overscrollBehavior: 'contain' }}>
          <div className="space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-3 text-sm"
                  style={
                    message.role === 'user'
                      ? { background: colors.primary, color: colors.onPrimary, borderTopRightRadius: '8px' }
                      : { background: colors.surfaceContainer, color: colors.onSurface, borderTopLeftRadius: '8px' }
                  }
                >
                  {message.text}
                </div>
              </motion.div>
            ))}

            {sending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-2xl px-4 py-3 w-fit" style={{ background: colors.surfaceContainer }}>
                <Sparkles className="h-4 w-4" style={{ color: colors.primary }} />
                <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>AI javob yozmoqda...</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="px-4 pb-safe py-3" style={{ background: theme === 'dark' ? 'rgba(14,14,14,0.94)' : 'rgba(255,255,255,0.96)', borderTop: `1px solid ${colors.outlineVariant}33` }}>
          <div className="mb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                style={{ background: colors.surfaceContainer, color: colors.onSurfaceVariant }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Dars bo'yicha savolingizni yozing..."
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
              style={{ background: colors.surfaceContainer, color: colors.onSurface, border: `1px solid ${colors.outlineVariant}33` }}
            />
            <button
              disabled={!input.trim() || sending}
              onClick={() => sendMessage()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl disabled:opacity-50"
              style={{ background: colors.primary, color: colors.onPrimary }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
