import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Crown,
  Award,
  Share2,
  Copy,
  LayoutDashboard,
  CheckCheck,
} from 'lucide-react';
import { PlanType, UserProfile } from '../types';
import { PLANS, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';
import { useToast } from './Toast';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  planId: PlanType;
  method?: 'upi' | 'stripe' | 'qr';
  utrNumber?: string;
  onGoToDashboard: () => void;
  onViewDigitalCard: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  user,
  planId,
  method = 'upi',
  utrNumber,
  onGoToDashboard,
  onViewDigitalCard,
}) => {
  const { showToast } = useToast();
  if (!isOpen) return null;

  const plan = PLANS.find((p) => p.id === planId) || PLANS[0];
  const directPayout = plan.directCommission;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.userId);
    showToast('FME स्पॉन्सर आईडी कॉपी हुई ✓', user.userId, 'success');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Flipkart Style Top Confetti / Celebration Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#2874f0] text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl mb-3 animate-bounce">
              <CheckCircle2 className="w-10 h-10 fill-emerald-600 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-yellow-300 text-[11px] font-black uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>भुगतान व ऑर्डर सफल (Payment Successful)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              बधाई हो, {user.name}! आपकी सर्विस दर्ज हो गई है!
            </h2>
            <p className="text-xs text-white/90 mt-1 max-w-md">
              FRESH MONEY EARN (FME) परिवार में आपका स्वागत है। आपका अकाउंट और डिजिटल ID कार्ड सक्रियण प्रक्रिया में है।
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-900 dark:text-slate-100 flex-1">
          {/* Unique Member ID Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">आपकी यूनिक FME स्पॉन्सर आईडी</div>
              <div className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-400">
                {user.userId}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                यूजरनेम: <strong>@{user.username}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 shadow-2xs active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
              <span>कॉपी करें</span>
            </button>
          </div>

          {/* Transaction Summary Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px] tracking-wide mb-1 border-b border-slate-200 dark:border-slate-700 pb-1">
              ट्रांजेक्शन रसीद सारांश (Order Details)
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">चुना गया प्लान:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {plan.name} (₹{plan.price})
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">भुगतान माध्यम:</span>
              <span className="font-bold text-slate-900 dark:text-white uppercase">
                {method === 'stripe' ? 'Stripe 256-Bit कार्ड' : 'UPI बैंक ट्रांसफर'}
              </span>
            </div>

            {utrNumber && (
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60 font-mono">
                <span className="text-slate-500">रेफरेंस / UTR:</span>
                <span className="font-bold text-slate-900 dark:text-white">{utrNumber}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">प्राप्तकर्ता (Admin):</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {OFFICIAL_UPI_NAME} ({OFFICIAL_UPI_ID})
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">डायरेक्ट रेफ़रल पेआउट:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                ₹{directPayout} प्रति मेंबर तुरंत
              </span>
            </div>
          </div>

          {/* Digital ID Card Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2874f0] text-white flex items-center justify-center shrink-0">
              {planId === '1000' ? <Crown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div className="text-xs">
              <div className="font-bold text-blue-950 dark:text-blue-100">
                आपका डिजिटल ID कार्ड तैयार है!
              </div>
              <p className="text-[11px] text-blue-800 dark:text-blue-300">
                {planId === '1000'
                  ? 'रॉयल क्राउन गोल्ड कार्ड और गोल्डन नेमप्लेट अनलॉक हो गई है।'
                  : planId === '500'
                  ? 'प्लेटिनम मेंबरशिप कार्ड और एडवांस्ड एनालिटिक्स अनलॉक हैं।'
                  : 'नॉर्मल मस्त लुक डिजिटल ID कार्ड अनलॉक हो गया है।'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onViewDigitalCard}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <CreditCard className="w-4 h-4 text-[#2874f0]" />
            <span>डिजिटल ID कार्ड देखें</span>
          </button>

          <button
            type="button"
            onClick={onGoToDashboard}
            className="flex-1 py-3 px-4 rounded-xl bg-[#fb641b] hover:bg-[#e85813] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>यूजर डैशबोर्ड खोलें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
