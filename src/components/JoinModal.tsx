import React, { useState } from 'react';
import { X, Check, MessageCircle, Mail, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { PlanType } from '../types';
import { PLANS, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/plans';
import { FmeLogo } from './FmeLogo';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: PlanType;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, initialPlanId = '500' }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialPlanId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PLANS.find((p) => p.id === selectedPlan) || PLANS[1];

  const whatsappMessage = `नमस्ते FRESH MONEY EARN, मेरा नाम ${name || 'साथी'} है। मैं ₹${currentPlan.price} (${currentPlan.name}) प्लान से सर्विस शुरू करना चाहता हूँ। कृपया मुझे तुरंत एक्टिवेशन प्रोसेस और UPI आईडी बताएं।`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              अनुरोध प्राप्त हुआ!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              धन्यवाद <strong>{name}</strong>! आपने <strong>₹{currentPlan.price}</strong> का प्लान चुना है। तेजी से एक्टिवेशन के लिए नीचे WhatsApp पर तुरंत चैट करें:
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp पर तुरंत चैट शुरू करें</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="block w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 pt-2 cursor-pointer"
            >
              विंडो बंद करें
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2.5 mb-2">
                <FmeLogo variant="icon" size="sm" withGlow={true} />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  FRESH MONEY EARN (FME)
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                सर्विस शुरू करें
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                केवल ₹100, ₹500 या ₹1000 से सर्विस शुरू करना और करवाना है।
              </p>
            </div>

            {/* Joining Charge Callout Banner */}
            <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>JOINING CHARGE PAYMENT करके JOIN कीजिए और दूसरों को JOIN करके अपनी कमाई शुरू करें।</span>
            </div>

            {/* Plan switcher tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PLANS.map((p) => {
                const isActive = p.id === selectedPlan;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-2.5 rounded-xl text-center border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-base font-extrabold">₹{p.price}</div>
                    <div className="text-[11px] font-medium truncate">
                      {p.id === '100' ? 'बेसिक' : p.id === '500' ? 'सिल्वर' : 'गोल्ड'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Plan perks */}
            <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>चुना गया प्लान:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{currentPlan.price} - 3 LEVEL</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-center font-bold">
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">LEVEL 1</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm">₹{currentPlan.payoutPerPerson.level1}</div>
                </div>
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">LEVEL 2</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm">₹{currentPlan.payoutPerPerson.level2}</div>
                </div>
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">LEVEL 3</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm">₹{currentPlan.payoutPerPerson.level3}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  आपका नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="अपना पूरा नाम दर्ज करें"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp / मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>अनुरोध दर्ज करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-4 text-xs pt-1 text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% सुरक्षित
                  </span>
                  <span>·</span>
                  <span>ईमेल: {CONTACT_EMAIL}</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
