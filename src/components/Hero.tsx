import { ArrowRight, Send, Calculator, ShieldCheck, Zap, Sparkles, CheckCircle } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/plans';
import { FmeLogo } from './FmeLogo';

interface HeroProps {
  onOpenJoin: (planId?: '100' | '500' | '1000') => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenJoin, onOpenCalculator }) => {
  const telegramUrl = 'https://t.me/freshmoneyearn';

  return (
    <section id="home" className="pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Luxury Logo Showcase */}
        <div className="flex justify-center mb-6">
          <FmeLogo variant="vertical" size="lg" withGlow={true} />
        </div>

        {/* Top Tagline */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" />
            FRESH MONEY EARN (FME) FAST INCOME SERVICE
          </span>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            · 3-Level इनकम मॉडल
          </span>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            आ गया पैसा कमाने के लिए{' '}
            <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 decoration-wavy">
              ऑनलाइन का बेस्ट तरीका
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
            अब कोई भी कमा सकता है <span className="text-emerald-700 dark:text-emerald-400">कम समय में ज्यादा से ज्यादा पैसा</span>
          </p>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto pt-2">
            जी हां, <strong>FRESH MONEY EARN (FME) FAST INCOME SERVICE</strong> लाया है पैसा कमाने का बिल्कुल नया और अनोखा तरीका। ज्यादा जानकारी के लिए हमसे जल्द से जल्द संपर्क करें, क्योंकि हम दे रहे हैं <strong>3 LEVEL तक</strong> पैसा कमाने का मौका!
          </p>

          {/* User Slogan Highlight */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs sm:text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>JOINING CHARGE PAYMENT करके JOIN कीजिए और दूसरों को JOIN करके अपनी कमाई शुरू करें।</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => onOpenJoin('500')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span>शुरू करें (मात्र ₹100 से)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-base text-white bg-[#0088cc] hover:bg-[#0077b5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
            <span>Telegram चैनल जॉइन करें</span>
          </a>

          <button
            type="button"
            onClick={onOpenCalculator}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>कमाई कैलकुलेटर</span>
          </button>
        </div>

        {/* Fast Value Highlights Grid */}
        <div className="mt-12 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹100
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              न्यूनतम शुरुआत
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              L1: ₹30 | L2: ₹10 | L3: ₹5
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹500
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              सुपर सिल्वर (लोकप्रिय)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              L1: ₹150 | L2: ₹75 | L3: ₹25
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹1000
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              गोल्ड प्रीमियर VIP
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              L1: ₹400 | L2: ₹150 | L3: ₹50
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              3 LEVEL
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              डायरेक्ट + पैसिव इनकम
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              तुरंत UPI/बैंक ट्रांसफर
            </div>
          </div>
        </div>

        {/* Quick bullets */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            कोई मुश्किल फॉर्म नहीं
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            मोबाइल से ही पूरा काम
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ईमेल: {CONTACT_EMAIL}
          </span>
        </div>
      </div>
    </section>
  );
};
