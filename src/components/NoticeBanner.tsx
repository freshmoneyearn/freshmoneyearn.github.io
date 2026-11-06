import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/90 dark:bg-amber-950/40 p-5 sm:p-7 shadow-sm">
        {/* Main notice heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-amber-200/80 dark:border-amber-900/60">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                विशेष सूचना (Important Notice)
              </span>
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                100% स्पष्ट व पारदर्शी नियम
              </span>
            </div>

            <p className="text-base sm:text-xl font-black text-amber-950 dark:text-amber-100 leading-snug">
              कृपया ध्यान दें:- इस में केवल आपको <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-500 underline-offset-4">₹100</span> या <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-500 underline-offset-4">₹500</span> या <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-500 underline-offset-4">₹1000</span> से सर्विस शुरू करना और करवाना है।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>सुरक्षित व डायरेक्ट पेआउट</span>
          </div>
        </div>

        {/* 3 Explicit earning conditions verbatim */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            प्रत्येक प्लान पर मिलने वाली 3 LEVEL कमाई का विवरण:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Condition 1: Rs 100 */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-black text-sm text-slate-900 dark:text-white">₹100 जॉइनिंग</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">बेसिक</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                अगर आप किसी मेंबर को <strong className="text-emerald-600 dark:text-emerald-400">₹100</strong> से ज्वाइन करवाते हो तो आपको:
              </p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-1 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹30</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-2 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹10</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-3 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹5</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                की प्राप्ति होगी।
              </div>
            </div>

            {/* Condition 2: Rs 500 */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xs relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-black text-sm text-slate-900 dark:text-white">₹500 जॉइनिंग</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">सर्वाधिक लोकप्रिय</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                अगर आप किसी मेंबर को <strong className="text-emerald-600 dark:text-emerald-400">₹500</strong> से ज्वाइन करवाते हो तो आपको:
              </p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-1 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹150</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-2 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹75</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-3 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹25</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                की प्राप्ति होगी।
              </div>
            </div>

            {/* Condition 3: Rs 1000 */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-black text-sm text-slate-900 dark:text-white">₹1000 जॉइनिंग</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">VIP अर्निंग</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                अगर आप किसी मेंबर को <strong className="text-emerald-600 dark:text-emerald-400">₹1000</strong> से ज्वाइन करवाते हो तो आपको:
              </p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-1 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹400</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-2 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹150</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>LEVEL-3 से:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹50</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                की प्राप्ति होगी।
              </div>
            </div>
          </div>
        </div>

        {/* Action callout banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">
              JOINING CHARGE PAYMENT करके JOIN कीजिए और दुसरो को JOIN करके अपनी कमाई शुरु करे।
            </span>
          </div>
          <a
            href="#plans"
            className="px-4 py-1.5 rounded-lg bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>प्लान देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
