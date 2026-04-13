import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  time: string;
}

function getTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Salom! Fynex qo'llab-quvvatlash xizmatiga xush kelibsiz. Xabaringizni yozing, admin tez orada javob beradi.", isBot: true, time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const pollReplies = useCallback(async () => {
    if (!user?.phone) return;
    try {
      const res = await fetch(`/api/chat/poll?phone=${encodeURIComponent(user.phone)}`);
      const data = await res.json();
      if (data.ok && data.replies && data.replies.length > 0) {
        const newMsgs: Message[] = data.replies.map((r: { text: string }, i: number) => ({
          id: `reply-${Date.now()}-${i}`,
          text: r.text,
          isBot: true,
          time: getTime(),
        }));
        setMessages(prev => [...prev, ...newMsgs]);
      }
    } catch { /* ignore */ }
  }, [user?.phone]);

  useEffect(() => {
    if (isOpen) {
      pollRef.current = setInterval(pollReplies, 3000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, pollReplies]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: Message = { id: Date.now().toString(), text, isBot: false, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: user?.name || 'Noma\'lum', user_phone: user?.phone || '', message: text }),
      });
      const data = await res.json();
      if (!data.ok) {
        setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: "Xabar yuborilmadi. Qayta urinib ko'ring.", isBot: true, time: getTime() }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: "Internet aloqasi yo'q.", isBot: true, time: getTime() }]);
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        height: '100dvh',
      }}
    >
      {/* Header */}
      <div
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6', flexShrink: 0, paddingTop: '48px' }}
        className="flex items-center gap-3 px-4 pb-3"
      >
        <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95" style={{ backgroundColor: '#f3f4f6' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: '#4b5563' }} />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm" style={{ color: '#111827' }}>Fynex Support</h3>
          <p className="text-xs font-medium" style={{ color: '#10b981' }}>Online</p>
        </div>
        <button onClick={() => window.open('https://t.me/fynex_assist', '_blank')} className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-95" style={{ backgroundColor: '#eff6ff' }}>
          <svg className="w-5 h-5" style={{ color: '#3b82f6' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3"
        style={{ backgroundColor: '#f9fafb', overscrollBehavior: 'contain' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl"
              style={msg.isBot
                ? { backgroundColor: '#ffffff', color: '#111827', borderTopLeftRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                : { backgroundColor: '#4f46e5', color: '#ffffff', borderTopRightRadius: '6px' }
              }
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-[10px] mt-1" style={{ color: msg.isBot ? '#9ca3af' : 'rgba(255,255,255,0.6)' }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 pb-safe" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Xabar yozing..."
            className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: '#f3f4f6', color: '#111827' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: input.trim() && !sending ? '#4f46e5' : '#f3f4f6', color: input.trim() && !sending ? '#ffffff' : '#9ca3af' }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
