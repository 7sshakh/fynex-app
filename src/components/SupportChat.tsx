import { useState, useRef, useEffect, useCallback } from 'react';
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
      document.body.style.overflow = 'hidden';
      pollRef.current = setInterval(pollReplies, 3000);
    } else {
      document.body.style.overflow = '';
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      document.body.style.overflow = '';
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

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ height: '100dvh' }}>
      {/* Header — safe area top */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-12 pb-3 border-b border-gray-100 bg-white">
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm">Fynex Support</h3>
          <p className="text-xs text-emerald-500 font-medium">Online</p>
        </div>
        <button onClick={() => window.open('https://t.me/fynex_assist', '_blank')} className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center active:scale-95 transition-transform">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
      </div>

      {/* Messages — scrollable middle */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" style={{ overscrollBehavior: 'contain' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.isBot ? 'bg-white text-gray-900 rounded-tl-md shadow-sm' : 'bg-indigo-600 text-white rounded-tr-md'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.isBot ? 'text-gray-400' : 'text-white/60'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — pinned at bottom */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white pb-safe">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Xabar yozing..." className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-200" />
          <button onClick={sendMessage} disabled={!input.trim() || sending} className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${input.trim() && !sending ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
