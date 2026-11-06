import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  MessageSquare,
  Clock,
  Sparkles,
  User,
  CheckCheck,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { getChatMessages, sendChatMessage } from '../services/fmeService';
import { WHATSAPP_NUMBER } from '../data/plans';
import { useToast } from './Toast';

interface PrivateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  adminUser?: UserProfile;
}

export const PrivateChatModal: React.FC<PrivateChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentUser.userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const list = await getChatMessages(currentUser.userId);
    setMessages(list);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    setSending(true);
    setInputMessage('');

    try {
      const sent = await sendChatMessage({
        fromUserId: currentUser.userId,
        toUserId: 'FME_ADMIN',
        senderName: currentUser.name,
        senderRole: 'user',
        message: text,
      });

      setMessages((prev) => [...prev, sent]);

      // Automated helpful instant response simulation from Admin bot / assistant if first message
      setTimeout(async () => {
        if (text.includes('एक्टिवेट') || text.includes('कमीशन') || text.includes('विड्रॉल')) {
          const autoReply = await sendChatMessage({
            fromUserId: 'FME_ADMIN',
            toUserId: currentUser.userId,
            senderName: 'विकास कुमार (सुपर एडमिन)',
            senderRole: 'admin',
            message: `नमस्ते ${currentUser.name}! आपका संदेश प्राप्त हुआ। एडमिन विकास कुमार जल्द ही समीक्षा करके समाधान करेंगे। यदि आवश्यक हो तो आप WhatsApp पर भी स्क्रीनशॉट भेज सकते हैं।`,
          });
          setMessages((prev) => [...prev, autoReply]);
        }
      }, 1500);
    } catch (err) {
      showToast('त्रुटि', 'संदेश भेजने में समस्या आई।', 'error');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = [
    'प्लान एक्टिवेट कब होगा?',
    'डायरेक्ट रेफरल पेआउट कैसे मिलता है?',
    'UPI विड्रॉल कब तक आएगा?',
    'डिजिटल ID कार्ड कैसे डाउनलोड करें?',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[650px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Admin Profile & Live Guide Badge */}
        <div className="px-5 py-4 bg-[#2874f0] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#2874f0] flex items-center justify-center font-black shadow-md">
                VK
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#2874f0] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-tight">विकास कुमार (सुपर एडमिन)</h3>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-300 text-slate-950">
                  व्यक्तिगत गाइड
                </span>
              </div>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <span>1-on-1 प्राइवेट गाइडेंस & सपोर्ट चैट</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50 dark:bg-slate-950/60 text-xs">
          {/* Welcome Notice Bubble */}
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-center space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-900 dark:text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>सुरक्षित & प्राइवेट 1-ऑन-1 पर्सनल गाइड</span>
            </span>
            <p className="text-[10px] text-slate-500">
              यहाँ आपकी और एडमिन की सीधी बातचीत होती है। किसी अन्य यूज़र को यह चैट नहीं दिखेगी।
            </p>
          </div>

          {messages.map((m) => {
            const isMe = m.fromUserId === currentUser.userId;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className="text-[10px] text-slate-400 px-1 font-semibold">
                  {isMe ? 'आप' : m.senderName}
                </span>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                    isMe
                      ? 'bg-[#2874f0] text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  {m.message}
                </div>
                <span className="text-[9px] text-slate-400 px-1">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="एडमिन को कोई भी प्रश्न या समस्या लिखें..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="p-2.5 rounded-xl bg-[#2874f0] hover:bg-blue-600 active:scale-95 text-white cursor-pointer transition-all disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
