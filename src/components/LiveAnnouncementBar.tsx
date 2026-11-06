import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Sparkles,
  ChevronRight,
  X,
  Pause,
  Play,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import { getSystemSettings } from '../services/fmeService';
import { OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';

interface LiveAnnouncementBarProps {
  onOpenPlans?: () => void;
  onOpenPublicCard?: () => void;
  onOpenModal?: (type: 'govt' | 'guide' | 'about') => void;
}

interface AnnouncementItem {
  id: string;
  tag: string;
  text: string;
  actionText?: string;
  actionType?: 'plans' | 'govt' | 'card';
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    tag: '🔥 धमाकेदार कमाई',
    text: 'FRESH MONEY EARN: ₹100 प्लान शेयर करने पर ₹65, ₹500 पर ₹365 और ₹1000 पर ₹765 इंस्टेंट डायरेक्ट पेआउट!',
    actionText: 'प्लान्स देखें',
    actionType: 'plans',
  },
  {
    id: 'ann-2',
    tag: '⚖️ 100% वैध',
    text: 'भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल: हर यूज़र को यूनिक स्पॉन्सर आईडी और प्रीमियम डिजिटल ID कार्ड प्राप्त होगा।',
    actionText: 'गवर्नमेंट रूल्स',
    actionType: 'govt',
  },
  {
    id: 'ann-3',
    tag: '💳 सुरक्षित UPI',
    text: `आधिकारिक पेमेंट UPI: ${OFFICIAL_UPI_ID} (${OFFICIAL_UPI_NAME}) - भुगतान के बाद तुरंत डिजिटल रसीद अपलोड करें।`,
    actionText: 'सत्यापन',
    actionType: 'plans',
  },
  {
    id: 'ann-4',
    tag: '🏆 टॉप 10 लीडरबोर्ड',
    text: 'ऑल-इंडिया चैंपियंस लीडरबोर्ड लाइव है! ज्यादा से ज्यादा डायरेक्ट रेफ़रल जोड़ें और हॉल ऑफ फेम में आएं।',
    actionText: 'ID कार्ड खोजें',
    actionType: 'card',
  },
  {
    id: 'ann-5',
    tag: '⚡ 3-LEVEL इनकम',
    text: 'L1, L2 और L3 पैसिव इनकम मॉडल: टीम बनाएं और घर बैठे जीवनभर 24x7 ऑटोमैटिक पेआउट प्राप्त करें।',
    actionText: 'सर्विस शुरू करें',
    actionType: 'plans',
  },
];

export const LiveAnnouncementBar: React.FC<LiveAnnouncementBarProps> = ({
  onOpenPlans,
  onOpenPublicCard,
  onOpenModal,
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'very-slow'>('very-slow'); // Default: dhimi gati (very-slow)

  // Fetch dynamic system settings notice set by Admin in real-time
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const settings = await getSystemSettings();
        if (settings?.notice && settings.notice.trim()) {
          setAnnouncements((prev) => [
            {
              id: 'ann-admin',
              tag: '📢 एडमिन आधिकारिक सूचना',
              text: settings.notice.trim(),
              actionText: 'प्लान्स',
              actionType: 'plans',
            },
            ...prev.filter((a) => a.id !== 'ann-admin'),
          ]);
        }
      } catch (e) {
        // fallback to default
      }
    };

    fetchNotice();
  }, []);

  if (isDismissed) return null;

  const handleAction = (item: AnnouncementItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.actionType) return;
    if (item.actionType === 'plans' && onOpenPlans) {
      onOpenPlans();
    } else if (item.actionType === 'govt' && onOpenModal) {
      onOpenModal('govt');
    } else if (item.actionType === 'card' && onOpenPublicCard) {
      onOpenPublicCard();
    }
  };

  // Duplicate list so continuous scroll loops seamlessly without gaps
  const marqueeItems = [...announcements, ...announcements];

  return (
    <div
      role="region"
      aria-label="लाइव सूचना व वेब जानकारी"
      className="relative z-50 bg-gradient-to-r from-slate-950 via-[#101e44] to-slate-950 text-white border-b border-yellow-400/40 text-xs shadow-md overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center h-10 sm:h-11 px-2 sm:px-4">
        {/* Left Fixed Badge: Pulsing LIVE Broadcast Indicator */}
        <div className="flex items-center gap-2 shrink-0 z-20 bg-gradient-to-r from-slate-950 via-slate-950/95 to-transparent pr-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs ring-2 ring-rose-400/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
            </span>
            <span className="hidden sm:inline">LIVE ANNOUNCEMENT</span>
            <span className="sm:hidden">LIVE</span>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
            <Megaphone className="w-3 h-3 text-yellow-400" />
            <span>धीमी गति लाइव प्रसारण</span>
          </span>
        </div>

        {/* Center: CONTINUOUS SLOW MARQUEE TICKER (धीमी गति में चलने वाली पट्टी) */}
        <div className="flex-1 overflow-hidden relative mx-2">
          {/* Subtle gradient fades on left and right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div
            className={`flex items-center whitespace-nowrap animate-marquee-slow ${
              speed === 'very-slow' ? 'speed-slow' : 'speed-normal'
            } ${isPaused ? 'pause-animation' : ''}`}
            style={{
              animationDuration: speed === 'very-slow' ? '65s' : '45s',
            }}
          >
            {marqueeItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2.5 mx-6 text-[11px] sm:text-xs text-slate-100 font-medium cursor-default group"
              >
                {/* Yellow Category Tag */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ffe11b] text-slate-950 uppercase shadow-xs shrink-0">
                  {item.tag}
                </span>

                {/* Main Announcement Text */}
                <span className="text-white font-semibold tracking-wide drop-shadow-xs group-hover:text-yellow-300 transition-colors">
                  {item.text}
                </span>

                {/* Clickable Quick Action Link */}
                {item.actionText && (
                  <button
                    type="button"
                    onClick={(e) => handleAction(item, e)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 hover:bg-[#ffe11b] hover:text-slate-950 text-yellow-300 font-black text-[10px] border border-yellow-400/50 transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>{item.actionText}</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Shimmering Diamond Separator */}
                <span className="text-yellow-400/80 font-black ml-4 select-none">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Fixed Controls: Speed Toggle, Pause/Play, Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0 z-20 bg-gradient-to-l from-slate-950 via-slate-950/95 to-transparent pl-3">
          {/* Speed Toggle (धीमी / सामान्य गति) */}
          <button
            type="button"
            onClick={() => setSpeed(speed === 'very-slow' ? 'slow' : 'very-slow')}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-yellow-300 font-black text-[10px] flex items-center gap-1 transition-all cursor-pointer border border-yellow-400/30"
            title={speed === 'very-slow' ? 'वर्तमान: धीमी गति (65s)' : 'वर्तमान: सामान्य गति (45s)'}
          >
            <span>{speed === 'very-slow' ? '🐢 धीमी गति' : '🚶 सामान्य'}</span>
          </button>

          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'अनाउंसमेंट चालू करें (Play)' : 'अनाउंसमेंट रोकें (Pause)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-300" />}
          </button>

          {/* Close Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="अनाउंसमेंट पट्टी छिपाएं"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
