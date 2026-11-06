import React from 'react';
import { PLANS } from '../data/plans';
import { PlanType } from '../types';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PlansSectionProps {
  onSelectPlan: (planId: PlanType) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="plans" className="py-12 sm:py-16 bg-slate-100/60 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            सर्विस एक्टिवेशन प्लान्स
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            अपने बजट के अनुसार प्लान चुनें
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            केवल <strong>₹100</strong>, <strong>₹500</strong> या <strong>₹1000</strong> से अपनी सर्विस शुरू करें और 3 LEVEL तक कमाई का लाभ उठाएं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-200 ${
                  isPopular
                    ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 md:-translate-y-2'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Popular Pill badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {!isPopular && plan.badge && (
                    <span className="inline-block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {plan.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        / वन-टाइम एक्टिवेशन
                      </span>
                    </div>
                  </div>

                  {/* Explicit Condition Highlight Box */}
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                    <strong>कमाई नियम:</strong> {plan.ruleText}
                  </div>

                  {/* 3-Level Commission Highlights */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/80 space-y-2">
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      तीन LEVEL इनकम प्रति मेंबर:
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">LEVEL-1 (डायरेक्ट):</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{plan.payoutPerPerson.level1}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">LEVEL-2 (टीम लेवल):</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{plan.payoutPerPerson.level2}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">LEVEL-3 (पैसिव इनकम):</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{plan.payoutPerPerson.level3}
                      </span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                      isPopular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>₹{plan.price} प्लान से शुरू करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
