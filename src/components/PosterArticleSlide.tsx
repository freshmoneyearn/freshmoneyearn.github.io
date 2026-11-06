import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Pause,
  Play,
  Award,
  Wallet,
  Smartphone,
  Crown,
  CreditCard,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { PlanType } from '../types';
import { OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';

interface PosterArticleSlideProps {
  onStartWithPlan: (planId: PlanType) => void;
}

interface SlideData {
  id: string;
  badge: string;
  navTitle: string;
  posterTitle: string;
  posterSubtitle: string;
  posterHighlight: string;
  posterBgGradient: string;
  articleTitle: string;
  articleLead: string;
  articleSections: {
    title: string;
    description: string;
    points?: string[];
  }[];
  keyBenefits: string[];
  recommendedPlan: PlanType;
  ctaText: string;
}

export const PosterArticleSlide: React.FC<PosterArticleSlideProps> = ({ onStartWithPlan }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: SlideData[] = [
    {
      id: 'direct-refer-earn',
      badge: '01 · डायरेक्ट रेफरल (Direct Refer & Earn)',
      navTitle: '⚡ डायरेक्ट पेआउट ₹65/₹365/₹765',
      posterTitle: 'डायरेक्ट रेफरल पर भारी इंस्टेंट पेआउट',
      posterSubtitle: 'अब बिना लेवल के झंझट के भी सीधे रेफर करें और तुरंत कमाएं!',
      posterHighlight: '₹100 पर ₹65 · ₹500 पर ₹365 · ₹1000 पर ₹765',
      posterBgGradient: 'from-[#2874f0] via-blue-900 to-indigo-950',
      articleTitle: 'डायरेक्ट रेफर एंड अर्न सिस्टम की पूरी जानकारी',
      articleLead:
        'FRESH MONEY EARN (FME) लाया है डायरेक्ट अर्निंग का सबसे हाई-मार्जिन मॉडल। यदि आप टीम नहीं बनाना चाहते और केवल डायरेक्ट रेफर करना चाहते हैं, तो भी आप पहले दिन से मोटी कमाई कर सकते हैं।',
      articleSections: [
        {
          title: '🔥 प्रत्येक प्लान पर मिलने वाला डायरेक्ट पेआउट:',
          description: 'जब कोई आपकी स्पॉन्सर आईडी से जॉइन करता है, तो एडमिन सत्यापन के बाद तुरंत:',
          points: [
            '₹100 प्लान शेयर करने पर: ₹65 का इंस्टेंट पेआउट',
            '₹500 प्लान शेयर करने पर: ₹365 का इंस्टेंट पेआउट',
            '₹1000 प्लान शेयर करने पर: ₹765 का महा-पेआउट',
          ],
        },
        {
          title: '💡 कोई भी प्लान चुनें, किसी भी प्लान में रेफर करें',
          description:
            'आप ₹100 वाले बेसिक प्लान पर रहकर भी ₹500 या ₹1000 वाले प्लान को रेफर कर सकते हैं और पूरा ₹365 या ₹765 कमीशन प्राप्त कर सकते हैं।',
        },
      ],
      keyBenefits: [
        'एडमिन सत्यापन के बाद तुरंत वॉलेट में क्रेडिट',
        'न्यूनतम ₹50 का आसान विड्रॉल सीधा PhonePe/GPay में',
        '100% पारदर्शी और नो-हिडन-चार्ज नियम',
        'साथ में 3 LEVEL टीम पैसिव इनकम का दोहरा लाभ',
      ],
      recommendedPlan: '500',
      ctaText: 'अभी ₹500 से शुरुआत करें (₹365 पेआउट)',
    },
    {
      id: 'digital-id-cards',
      badge: '02 · डिजिटल पहचान पत्र (Digital ID Cards)',
      navTitle: '🪪 पर्सनलाइज्ड डिजिटल ID कार्ड्स',
      posterTitle: 'प्लान के अनुसार अलग-अलग डिजिटल ID कार्ड',
      posterSubtitle: '₹100 नॉर्मल · ₹500 प्लेटिनम · ₹1000 रॉयल क्राउन VIP!',
      posterHighlight: 'गोल्डन नेमप्लेट · प्रीमियम प्रोफाइल फ्रेम्स',
      posterBgGradient: 'from-amber-950 via-yellow-950 to-slate-950',
      articleTitle: 'भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल डिजिटल ID कार्ड',
      articleLead:
        'प्रत्येक पंजीकृत सदस्य को उनके चुने गए प्लान के अनुसार एक आधिकारिक, सत्यापित डिजिटल पहचान पत्र (Digital ID Card) मिलता है, जिसे सार्वजनिक या निजी रखा जा सकता है।',
      articleSections: [
        {
          title: '🪪 तीन विशिष्ट कार्ड कैटेगरीज:',
          description: 'प्लान के स्तर के आधार पर विशेष डिजाइन और सुविधाएं:',
          points: [
            '₹100 प्लान: नॉर्मल मस्त लुक डिजिटल ID कार्ड, ऑफिशियल वेरिफिकेशन चिप',
            '₹500 प्लान: प्लेटिनम मेंबरशिप मेटैलिक कार्ड, होलोग्राम व कस्टम एनालिटिक्स बैज',
            '₹1000 प्लान: रॉयल क्राउन गोल्ड ID कार्ड, 3D क्राउन बैज व गोल्डन नेमप्लेट डिजाइन',
          ],
        },
        {
          title: '🔒 प्राइवेसी व नंबर मास्किंग सुरक्षा',
          description:
            'यूज़र अपने कार्ड को पब्लिक या प्राइवेट रख सकते हैं। पब्लिक मोड में भी मोबाइल नंबर डिफ़ॉल्ट रूप से मास्क (88****0845) रहता है, जिसे यूज़र अपनी मर्ज़ी से बदल सकते हैं।',
        },
      ],
      keyBenefits: [
        'डाउनलोड व प्रिंट करने योग्य हाई-रेजोल्यूशन कार्ड',
        'प्रीमियम प्रोफाइल फ्रेम चयन (Crown Gold, Platinum Diamond, Cyber)',
        'यूनिक FME आईडी व क्यूआर कोड वेरिफिकेशन',
        'स्पॉन्सर लिंक से कोई भी सदस्य का सत्यापित कार्ड देख सकता है',
      ],
      recommendedPlan: '1000',
      ctaText: 'रॉयल क्राउन ₹1000 VIP कार्ड लें',
    },
    {
      id: 'payment-gateway',
      badge: '03 · सुरक्षित पेमेंट (Official Payment Gateway)',
      navTitle: '💳 UPI & Stripe गेटवे',
      posterTitle: 'आधिकारिक UPI व Stripe सुरक्षित भुगतान',
      posterSubtitle: `आधिकारिक UPI: ${OFFICIAL_UPI_ID} (${OFFICIAL_UPI_NAME})`,
      posterHighlight: '1-क्लिक PhonePe/GPay · Stripe 256-Bit SSL',
      posterBgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
      articleTitle: 'सुरक्षित पेमेंट सिस्टम और इंस्टेंट थैंक यू पेज',
      articleLead:
        'वेबसाइट में एक पूरी तरह सुरक्षित और आधुनिक पेमेंट गेटवे सिस्टम एकीकृत किया गया है, जहाँ से PhonePe, Google Pay, Paytm या Stripe क्रेडिट/डेबिट कार्ड से सीधा भुगतान किया जा सकता है।',
      articleSections: [
        {
          title: '🛡️ सीधे एडमिन UPI पर सुरक्षित भुगतान',
          description: `पेमेंट सीधे विकास कुमार के आधिकारिक UPI ID: ${OFFICIAL_UPI_ID} पर सुरक्षित जमा होता है।`,
          points: [
            'डायनामिक क्यूआर कोड स्कैन करके भुगतान करने की सुविधा',
            'मोबाइल पर PhonePe, Google Pay व Paytm का 1-क्लिक पे बटन',
            'Stripe ऑनलाइन 256-Bit SSL एन्क्रिप्टेड कार्ड पेमेंट ऑप्शन',
          ],
        },
        {
          title: '🎉 भुगतान के बाद तत्काल थैंक यू स्क्रीन',
          description:
            'सफल भुगतान के बाद यूज़र को ऑर्डर रसीद सारांश, यूनिक FME आईडी, ट्रांजेक्शन रेफरेंस और डिजिटल ID कार्ड प्रीव्यू के साथ समर्पित थैंक यू पेज प्रदर्शित होता है।',
        },
      ],
      keyBenefits: [
        'एडमिन द्वारा त्वरित स्क्रीनशॉट सत्यापन व खाता सक्रियण',
        'अस्वीकृत होने पर स्पष्ट कारण सहित पुनः अपलोड की सुविधा',
        'न्यूनतम ₹50 का दैनिक विड्रॉल सीधा बैंक/UPI में',
        'संपूर्ण ट्रांजेक्शन इतिहास डैशबोर्ड में सुरक्षित',
      ],
      recommendedPlan: '100',
      ctaText: 'शुरू करें मात्र ₹100 से',
    },
    {
      id: 'admin-private-chat',
      badge: '04 · व्यक्तिगत मेंटरशिप (Personal Guide & Chat)',
      navTitle: '💬 1-on-1 एडमिन प्राइवेट चैट',
      posterTitle: 'एडमिन विकास कुमार से 1-on-1 व्यक्तिगत मार्गदर्शन',
      posterSubtitle: 'डैशबोर्ड से सीधे एडमिन के साथ प्राइवेट चैट करें और व्यक्तिगत टिप्स पाएं!',
      posterHighlight: 'सीधी चैट · क्विक सुझाव · 24/7 सहायता',
      posterBgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
      articleTitle: 'व्यक्तिगत गाइड और इन-ऐप प्राइवेट चैट सुविधा',
      articleLead:
        'अक्सर नई शुरुआत करने वालों को टीम बनाने, लिंक शेयर करने या विड्रॉल लगाने में मार्गदर्शन की आवश्यकता होती है। FME में आपको सीधे एडमिन से बात करने का व्यक्तिगत चैट रूम मिलता है।',
      articleSections: [
        {
          title: '🤝 हर सदस्य के लिए व्यक्तिगत मेंटरशिप',
          description:
            'डैशबोर्ड में "एडमिन गाइड चैट" बटन पर क्लिक करके आप सीधे एडमिन को संदेश भेज सकते हैं, सवाल पूछ सकते हैं और कमाई बढ़ाने के टिप्स प्राप्त कर सकते हैं।',
        },
        {
          title: '📢 एडमिन ब्रॉडकास्ट नोटिफिकेशन सेंटर',
          description:
            'एडमिन एक ही क्लिक में सभी सदस्यों को नए ऑफर्स, पेआउट अपडेट्स और महत्वपूर्ण घोषणाएं ब्रॉडकास्ट कर सकते हैं, जो नोटिफिकेशन बेल में तुरंत दिखाई देती हैं।',
        },
      ],
      keyBenefits: [
        'पूर्ण गोपनीयता — किसी अन्य सदस्य को आपकी बातचीत नहीं दिखती',
        'क्विक रेडीमेड प्रश्न ताकि टाइप करने में समय न लगे',
        'कमीशन क्रेडिट होने पर तुरंत इन-ऐप नोटिफिकेशन अलर्ट',
        'एडमिन मास्टर कंट्रोल से सभी समस्याओं का त्वरित समाधान',
      ],
      recommendedPlan: '500',
      ctaText: 'प्लेटिनम ₹500 मेंबरशिप से जुड़ें',
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, slides.length]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <section id="what-is-fme-poster" className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 pt-2">
      {/* Flipkart Style Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2874f0]/10 dark:bg-blue-950/80 text-[#2874f0] dark:text-blue-300 text-xs font-black uppercase tracking-wider border border-[#2874f0]/20 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
          <span>FME विज़िटर गाइड · इस पेज पर क्या-क्या मिलेगा?</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          जानिए FRESH MONEY EARN (FME) के सभी प्रीमियम फीचर्स
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          फ्लिपकार्ट-स्टाइल प्रमोशनल शोकेस — जानिए डायरेक्ट रेफरल पेआउट (₹65/₹365/₹765), डिजिटल ID कार्ड्स, UPI व Stripe गेटवे और 1-on-1 एडमिन गाइड के बारे में।
        </p>
      </div>

      {/* Slide Navigation Pill Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setCurrentSlideIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#2874f0] text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40 scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{s.navTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Slide Card Container */}
      <div
        className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Top Mini Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-[#2874f0]">
              फीचर {currentSlideIndex + 1} / {slides.length}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
              {currentSlide.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAutoPlaying ? 'स्लाइड रोकें' : 'स्लाइड चलाएं'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content: Poster Left + Article Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* 🌟 LEFT: POSTER CARD (5 Cols) */}
          <div
            className={`lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br ${currentSlide.posterBgGradient} text-white flex flex-col justify-between relative overflow-hidden`}
          >
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentSlide.badge}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  {currentSlide.posterTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentSlide.posterSubtitle}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 shadow-inner">
                <div className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest">
                  मुख्य लाभ (Highlight)
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">
                  {currentSlide.posterHighlight}
                </div>
              </div>
            </div>

            {/* Poster Badges */}
            <div className="relative my-6 space-y-2.5">
              <div className="p-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">डायरेक्ट इंस्टेंट पेआउट्स</div>
                  <div className="text-[10px] text-slate-300">₹65, ₹365 और ₹765 तुरंत क्रेडिट</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">रॉयल क्राउन & प्लेटिनम ID कार्ड</div>
                  <div className="text-[10px] text-slate-300">कानूनी मान्य व सुरक्षा मास्किंग युक्त</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">आधिकारिक UPI & Stripe</div>
                  <div className="text-[10px] text-slate-300">{OFFICIAL_UPI_ID} (विकास कुमार)</div>
                </div>
              </div>
            </div>

            <div className="relative pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1 font-bold">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>FRESH MONEY EARN (FME)</span>
              </span>
              <span className="font-mono font-bold text-yellow-300">FME Assured</span>
            </div>
          </div>

          {/* 📖 RIGHT: ARTICLE CONTENT (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {currentSlide.articleTitle}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {currentSlide.articleLead}
                </p>
              </div>

              <div className="space-y-3.5">
                {currentSlide.articleSections.map((sec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {sec.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sec.description}
                    </p>
                    {sec.points && (
                      <div className="mt-2 space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        {sec.points.map((pt, pIdx) => (
                          <div
                            key={pIdx}
                            className="text-xs font-semibold text-[#2874f0] dark:text-blue-400 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2874f0] shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  मुख्य विशेषताएं:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSlide.keyBenefits.map((benefit, bIdx) => (
                    <div
                      key={bIdx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-blue-200/60 dark:border-blue-900/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2874f0] dark:text-blue-400 shrink-0" />
                      <span className="truncate">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                सुरक्षित UPI व कार्ड पेमेंट द्वारा तुरंत एक्टिवेशन।
              </div>

              <button
                type="button"
                onClick={() => onStartWithPlan(currentSlide.recommendedPlan)}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-[#fb641b] hover:bg-[#e85813] active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
            <div
              key={currentSlideIndex}
              className="h-full bg-[#2874f0]"
              style={{
                width: '100%',
                animation: 'progress 7s linear infinite',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};
