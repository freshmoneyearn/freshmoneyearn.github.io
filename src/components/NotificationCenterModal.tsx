import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Check,
  Calendar,
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';
import { getNotifications } from '../services/fmeService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifs();
    }
  }, [isOpen, currentUser?.userId]);

  const loadNotifs = async () => {
    setLoading(true);
    const list = await getNotifications(currentUser?.userId);
    setNotifications(list);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#2874f0] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">नोटिफिकेशन सेंटर (Notifications)</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-300 text-slate-950">
                  लाइव अपडेट्स
                </span>
              </div>
              <p className="text-xs text-blue-100">
                एडमिन ब्रॉडकास्ट, पेआउट व अकाउंट संबंधित संदेश
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

        {/* Notifications List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-slate-900 dark:text-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">नोटिफिकेशन लोड हो रहे हैं...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <div>अभी कोई नया नोटिफिकेशन नहीं है।</div>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.type === 'broadcast' ? (
                      <span className="p-1.5 rounded-lg bg-blue-100 text-[#2874f0] dark:bg-blue-950 dark:text-blue-300 shrink-0">
                        <Megaphone className="w-4 h-4" />
                      </span>
                    ) : n.type === 'payout' ? (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </span>
                    )}

                    <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {n.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 shrink-0">
          सभी अपडेट्स एडमिन विकास कुमार द्वारा सत्यापित व प्रसारित किए जाते हैं।
        </div>
      </div>
    </div>
  );
};
