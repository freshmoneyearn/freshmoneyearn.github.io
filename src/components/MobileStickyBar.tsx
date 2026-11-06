import React from 'react';
import { MessageCircle, Sparkles, Mail } from 'lucide-react';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/plans';
import { PlanType } from '../types';

interface MobileStickyBarProps {
  onOpenJoin: (planId?: PlanType) => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenJoin }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('नमस्ते FRESH MONEY EARN, मैं ऑनलाइन 3 LEVEL कमाई सर्विस शुरू करना चाहता हूँ।')}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 px-4 shadow-lg flex items-center gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp चैट"
        className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label="ईमेल भेजें"
        className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
      >
        <Mail className="w-5 h-5" />
      </a>

      <button
        type="button"
        onClick={() => onOpenJoin('500')}
        className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>अभी शुरू करें (₹100 से)</span>
      </button>
    </div>
  );
};
