import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/plans';
import { PlanType, InquiryForm } from '../types';

interface ContactSectionProps {
  initialPlan?: PlanType;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialPlan = '500' }) => {
  const [formData, setFormData] = useState<InquiryForm>({
    name: '',
    phone: '',
    plan: initialPlan,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: InquiryForm) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const shareText = `🚀 *FRESH MONEY EARN (FME) FAST INCOME SERVICE*\nआ गया ऑनलाइन पैसा कमाने का बेस्ट तरीका! अब कोई भी कमा सकता है कम समय में ज्यादा से ज्यादा पैसा 3 LEVEL तक।\n\n📌 केवल ₹100 या ₹500 या ₹1000 से सर्विस शुरू करना और करवाना है:\n• ₹100 प्लान: LEVEL-1 से ₹30, LEVEL-2 से ₹10, LEVEL-3 से ₹5\n• ₹500 प्लान: LEVEL-1 से ₹150, LEVEL-2 से ₹75, LEVEL-3 से ₹25\n• ₹1000 प्लान: LEVEL-1 से ₹400, LEVEL-2 से ₹150, LEVEL-3 से ₹50\n\nJOINING CHARGE PAYMENT करके JOIN कीजिए और दूसरों को JOIN करके अपनी कमाई शुरू करें।\n\nज्यादा जानकारी व एक्टिवेशन के लिए संपर्क करें: ${CONTACT_EMAIL}`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `नमस्ते FRESH MONEY EARN (FME), मेरा नाम ${formData.name || 'दोस्त'} है। मैं ₹${formData.plan} प्लान के साथ सर्विस शुरू करना चाहता हूँ। कृपया मुझे एक्टिवेशन और पेमेंट डिटेल्स भेजें।`
  )}`;

  return (
    <section id="contact" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            जल्द से जल्द संपर्क करें
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            FRESH MONEY EARN टीम से जुड़ें
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            ज्यादा जानकारी के लिए हमसे जल्द से जल्द संपर्क करें। हम दे रहे हैं तीन LEVEL तक पैसा कमाने का अनोखा मौका!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                सीधे संपर्क सूत्र (Direct Contact)
              </h3>

              <div className="space-y-4">
                {/* Email Box */}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('FME सर्विस जॉइनिंग इन्क्वायरी')}&body=${encodeURIComponent('नमस्ते FRESH MONEY EARN टीम, मुझे 3 लेवल सर्विस के बारे में अधिक जानकारी चाहिए।')}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      आधिकारिक ईमेल (Official Email)
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {CONTACT_EMAIL}
                    </div>
                  </div>
                </a>

                {/* WhatsApp Box */}
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      WhatsApp चैट सपोर्ट (24×7 Active)
                    </div>
                    <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      तुरंत WhatsApp पर मैसेज भेजें
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Share / Invite Box */}
            <div className="p-6 rounded-2xl bg-emerald-900 text-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-base">दोस्तों को जोड़ें और 3 LEVEL से कमाएं</h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                यह संदेश कॉपी करें या एक क्लिक में WhatsApp पर अपने ग्रुप्स में शेयर करके अपनी 3 LEVEL टीम बनाएं:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर शेयर करें</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="py-2.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedInvite ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>मैसेज कॉपी करें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry / Start Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
                सर्विस एक्टिवेशन अनुरोध फॉर्म
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                JOINING CHARGE PAYMENT करके JOIN कीजिए और दूसरों को JOIN करके अपनी कमाई शुरू करें।
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                      अनुरोध सफलतापूर्वक दर्ज हुआ!
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                      धन्यवाद {formData.name || 'साथी'}! आपने ₹{formData.plan} प्लान चुना है। हमारी टीम जल्द ही आपसे WhatsApp/फोन पर संपर्क करेगी।
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>तुरंत WhatsApp पर चैट करें</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      दूसरा फॉर्म भरें
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        आपका नाम (Your Name) *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="जैसे: राहुल शर्मा"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        मोबाइल / WhatsApp नंबर *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="जैसे: 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      पसंदीदा सर्विस प्लान चुनें (₹100, ₹500 या ₹1000) *
                    </label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="100">₹100 प्लान (L1: ₹30, L2: ₹10, L3: ₹5)</option>
                      <option value="500">₹500 प्लान (L1: ₹150, L2: ₹75, L3: ₹25 - लोकप्रिय ⭐)</option>
                      <option value="1000">₹1000 प्लान (L1: ₹400, L2: ₹150, L3: ₹50 - VIP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      कोई संदेश या सवाल (वैकल्पिक)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="अगर आपका कोई सवाल हो या कोई बात पूछना चाहते हों..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500"
                    >
                      <Send className="w-4 h-4" />
                      <span>अनुरोध भेजें और तुरंत शुरू करें</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    आपकी जानकारी पूर्णतः सुरक्षित है। सबमिट करने के बाद आप सीधे WhatsApp पर भी कनेक्ट हो सकते हैं।
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
