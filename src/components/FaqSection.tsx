import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'क्या सच में केवल ₹100, ₹500 या ₹1000 से सर्विस शुरू हो जाती है?',
      answer:
        'जी हां, बिल्कुल! FRESH MONEY EARN (FME) FAST INCOME SERVICE का नियम बिल्कुल सीधा है - इस में केवल आपको ₹100 या ₹500 या ₹1000 से सर्विस शुरू करना और करवाना है। कोई छुपा हुआ शुल्क नहीं है।',
    },
    {
      question: 'प्रत्येक प्लान पर 3 LEVEL से कितनी कमाई प्राप्त होगी?',
      answer:
        '• अगर आप किसी मेंबर को ₹100 से ज्वाइन करवाते हो तो आपको LEVEL-1 से ₹30, LEVEL-2 से ₹10 तथा LEVEL-3 से ₹5 की प्राप्ति होगी।\n• अगर आप किसी मेंबर को ₹500 से ज्वाइन करवाते हो तो आपको LEVEL-1 से ₹150, LEVEL-2 से ₹75 तथा LEVEL-3 से ₹25 की प्राप्ति होगी।\n• अगर आप किसी मेंबर को ₹1000 से ज्वाइन करवाते हो तो आपको LEVEL-1 से ₹400, LEVEL-2 से ₹150 तथा LEVEL-3 से ₹50 की प्राप्ति होगी।',
    },
    {
      question: 'JOINING CHARGE PAYMENT कैसे करना है और सर्विस कैसे शुरू होगी?',
      answer:
        'JOINING CHARGE PAYMENT करके JOIN कीजिए और दूसरों को JOIN करके अपनी कमाई शुरू करें। आप सीधे WhatsApp या ईमेल (freshmoneyearn@gmail.com) पर संपर्क करके सुरक्षित UPI के माध्यम से पेमेंट करके सर्विस तुरंत एक्टिवेट करवा सकते हैं।',
    },
    {
      question: 'कमाई का पैसा कब और कैसे ट्रांसफर होता है?',
      answer:
        'आपकी सभी कमीशन इनकम सीधे आपके Google Pay, PhonePe, Paytm (UPI) या बैंक खाते में ट्रांसफर की जाती है। आप दैनिक विड्रॉल ले सकते हैं।',
    },
    {
      question: 'क्या इसके लिए किसी पूर्व अनुभव या लैपटॉप/कंप्यूटर की आवश्यकता है?',
      answer:
        'बिल्कुल नहीं! कोई भी आम व्यक्ति, छात्र, गृहणी या कामकाजी व्यक्ति इसे अपने साधारण स्मार्टफोन से ही मात्र 1-2 घंटे देकर कर सकता है। पूरी प्रक्रिया बहुत ही आसान और सीधी है।',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-slate-100/60 dark:bg-slate-900/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            अक्सर पूछे जाने वाले सवाल (FAQ)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            आपके सवालों के आसान जवाब
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-200 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
