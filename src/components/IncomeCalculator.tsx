import React, { useState } from 'react';
import { PLANS } from '../data/plans';
import { PlanType } from '../types';
import { Calculator, Sparkles, TrendingUp, RefreshCw, Info } from 'lucide-react';

interface IncomeCalculatorProps {
  onStartWithPlan: (planId: PlanType) => void;
}

export const IncomeCalculator: React.FC<IncomeCalculatorProps> = ({ onStartWithPlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanType>('500');
  const [l1Members, setL1Members] = useState<number>(5);
  const [l2Members, setL2Members] = useState<number>(25);
  const [l3Members, setL3Members] = useState<number>(125);

  const plan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const l1Income = l1Members * plan.payoutPerPerson.level1;
  const l2Income = l2Members * plan.payoutPerPerson.level2;
  const l3Income = l3Members * plan.payoutPerPerson.level3;
  const totalIncome = l1Income + l2Income + l3Income;
  const totalTeam = l1Members + l2Members + l3Members;

  const applyPreset = (direct: number, ratio: number) => {
    setL1Members(direct);
    setL2Members(direct * ratio);
    setL3Members(direct * ratio * ratio);
  };

  return (
    <section id="calculator" className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            3 LEVEL कमाई कैलकुलेटर
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            जानें आप कितनी कमाई कर सकते हैं
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            अपना प्लान चुनें और अपनी टीम के अनुसार 3 LEVEL तक का संभावित मुनाफा देखें।
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          {/* Plan Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. सर्विस एक्टिवेशन प्लान चुनें
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {PLANS.map((p) => {
                const isActive = p.id === selectedPlanId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 sm:p-4 rounded-xl text-center border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-lg sm:text-2xl font-extrabold">₹{p.price}</div>
                    <div className="text-xs font-medium truncate mt-0.5">
                      {p.id === '100' ? 'बेसिक (₹30/₹10/₹5)' : p.id === '500' ? 'सिल्वर (₹150/₹75/₹25)' : 'गोल्ड (₹400/₹150/₹50)'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Plan Rule Hint */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">नियम: </span>
              <span>{plan.ruleText}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              त्वरित टीम मॉडल (Quick Presets):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(3, 3)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                3 की टीम (3×3)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(5, 5)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-medium transition-colors"
              >
                5 की टीम (5×5)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(10, 5)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                10 की टीम (10×5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setL1Members(1);
                  setL2Members(0);
                  setL3Members(0);
                }}
                className="text-xs px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
                title="रीसेट करें"
              >
                <RefreshCw className="w-3 h-3" />
                <span>रीसेट</span>
              </button>
            </div>
          </div>

          {/* Sliders for 3 Levels */}
          <div className="space-y-6 mb-8">
            {/* Level 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    LEVEL 1 (डायरेक्ट रेफ़रल)
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    प्रति मेंबर कमाई: ₹{plan.payoutPerPerson.level1}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {l1Members} सदस्य
                  </span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    = ₹{l1Income.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={l1Members}
                onChange={(e) => setL1Members(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Level 2 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    LEVEL 2 (सेकंड लेवल टीम)
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    प्रति मेंबर कमाई: ₹{plan.payoutPerPerson.level2}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {l2Members} सदस्य
                  </span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    = ₹{l2Income.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={l2Members}
                onChange={(e) => setL2Members(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Level 3 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    LEVEL 3 (थर्ड लेवल पैसिव इनकम)
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    प्रति मेंबर कमाई: ₹{plan.payoutPerPerson.level3}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {l3Members} सदस्य
                  </span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    = ₹{l3Income.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={l3Members}
                onChange={(e) => setL3Members(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-1">
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wider opacity-90 flex items-center justify-center md:justify-start gap-1.5">
                  <TrendingUp className="w-4 h-4" /> कुल संभावित कमाई (Total Potential Earning)
                </div>
                <div className="text-3xl sm:text-5xl font-black tracking-tight">
                  ₹{totalIncome.toLocaleString('en-IN')}
                </div>
                <div className="text-xs opacity-80">
                  कुल टीम साइज: {totalTeam} सदस्य (लेवल 1 + 2 + 3)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => onStartWithPlan(selectedPlanId)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 active:bg-slate-100 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>₹{plan.price} प्लान से शुरू करें</span>
                </button>
              </div>
            </div>

            {/* Income breakdown mini-cards */}
            <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[11px] opacity-80">L1 कमाई (₹{plan.payoutPerPerson.level1}/सदस्य)</div>
                <div className="text-xs sm:text-base font-bold">₹{l1Income.toLocaleString('en-IN')}</div>
              </div>
              <div className="border-x border-white/20">
                <div className="text-[11px] opacity-80">L2 कमाई (₹{plan.payoutPerPerson.level2}/सदस्य)</div>
                <div className="text-xs sm:text-base font-bold">₹{l2Income.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-[11px] opacity-80">L3 कमाई (₹{plan.payoutPerPerson.level3}/सदस्य)</div>
                <div className="text-xs sm:text-base font-bold">₹{l3Income.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
