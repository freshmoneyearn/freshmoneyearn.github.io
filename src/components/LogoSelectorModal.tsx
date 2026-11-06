import React, { useState } from 'react';
import { X, Check, Sparkles, Crown, ShieldCheck, ArrowRight, Eye, Smartphone, Monitor } from 'lucide-react';
import { FME_LOGO_OPTIONS } from './FmeLogo';
import { useToast } from './Toast';

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoSelectorModal: React.FC<LogoSelectorModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeLogoId, setActiveLogoId] = useState<string>(() => {
    return localStorage.getItem('fme_selected_logo_id') || 'option1';
  });
  const [previewOption, setPreviewOption] = useState<string>('option1');

  if (!isOpen) return null;

  const handleSelectLogo = (id: string, name: string) => {
    setActiveLogoId(id);
    localStorage.setItem('fme_selected_logo_id', id);
    window.dispatchEvent(new Event('fme_logo_changed'));
    showToast(
      'नया लोगो सफलतापूर्वक सेट हुआ! ✓',
      `अब "${name}" पूरे प्लेटफ़ॉर्म (ID कार्ड, पोस्टर्स, हेडर) पर लागू हो गया है।`,
      'success'
    );
  };

  const selectedData = FME_LOGO_OPTIONS.find((o) => o.id === previewOption) || FME_LOGO_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-7 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#ffe11b] text-slate-950 shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" /> FME OFFICIAL LOGO STUDIO
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            अपना पसंदीदा आधिकारिक FME लोगो चुनें
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
            तीनों लोगो 3D लक्ज़री गोल्ड और एमराल्ड ग्रीन थीम में तैयार किए गए हैं। चुने गए लोगो को क्लिक करके तुरंत लाइव लागू करें:
          </p>
        </div>

        {/* 3 Logo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {FME_LOGO_OPTIONS.map((logo) => {
            const isSelected = activeLogoId === logo.id;
            const isPreviewing = previewOption === logo.id;

            return (
              <div
                key={logo.id}
                onClick={() => setPreviewOption(logo.id)}
                className={`group relative rounded-2xl p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-400/50 shadow-lg'
                    : isPreviewing
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#ffe11b] text-slate-950">
                      {logo.tag}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" /> सक्रिय (ACTIVE)
                      </span>
                    )}
                  </div>

                  {/* Logo Image Preview */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 shadow-md mb-3 flex items-center justify-center group-hover:scale-101 transition-transform">
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {logo.name}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {logo.desc}
                  </p>
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLogo(logo.id, logo.name);
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#2874f0] hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>यह लोगो एक्टिव है</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-3.5 h-3.5" />
                        <span>यह लोगो सेट करें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Device Preview Inspection Section (Mobile vs Desktop Mock) */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>डिवाइस लुक प्रीव्यू (Device Screen Appearance)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedData.bestFor}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Mobile Header Look */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 shadow-md">
                <img src={selectedData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> मोबाइल व्यू (Crisp & Sharp)
                </div>
                <div className="font-black text-white text-xs truncate">FRESH MONEY EARN</div>
                <div className="text-[10px] text-yellow-300">Explore Plus | Fast Service</div>
              </div>
            </div>

            {/* Digital ID Card Badge Look */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-2 ring-yellow-400 shadow-md">
                <img src={selectedData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1">
                  <Monitor className="w-3 h-3" /> डिजिटल ID कार्ड & पोस्टर्स
                </div>
                <div className="font-black text-white text-xs truncate">FME VIP MEMBER</div>
                <div className="text-[10px] text-slate-300">Govt Direct Selling Compliant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            💡 आप चाहें तो चैट में बता सकते हैं कि आपको <strong>Option 1, Option 2, या Option 3</strong> में से कौन सा लोगो स्थायी रखना है!
          </p>
        </div>
      </div>
    </div>
  );
};
