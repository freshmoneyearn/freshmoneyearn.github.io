import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { Transaction } from '../types';

interface CommissionBannerAlertProps {
  transactions: Transaction[];
  onViewActivity: () => void;
  onViewTransactions: () => void;
}

export const CommissionBannerAlert: React.FC<CommissionBannerAlertProps> = ({
  transactions,
  onViewActivity,
  onViewTransactions,
}) => {
  const [activeAlert, setActiveAlert] = useState<{
    id: string;
    title: string;
    message: string;
    amount: number;
    fromName?: string;
    timestamp: string;
  } | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Play pleasant notification chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Note 1: E5 (659Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2: B5 (987Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.18, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch (e) {
      // Audio not permitted without interaction or audio context unavailable
    }
  };

  // Inspect recent commission transactions on load or updates
  useEffect(() => {
    const latestCommission = transactions.find((t) =>
      ['commission_direct', 'commission_l1', 'commission_l2', 'commission_l3'].includes(t.type)
    );

    if (latestCommission) {
      const dismissedAlertId = sessionStorage.getItem('fme_dismissed_alert_id');
      if (dismissedAlertId !== latestCommission.id) {
        setActiveAlert({
          id: latestCommission.id,
          title:
            latestCommission.type === 'commission_direct'
              ? '🎉 नया डायरेक्ट कमीशन पेआउट प्राप्त हुआ!'
              : '👥 नया टीम कमीशन क्रेडिट हुआ!',
          message: latestCommission.description,
          amount: latestCommission.amount,
          fromName: latestCommission.fromUserName,
          timestamp: latestCommission.createdAt,
        });
        setIsDismissed(false);
      }
    }
  }, [transactions]);

  // Handle dismiss
  const handleDismiss = () => {
    if (activeAlert) {
      sessionStorage.setItem('fme_dismissed_alert_id', activeAlert.id);
    }
    setIsDismissed(true);
  };

  // Trigger simulated/test commission alert for live testing
  const handleTestAlert = () => {
    const testId = `test-comm-${Date.now()}`;
    const testPlans = [
      { name: 'अमित वर्मा (Amit Verma)', plan: '₹500 प्लैटिनम', amount: 365 },
      { name: 'विकास यादव (Vikas Yadav)', plan: '₹1000 रॉयल क्राउन', amount: 765 },
      { name: 'पूजा सिंह (Pooja Singh)', plan: '₹100 स्टार्टर', amount: 65 },
    ];
    const picked = testPlans[Math.floor(Math.random() * testPlans.length)];

    setActiveAlert({
      id: testId,
      title: '🎉 लाइव कमीशन टेस्ट अलर्ट: पेआउट क्रेडिट!',
      message: `⚡ बधाई हो! आपके रेफ़रल ${picked.name} के ${picked.plan} से ₹${picked.amount} का डायरेक्ट कमीशन तुरंत वॉलेट में जोड़ा गया!`,
      amount: picked.amount,
      fromName: picked.name,
      timestamp: new Date().toISOString(),
    });
    setIsDismissed(false);

    if (soundEnabled) {
      playChime();
    }
  };

  if (!activeAlert || isDismissed) {
    return (
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleTestAlert}
          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          title="कमीशन आने पर कैसा अलर्ट दिखता है, टेस्ट करें"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          <span>🔔 टेस्ट कमीशन अलर्ट देखें (Test Alert)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 text-white p-4 sm:p-5 shadow-lg border border-emerald-400/40 animate-in slide-in-from-top-3 fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon & Content */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-700 flex items-center justify-center font-black shadow-md ring-4 ring-white/20">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#ffe11b] text-slate-950">
                LIVE PAYOUT
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{activeAlert.title}</span>
                <span className="font-mono text-yellow-300 bg-black/30 px-1.5 py-0.2 rounded text-xs">
                  +₹{activeAlert.amount}
                </span>
              </h3>
            </div>
            <p className="text-xs text-emerald-50 leading-relaxed font-medium">
              {activeAlert.message}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onViewActivity}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <span>गतिविधि टाइमलाइन</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onViewTransactions}
            className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 active:scale-95 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all border border-white/20"
          >
            <span>पासबुक</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title={soundEnabled ? 'आवाज़ बंद करें' : 'आवाज़ चालू करें'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-300" /> : <VolumeX className="w-4 h-4 text-white/60" />}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white cursor-pointer transition-colors"
            title="अलर्ट बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
