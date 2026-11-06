import React from 'react';
import { X, ShieldCheck, FileText, Info, HelpCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/plans';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. ABOUT PAGE / MODAL
export const AboutModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">हमारे बारे में</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
          FRESH MONEY EARN (FME) FAST INCOME SERVICE
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>FRESH MONEY EARN (FME)</strong> एक आधुनिक और पारदर्शी ऑनलाइन अर्निंग सर्विस प्लेटफॉर्म है, जिसका उद्देश्य हर आम नागरिक, छात्र, और गृहणी को अपने मोबाइल से 3-लेवल नेटवर्क के जरिए आर्थिक रूप से सशक्त बनाना है।
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 space-y-1.5 font-medium">
            <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100">हमारा मिशन:</h4>
            <p>
              ऑनलाइन पैसा कमाने के आसान, सुरक्षित और पारदर्शी तरीके उपलब्ध कराना। यहाँ कोई भी भारी निवेश नहीं है — केवल ₹100, ₹500 या ₹1000 से सर्विस शुरू करना और करवाना है।
            </p>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white pt-2">हमारी विशेषताएं:</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>पारदर्शी 3-लेवल कमीशन:</strong> हर जॉइनिंग पर लेवल 1, लेवल 2 और लेवल 3 में पूर्व-निर्धारित कमीशन।</li>
            <li><strong>सीधा UPI ट्रांसफर:</strong> बैंक या UPI (PhonePe, GPay, Paytm) में त्वरित विड्रॉल सुविधा।</li>
            <li><strong>सुरक्षित डेटाबेस:</strong> Firebase सिक्योर सिस्टम और अद्वितीय User ID जनरेशन।</li>
            <li><strong>24×7 सहायता:</strong> WhatsApp और ईमेल सपोर्ट ({CONTACT_EMAIL})।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 2. PRIVACY POLICY MODAL
export const PrivacyPolicyModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">PRIVACY POLICY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
          गोपनीयता नीति (Privacy Policy)
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            FRESH MONEY EARN (FME) में आपकी निजता और व्यक्तिगत डेटा की सुरक्षा हमारी सर्वोच्च प्राथमिकता है। यह नीति स्पष्ट करती है कि हम आपकी जानकारी कैसे सुरक्षित रखते हैं:
          </p>

          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">1. संगृहीत जानकारी:</h4>
              <p>रजिस्ट्रेशन के समय आपका नाम, ईमेल, WhatsApp नंबर, Telegram हैंडल तथा पेआउट हेतु आपकी UPI ID व बैंक खाताधारक नाम ही लिया जाता है।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">2. डेटा का उपयोग:</h4>
              <p>आपकी जानकारी का उपयोग केवल आपके FME खाते के संचालन, 3-लेवल कमीशन वितरण और UPI पेआउट्स ट्रांसफर के लिए किया जाता है।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">3. कोई थर्ड पार्टी बिक्री नहीं:</h4>
              <p>हम आपकी व्यक्तिगत जानकारी किसी भी तीसरे पक्ष, विज्ञापन एजेंसी या बाहरी संगठन को न बेचते हैं और न ही साझा करते हैं।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">4. सुरक्षा व एन्क्रिप्शन:</h4>
              <p>सभी डेटा गूगल क्लाउड / Firebase की अत्याधुनिक सुरक्षा नीतियों के तहत सुरक्षित रखा जाता है।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. DECLARATION MODAL (डिक्लरेशन / कानूनी घोषणा)
export const DeclarationModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">डिक्लरेशन (DECLARATION)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
          आधिकारिक कानूनी डिक्लरेशन व शपथ पत्र
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 font-bold">
            "कृपया ध्यान दें:- इस में केवल आपको ₹100 या ₹500 या ₹1000 से सर्विस शुरू करना और करवाना है।"
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white">घोषणा बिंदु:</h4>
            <p>1. <strong>स्वैच्छिक सहभागिता:</strong> प्रत्येक सदस्य अपनी पूर्ण सहमति और विवेक से ₹100, ₹500 या ₹1000 का चयन कर सर्विस एक्टिवेट करता है।</p>
            <p>2. <strong>कमीशन वितरण नियम:</strong>
              <br />• ₹100 जॉइनिंग: LEVEL-1 से ₹30, LEVEL-2 से ₹10, LEVEL-3 से ₹5
              <br />• ₹500 जॉइनिंग: LEVEL-1 से ₹150, LEVEL-2 से ₹75, LEVEL-3 से ₹25
              <br />• ₹1000 जॉइनिंग: LEVEL-1 से ₹400, LEVEL-2 से ₹150, LEVEL-3 से ₹50
            </p>
            <p>3. <strong>कोई फर्जी वादा नहीं:</strong> FME कोई बिना काम के चमत्कारिक स्कीम नहीं है। यह एक रेफ़रल आधारित सर्विस मॉडल है जहाँ टीम बनाने पर 3 LEVEL तक वास्तविक कमीशन दिया जाता है।</p>
            <p>4. <strong>सहमति:</strong> रजिस्ट्रेशन करने पर उपयोगकर्ता घोषणा करता है कि वह सभी नियमों से सहमत है।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. USER GUIDE & PROCESS MODAL (यूजर गाइड व सिस्टम प्रोसेस)
export const UserGuideModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'रजिस्ट्रेशन व FME यूनिक आईडी',
      desc: 'रजिस्टर फॉर्म में अपना नाम, WhatsApp, Telegram, ईमेल, UPI विवरण भरें। आपको तुरंत यूनिक FME ID प्राप्त होगी।',
    },
    {
      step: '02',
      title: 'प्लान चयन (₹100, ₹500 या ₹1000)',
      desc: 'अपनी क्षमता अनुसार सर्विस प्लान चुनें। याद रखें: केवल ₹100 या ₹500 या ₹1000 से ही सर्विस शुरू करना और करवाना है।',
    },
    {
      step: '03',
      title: 'Joining Charge Payment व एक्टिवेशन',
      desc: 'दिए गए आधिकारिक UPI पर जॉइनिंग चार्ज का भुगतान करें और WhatsApp पर स्क्रीनशॉट भेजकर अपनी सर्विस एक्टिवेट करवाएं।',
    },
    {
      step: '04',
      title: 'रेफ़रल लिंक व ID शेयर करें',
      desc: 'अपने डैशबोर्ड से अपना रेफ़रल लिंक या FME ID कॉपी करें और WhatsApp पर दोस्तों को भेजें।',
    },
    {
      step: '05',
      title: '3 LEVEL से लगातार कमाई',
      desc: 'जब वे जुड़ते हैं तो Level 1, उनके द्वारा जोड़े गए लोगों से Level 2, और उनकी टीम से Level 3 कमीशन स्वतः आपके वॉलेट में जुड़ता है।',
    },
    {
      step: '06',
      title: 'सीधा UPI विड्रॉल',
      desc: 'वॉलेट बैलेंस ₹50 होते ही सीधे विड्रॉल अनुरोध करें। राशि आपके पंजीकृत UPI ID पर भेज दी जाती है।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">COMPLETE USER GUIDE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          FME सिस्टम प्रोसेस व यूजर गाइड (How It Works)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          JOINING CHARGE PAYMENT करके JOIN कीजिए और दुसरो को JOIN करके अपनी कमाई शुरु करे।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. GOVERNMENT RULES & LEGAL COMPLIANCE MODAL (गवर्नमेंट रूल्स अनुपालन)
export const GovernmentRulesModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">GOVERNMENT RULES & COMPLIANCE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
          भारत सरकार के नियम व कानूनी अनुपालन
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200">
            <p className="font-semibold">
              FME प्लेटफ़ॉर्म भारत सरकार के उपभोक्ता संरक्षण (प्रत्यक्ष विक्रय) नियम 2021 (Consumer Protection Direct Selling Rules, 2021) और डिजिटल सेवा विनियमों के दिशानिर्देशों के अनुरूप संचालित होता है।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">1. वैध डिजिटल सेवा व डिजिटल आईडी कार्ड:</h4>
              <p>प्रत्येक उपयोगकर्ता को भुगतान के बदले वास्तविक सेवा, यूनिक FME यूजर आईडी, और डिजिटल मेंबरशिप आईडी कार्ड प्रदान किया जाता है। बिना किसी उत्पाद/सेवा के केवल धन का आदान-प्रदान नहीं किया जाता।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">2. पारदर्शी डायरेक्ट कमीशन सिस्टम:</h4>
              <p>रेफरल कमीशन पूर्व-निर्धारित दरों (₹100 पर ₹65, ₹500 पर ₹365, ₹1000 पर ₹765) पर एडमिन सत्यापन उपरांत सीधे अधिकृत बैंक/UPI में ट्रांसफर किया जाता है।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">3. पारदर्शी टैक्स व रिकॉर्ड्स:</h4>
              <p>सभी लेन-देन डिजिटल माध्यम (UPI/Stripe) से होते हैं जिनका पूर्ण डिजिटल ऑडिट ट्रेल सुरक्षित रखा जाता है। उपयोगकर्ता अपनी आय पर लागू आयकर (Income Tax) नियमों का स्वयं पालन करने हेतु उत्तरदायी हैं।</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">4. उपभोक्ता शिकायत निवारण:</h4>
              <p>उपयोगकर्ता की किसी भी समस्या के समाधान के लिए 1-ऑन-1 प्राइवेट एडमिन चैट और समर्पित ईमेल {CONTACT_EMAIL} 24 घंटे उपलब्ध है।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. DISCLAIMER MODAL (अस्वीकरण)
export const DisclaimerModal: React.FC<BaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">DISCLAIMER</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
          अस्वीकरण (Disclaimer)
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            FRESH MONEY EARN (FME) कोई बैंक, वित्तीय संस्थान, चिटफंड या म्यूचुअल फंड नहीं है। यह एक डिजिटल रेफरल सर्विस प्लेटफ़ॉर्म है।
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-2">
            <h4 className="font-extrabold text-sm">महत्वपूर्ण अस्वीकरण बिंदु:</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>प्लेटफ़ॉर्म पर किसी भी निश्चित मासिक ब्याज या गारंटीड रिटर्न का वादा नहीं किया जाता है।</li>
              <li>कमाई पूर्णतः आपके द्वारा किए गए डायरेक्ट रेफरल्स और सक्रियता पर निर्भर करती है।</li>
              <li>प्लान एक्टिवेशन फीस (₹100, ₹500, ₹1000) डिजिटल आईडी कार्ड, डैशबोर्ड एक्सेस व सर्विस टूलकिट के लिए ली जाती है।</li>
              <li>सदस्यता लेने से पूर्व सभी नियम और शर्तें ध्यानपूर्वक पढ़ें।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

