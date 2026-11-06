import React, { useState } from 'react';
import {
  Share2,
  Copy,
  CheckCheck,
  Send,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Clock,
  CreditCard,
  MessageSquare,
  QrCode,
  Flame,
  FileCheck,
  Crown,
  Award,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PLANS, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';
import { DigitalIdCard } from './DigitalIdCard';
import { FmeLogo } from './FmeLogo';
import { useToast } from './Toast';

interface PendingReferralDashboardProps {
  user: UserProfile;
  referralLink: string;
  copiedLink: boolean;
  copiedCode: boolean;
  onCopyLink: () => void;
  onCopyCode: () => void;
  onOpenSocialShare: () => void;
  onOpenChat: () => void;
  onReuploadProof: () => void;
}

export const PendingReferralDashboard: React.FC<PendingReferralDashboardProps> = ({
  user,
  referralLink,
  copiedLink,
  copiedCode,
  onCopyLink,
  onCopyCode,
  onOpenSocialShare,
  onOpenChat,
  onReuploadProof,
}) => {
  const { showToast } = useToast();
  const [copiedPosterIdx, setCopiedPosterIdx] = useState<number | null>(null);

  const selectedPlanInfo = PLANS.find((p) => p.id === user.plan) || PLANS[0];

  // Promotional Posters data with ready-to-share copy
  const promoPosters = [
    {
      id: 'poster-100',
      title: '₹100 स्टार्टर प्लान',
      subtitle: 'नॉर्मल मस्त लुक · डायरेक्ट पेआउट ₹65',
      badge: 'सबसे आसान जॉइनिंग',
      color: 'from-emerald-600 to-teal-800',
      border: 'border-emerald-400',
      payout: '₹65 सीधा पेआउट',
      tagline: 'सिर्फ ₹100 से अपनी ऑनलाइन कमाई शुरू करें!',
      copyText: `🔥 FRESH MONEY EARN (FME) - ₹100 प्लान 🔥\n\nघर बैठे मोबाइल से रोज़ाना पैसे कमाने का सुनहरा मौका!\n\n💰 प्लान: सिर्फ ₹100 (वन-टाइम)\n⚡ डायरेक्ट रेफरल कमीशन: ₹65 तुरंत!\n🚀 3-लेवल तक धमाकेदार इनकम\n\nमेरी स्पॉन्सर आईडी: ${user.userId}\nअभी नीचे दिए लिंक से रजिस्टर करें:\n👉 ${referralLink}`,
    },
    {
      id: 'poster-500',
      title: '₹500 प्लैटिनम प्लान',
      subtitle: 'प्लैटिनम डिजिटल ID · डायरेक्ट पेआउट ₹365',
      badge: 'सबसे ज्यादा लोकप्रिय',
      color: 'from-blue-700 via-indigo-800 to-slate-900',
      border: 'border-cyan-400',
      payout: '₹365 सीधा पेआउट',
      tagline: '3-लेवल पैसिव इनकम और एडवांस्ड टूल्स!',
      copyText: `💎 FRESH MONEY EARN (FME) - ₹500 प्लैटिनम प्लान 💎\n\nकमाएं हर रेफर पर ₹365 का इंस्टेंट पेआउट सीधे अपने UPI में!\n\n✨ प्लैटिनम डिजिटल ID कार्ड\n📈 3-लेवल टीम इनकम\n⚡ तुरंत वेरिफिकेशन\n\nमेरी स्पॉन्सर आईडी: ${user.userId}\nअभी रजिस्टर करें:\n👉 ${referralLink}`,
    },
    {
      id: 'poster-1000',
      title: '₹1000 रॉयल क्राउन प्लान',
      subtitle: 'VIP क्राउन ID · डायरेक्ट पेआउट ₹765',
      badge: 'मैक्सिमम अर्निंग VIP',
      color: 'from-amber-900 via-yellow-900 to-slate-950',
      border: 'border-amber-400',
      payout: '₹765 सीधा पेआउट',
      tagline: 'रॉयल क्राउन आईडी और सबसे बड़ा पेआउट!',
      copyText: `👑 FRESH MONEY EARN (FME) - ₹1000 रॉयल क्राउन VIP 👑\n\nसबसे बड़ा पेआउट: प्रत्येक रेफर पर सीधा ₹765!\n\n⚜️ रॉयल क्राउन VIP डिजिटल ID\n💰 मैक्सिमम डायरेक्ट & 3-लेवल कमीशन\n🔒 100% भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल\n\nमेरी स्पॉन्सर आईडी: ${user.userId}\nअभी VIP मेंबर बनें:\n👉 ${referralLink}`,
    },
  ];

  const handleCopyPosterText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPosterIdx(idx);
    showToast(
      'पोस्टर संदेश कॉपी हुआ ✓',
      'प्रमोशन संदेश क्लिपबोर्ड में कॉपी हो गया है। इसे Telegram पर शेयर करें।',
      'success'
    );
    setTimeout(() => setCopiedPosterIdx(null), 2000);
  };

  const handleSharePosterToTelegram = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(referralLink);
    const url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    window.open(url, '_blank');
    showToast('Telegram खोला गया!', 'प्रमोशन पोस्टर Telegram पर शेयर के लिए तैयार है।', 'success');
  };

  const handleDownloadPoster = (title: string) => {
    showToast(
      'पोस्टर तैयार है!',
      `${title} का प्रमोशन बैनर डाउनलोड हो रहा है। इसे सोशल मीडिया पर शेयर करें।`,
      'info'
    );
  };

  const adminTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    'https://freshmoneyearn.com'
  )}&text=${encodeURIComponent(
    `नमस्ते Admin, मैंने FME पर रजिस्टर किया है। मेरी FME ID: ${user.userId}, नाम: ${user.name}, चुना गया प्लान: ₹${user.plan}। कृपया सर्विस एक्टिवेट करें।`
  )}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Pending Verification Alert Hero Bar */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-blue-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-blue-950/40 border-2 border-amber-400 dark:border-amber-600/60 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  सत्यापन प्रक्रिया में (Approval Pending)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  सर्विस प्लान: ₹{user.plan}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                आपका रेफ़रल डैशबोर्ड सक्रिय है!
              </h2>
            </div>
          </div>

          {/* Interactive User ID Copy Pill */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end p-2 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800">
            <div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">आपकी FME ID:</div>
              <div className="font-mono font-black text-sm text-[#2874f0]">{user.userId}</div>
            </div>
            <button
              type="button"
              onClick={onCopyCode}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'कॉपी हुआ' : 'ID कॉपी'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          आपका पेमेंट स्क्रीनशॉट एडमिन वेरिफिकेशन में है। <strong>जब तक एडमिन अप्रूवल प्रक्रिया पूरी नहीं होती, आपका डिजिटल आईडी कार्ड लॉक रहेगा</strong>। तब तक आप नीचे दिए गए अपने एक्टिव रेफ़रल लिंक और <strong>प्रमोशन पोस्टर्स</strong> को Telegram व सोशल मीडिया पर शेयर करके तुरंत जॉइनिंग करवा सकते हैं!
        </p>

        {/* Verification Status & Telegram Fast-Track */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-500 font-bold uppercase">
              प्राप्तकर्ता आधिकारिक खाता:
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">
              {OFFICIAL_UPI_ID} ({OFFICIAL_UPI_NAME})
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              <span>स्क्रीनशॉट संलग्न है · सत्यापन प्रगति पर है</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={adminTelegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram पर रसीद भेजें</span>
            </a>

            <button
              type="button"
              onClick={onOpenChat}
              className="px-3.5 py-2 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>एडमिन गाइड चैट</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Active Referral Link & Fast Sharing Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1d5ec4] via-blue-900 to-slate-950 text-white shadow-xl space-y-4 border border-blue-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ffe11b] text-slate-950 flex items-center justify-center font-black">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">आपका सक्रिय डायरेक्ट रेफ़रल लिंक</h3>
              <p className="text-xs text-blue-200">
                स्पॉन्सर आईडी: <strong className="font-mono text-yellow-300">{user.userId}</strong> (पूरी तरह एक्टिव)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSocialShare}
            className="py-2 px-4 rounded-xl bg-[#ffe11b] hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>सोशल शेयर मेनू</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          इस लिंक से कोई भी सदस्य सीधे FME जॉइन कर सकता है। ₹100 प्लान शेयर करने पर <strong>₹65</strong>, ₹500 पर <strong>₹365</strong> और ₹1000 पर <strong>₹765</strong> सीधा पेआउट मिलेगा।
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 p-3 rounded-2xl bg-black/40 border border-blue-400/40 text-xs font-mono select-all truncate text-yellow-300">
            {referralLink}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopyLink}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                copiedLink ? 'bg-yellow-300 text-slate-950 ring-2 ring-white/50' : 'bg-white text-slate-950 hover:bg-slate-100'
              }`}
            >
              {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-800 animate-bounce" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'कॉपी हुआ ✓' : 'रेफ़रल कॉपी'}</span>
            </button>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(
                `🔥 FRESH MONEY EARN (FME) से जुड़ें और 3-LEVEL तक रोज़ाना पैसे कमाएं! मेरी स्पॉन्सर आईडी: ${user.userId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Telegram शेयर</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. High-Converting Promotional Posters Suite (Active for Sharing) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-[#ffe11b] text-slate-950 shadow-2xs mb-1">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>प्रमोशन पोस्टर सूट (READY TO SHARE)</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              अपने नाम व आईडी वाले प्रमोशन पोस्टर्स तुरंत शेयर करें
            </h3>
            <p className="text-xs text-slate-500">
              ये पोस्टर्स अप्रूवल के दौरान भी पूरी तरह एक्टिव हैं। इन्हें Telegram और स्टेटस पर शेयर करें।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {promoPosters.map((poster, idx) => (
            <div
              key={poster.id}
              className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${poster.color} text-white shadow-xl border-2 ${poster.border} flex flex-col justify-between space-y-4 transition-transform hover:scale-101`}
            >
              {/* Official Platform Luxury Watermark in Background */}
              <FmeLogo variant="watermark" className="opacity-10 pointer-events-none scale-110" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    {poster.badge}
                  </span>
                  <span className="text-xs font-mono font-black text-yellow-300">
                    ID: {user.userId}
                  </span>
                </div>

                {/* Official Brand Badge on Poster */}
                <div className="mb-2.5">
                  <FmeLogo variant="poster-badge" />
                </div>

                <div className="text-2xl font-black text-white">{poster.title}</div>
                <div className="text-xs text-slate-200 mt-1 font-semibold">{poster.subtitle}</div>

                <div className="my-3 p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="text-[11px] text-yellow-300 font-bold">{poster.payout}</div>
                  <div className="text-[10px] text-slate-300 leading-snug">{poster.tagline}</div>
                </div>
              </div>

              {/* Action Buttons for this Poster */}
              <div className="space-y-2 pt-2 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => handleSharePosterToTelegram(poster.copyText)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram पर शेयर करें</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPosterText(poster.copyText, idx)}
                    className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedPosterIdx === idx ? (
                      <CheckCheck className="w-3.5 h-3.5 text-yellow-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedPosterIdx === idx ? 'कॉपी हुआ ✓' : 'टेक्स्ट कॉपी'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPoster(poster.title)}
                    className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>डाउनलोड</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Locked Digital ID Card Display */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                डिजिटल ID कार्ड (सत्यापन प्रतीक्षारत - LOCKED)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              जैसे ही एडमिन आपके पेमेंट को स्वीकृत करेंगे, आपका डिजिटल आईडी कार्ड डाउनलोड और प्रोफाइल कस्टमाइज़ेशन तुरंत अनलॉक हो जाएगा।
            </p>
          </div>

          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>डाउनलोड अभी लॉक है</span>
          </div>
        </div>

        {/* Display Card with Built-in Lock Overlay */}
        <DigitalIdCard user={user} isOwner={true} />
      </div>
    </div>
  );
};
