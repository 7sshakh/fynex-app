import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  time: string;
  isSupport?: boolean;
}

function getTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'fynex_chat_messages';
const getWelcomeMsg = (t: any) => ({ id: '1', text: t.support_intro, isBot: true, time: getTime() });

function loadMessages(t: any): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { const arr = JSON.parse(saved); if (arr.length) return arr; }
  } catch { /* ignore */ }
  return [getWelcomeMsg(t)];
}

const darkTheme = {
  bg: '#0a0d09', headerBg: 'rgba(15,18,16,0.95)', headerBorder: 'rgba(195,255,46,0.1)',
  accent: '#c3ff2e', accentGrad: 'linear-gradient(135deg,#c3ff2e,#9fdc16)',
  text: '#f0f0f0', subtext: '#c3ff2e', backBg: 'rgba(195,255,46,0.08)', backColor: '#c3ff2e',
  iconBg: 'linear-gradient(135deg,#c3ff2e,#9fdc16)', iconColor: '#0a0d09',
  msgBg: '#0a0d09', botBubble: '#1a1f1a', botText: '#e8f5e9', botTime: '#6b7280',
  userBubble: 'linear-gradient(135deg,#c3ff2e,#9fdc16)', userText: '#0a0d09', userTime: 'rgba(10,13,9,0.5)',
  inputBg: '#1a1f1a', inputText: '#e8f5e9', inputBorder: 'rgba(195,255,46,0.1)',
  sendActive: 'linear-gradient(135deg,#c3ff2e,#9fdc16)', sendActiveColor: '#0a0d09',
  sendInactive: '#1a1f1a', sendInactiveColor: '#4b5563',
  tgBg: 'rgba(59,130,246,0.12)', tgColor: '#60a5fa',
};
const lightTheme = {
  bg: '#ffffff', headerBg: '#ffffff', headerBorder: '#e0e0e0',
  accent: '#D62828', accentGrad: 'linear-gradient(135deg,#D62828,#B71C1C)',
  text: '#1a1a1a', subtext: '#D62828', backBg: '#f5f5f5', backColor: '#616161',
  iconBg: 'linear-gradient(135deg,#D62828,#B71C1C)', iconColor: '#ffffff',
  msgBg: '#fafafa', botBubble: '#f5f5f5', botText: '#1a1a1a', botTime: '#9e9e9e',
  userBubble: 'linear-gradient(135deg,#D62828,#B71C1C)', userText: '#ffffff', userTime: 'rgba(255,255,255,0.6)',
  inputBg: '#f5f5f5', inputText: '#1a1a1a', inputBorder: '#e0e0e0',
  sendActive: 'linear-gradient(135deg,#D62828,#B71C1C)', sendActiveColor: '#ffffff',
  sendInactive: '#f5f5f5', sendInactiveColor: '#9e9e9e',
  tgBg: 'rgba(214,40,40,0.08)', tgColor: '#D62828',
};

export default function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const { user, theme, t: T, lang } = useUser();
  const t = theme === 'dark' ? darkTheme : lightTheme;
  const [messages, setMessages] = useState<Message[]>(() => loadMessages(T));
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    setMessages((prev) => {
      if (prev.length === 0) return [getWelcomeMsg(T)];
      if (prev.length === 1 && prev[0]?.id === '1') return [getWelcomeMsg(T)];
      return prev;
    });
  }, [T, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${vv.height}px`;
        containerRef.current.style.top = `${vv.offsetTop}px`;
      }
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    onResize();
    return () => { vv.removeEventListener('resize', onResize); vv.removeEventListener('scroll', onResize); };
  }, [isOpen]);

  const pollReplies = useCallback(async () => {
    if (!user?.phone) return;
    try {
      const res = await fetch(`/api/chat/poll?phone=${encodeURIComponent(user.phone)}`);
      const data = await res.json();
      if (data.ok && data.replies && data.replies.length > 0) {
        const newMsgs: Message[] = data.replies.map((r: { text: string }, i: number) => ({
          id: `reply-${Date.now()}-${i}`, text: r.text, isBot: true, time: getTime(), isSupport: true,
        }));
        setMessages(prev => [...prev, ...newMsgs]);
      }
    } catch { /* ignore */ }
  }, [user?.phone]);

  useEffect(() => {
    if (isOpen) { pollRef.current = setInterval(pollReplies, 3000); }
    else { if (pollRef.current) clearInterval(pollRef.current); }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [isOpen, pollReplies]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: Message = { id: Date.now().toString(), text, isBot: false, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const typingMsg: Message = { id: `typing-${Date.now()}`, text: T.support_typing, isBot: true, time: getTime() };
    setMessages(prev => [...prev, typingMsg]);

    try {
      const res = await fetch('/api/chat/ai-respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: user?.name || 'Noma\'lum',
          user_phone: user?.phone || '',
          user_telegram_id: user?.telegramId ?? null,
          message: `[Language: ${lang}] ${text}`,
          history: messages.filter(m => m.id !== '1').slice(-10).map(m => ({ text: m.text, isBot: m.isBot })),
        }),
      });
      const data = await res.json();

      setMessages(prev => prev.filter(m => m.id !== typingMsg.id));

      if (data.ok && data.ai_response) {
        setMessages(prev => [...prev, { id: `ai-${Date.now()}`, text: data.ai_response, isBot: true, time: getTime() }]);
      } else {
        setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: T.support_error, isBot: true, time: getTime() }]);
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== typingMsg.id));
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: T.support_no_internet, isBot: true, time: getTime() }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: t.bg, height: '100dvh' }}
    >
      {/* Header */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, flexShrink: 0, paddingTop: '48px', backdropFilter: 'blur(12px)' }} className="flex items-center gap-3 px-4 pb-3">
        <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95" style={{ backgroundColor: t.backBg }}>
          <ArrowLeft className="w-5 h-5" style={{ color: t.backColor }} />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.iconBg }}>
          <MessageCircle className="w-5 h-5" style={{ color: t.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm" style={{ color: t.text }}>{T.support_title}</h3>
          <p className="text-xs font-medium" style={{ color: t.subtext }}>{T.support_online}</p>
        </div>
        <button onClick={() => window.open('https://t.me/fynex-_assist', '_blank')} className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-95" style={{ backgroundColor: t.tgBg }}>
          <svg className="w-5 h-5" style={{ color: t.tgColor }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: t.msgBg, overscrollBehavior: 'contain' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
            {msg.isSupport && <span className="text-[10px] font-bold uppercase tracking-wider mb-1 ml-1" style={{ color: t.accent }}>{T.support_title}</span>}
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl"
              style={msg.isBot
                ? { backgroundColor: t.botBubble, color: t.botText, borderTopLeftRadius: '6px', boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }
                : { background: t.userBubble, color: t.userText, borderTopRightRadius: '6px' }
              }
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-[10px] mt-1" style={{ color: msg.isBot ? t.botTime : t.userTime }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 pb-safe" style={{ background: t.headerBg, borderTop: `1px solid ${t.headerBorder}` }}>
        <div className="flex items-center gap-2">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={T.support_placeholder}
            className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: t.inputBg, color: t.inputText, border: `1px solid ${t.inputBorder}` }}
          />
          <button
            onClick={sendMessage} disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: input.trim() && !sending ? t.sendActive : t.sendInactive, color: input.trim() && !sending ? t.sendActiveColor : t.sendInactiveColor }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
