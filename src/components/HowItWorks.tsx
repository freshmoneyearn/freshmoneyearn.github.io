import React from 'react';
import { CheckCircle2, UserCheck, Share2, Wallet, ArrowRight } from 'lucide-react';
import { PlanType } from '../types';

interface HowItWorksProps {
  onStart: (planId?: PlanType) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  const steps = [
    {
      step: '01',
      title: 'प्लान चुनें (Choose Plan)',
      description: 'केवल ₹100, ₹500 या ₹1000 में से अपनी सुविधा अनुसार कोई एक सर्विस प्लान चुनें।',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'सर्विस एक्टिवेट करें (Activation)',
      description: 'JOINING CHARGE PAYMENT करके JOIN कीजिए और अपनी सर्विस तुरंत एक्टिवेट करवाएं।',
      icon: CheckCircle2,
    },
    {
      step: '03',
      title: 'दूसरों को JOIN करवाएं (Refer & Earn)',
      description: 'दूसरों को JOIN करके अपनी कमाई शुरू करें। आप 3 LEVEL तक हर जॉइनिंग पर सीधी कमाई पाएंगे।',
      icon: Share2,
    },
    {
      step: '04',
      title: 'सीधा बैंक / UPI पेआउट (Get Paid)',
      description: 'आपकी कमाई सीधे आपके UPI (GPay, PhonePe, Paytm) या बैंक खाते में ट्रांसफर की जाएगी।',
      icon: Wallet,
    },
  ];

  const levelsExplanation = [
    {
      level: 'LEVEL 1 (डायरेक्ट मेंबर)',
      who: 'जिनको आप सीधे जोड़ते हैं',
      payouts: '₹100 पर ₹30 | ₹500 पर ₹150 | ₹1000 पर ₹400',
      benefit: 'प्रत्येक डायरेक्ट जॉइनिंग पर सबसे बड़ी सीधी कमाई।',
    },
    {
      level: 'LEVEL 2 (सेकंड लेवल टीम)',
      who: 'जिनको आपकी LEVEL 1 टीम जोड़ती है',
      payouts: '₹100 पर ₹10 | ₹500 पर ₹75 | ₹1000 पर ₹150',
      benefit: 'आपकी टीम की मेहनत से आने वाली ऑटोमैटिक पैसिव कमाई।',
    },
    {
      level: 'LEVEL 3 (थर्ड लेवल नेटवर्क)',
      who: 'LEVEL 2 के लोगों द्वारा जोड़े गए लोग',
      payouts: '₹100 पर ₹5 | ₹500 पर ₹25 | ₹1000 पर ₹50',
      benefit: 'विशाल टीम नेटवर्क से निरंतर मिलने वाली असीमित इनकम।',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            सरल प्रक्रिया
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            FME FAST INCOME SERVICE कैसे काम करती है?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            बिना किसी झंझट के 4 सरल चरणों में ऑनलाइन कमाई शुरू करें
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-600/30 dark:text-emerald-400/20">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Level Breakdown Explanation Card */}
        <div className="mt-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>तीन LEVEL कमाई का सटीक चार्ट समझें:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelsExplanation.map((lvl, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {lvl.level}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {lvl.who}
                  </div>
                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800/50">
                    {lvl.payouts}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {lvl.benefit}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              कृपया ध्यान दें: आपको केवल <strong>₹100</strong>, <strong>₹500</strong> या <strong>₹1000</strong> से सर्विस शुरू करना और करवाना है।
            </p>
            <button
              type="button"
              onClick={() => onStart('500')}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>सर्विस शुरू करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
