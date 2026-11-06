import React, { useState, useEffect } from 'react';
import fmeLogoOption1 from '../assets/images/fme_logo_option1_monogram_1793940409619.jpg';
import fmeLogoOption2 from '../assets/images/fme_logo_option2_shield_1793940410296.jpg';
import fmeLogoOption3 from '../assets/images/fme_logo_option3_coin_1793940410796.jpg';
import { Sparkles, ShieldCheck, Crown } from 'lucide-react';

export const FME_LOGO_OPTIONS = [
  {
    id: 'option1',
    name: 'Option 1: FME इंटरवाइंड मनी ग्रोथ मोनोग्राम (अनुशंसित / Recommended)',
    desc: 'F, M और E लेटर्स का आपस में जुड़ा 3D लक्ज़री डिज़ाइन, जिसमें गोल्डन वेल्थ ग्रोथ एरो और मेटैलिक ₹ (रुपये) सिंबल एकीकृत है।',
    image: fmeLogoOption1,
    tag: 'सर्वश्रेष्ठ & आधुनिक',
    bestFor: 'सभी मोबाइल, टैबलेट, डिजिटल ID कार्ड एवं पोस्टर्स के लिए बिल्कुल उपयुक्त',
  },
  {
    id: 'option2',
    name: 'Option 2: रॉयल FME वेल्थ शील्ड (Royal Wealth Shield)',
    desc: 'एमराल्ड ग्रीन व 24k गोल्ड फिनिश में लक्ज़री शील्ड, इंटरलॉकिंग FME लेटर्स और ऊपर उठती ग्रोथ लाइन।',
    image: fmeLogoOption2,
    tag: 'रॉयल सिक्योरिटी',
    bestFor: 'आईडी कार्ड सील एवं सरकारी सर्टिफिकेशन लुक',
  },
  {
    id: 'option3',
    name: 'Option 3: 3D गोल्ड & एमराल्ड मेडलियन (Gold Medallion)',
    desc: 'शाही राउंड मेडलियन में FME मिक्स लेटर्स, प्रॉफिट कैंडलस्टिक्स और डायमंड ₹ प्रतीक।',
    image: fmeLogoOption3,
    tag: 'क्लासिक वेल्थ',
    bestFor: 'वेबसाइट एंबलम एवं वीआईपी बैज',
  },
];

// Helper to get active logo image
export function getActiveLogoImage(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('fme_selected_logo_id');
    const found = FME_LOGO_OPTIONS.find((opt) => opt.id === saved);
    if (found) return found.image;
  }
  return fmeLogoOption1; // Default to Option 1
}

// Active default logo
export const fmeOfficialLogoImage = fmeLogoOption1;

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type LogoVariant = 'icon' | 'horizontal' | 'vertical' | 'id-card' | 'watermark' | 'poster-badge';

interface FmeLogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  showTagline?: boolean;
  className?: string;
  withGlow?: boolean;
  alt?: string;
  forcedImage?: string;
}

const SIZE_MAP: Record<LogoSize, { img: string; text: string; sub: string }> = {
  xs: { img: 'w-6 h-6', text: 'text-xs', sub: 'text-[9px]' },
  sm: { img: 'w-8 h-8', text: 'text-sm', sub: 'text-[10px]' },
  md: { img: 'w-10 h-10 sm:w-11 sm:h-11', text: 'text-base sm:text-lg', sub: 'text-[11px]' },
  lg: { img: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
  xl: { img: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-2xl sm:text-3xl', sub: 'text-sm' },
  '2xl': { img: 'w-28 h-28 sm:w-32 sm:h-32', text: 'text-3xl sm:text-4xl', sub: 'text-base' },
};

export const FmeLogo: React.FC<FmeLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showTagline = true,
  className = '',
  withGlow = true,
  alt = 'FRESH MONEY EARN (FME) Official Brand Logo',
  forcedImage,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(forcedImage || getActiveLogoImage());

  useEffect(() => {
    if (forcedImage) {
      setLogoSrc(forcedImage);
      return;
    }
    const updateLogo = () => setLogoSrc(getActiveLogoImage());
    window.addEventListener('fme_logo_changed', updateLogo);
    return () => window.removeEventListener('fme_logo_changed', updateLogo);
  }, [forcedImage]);

  const sizeConfig = SIZE_MAP[size];

  // 1. Watermark Variant (Used as background watermark behind Digital ID Card, Posters, Dashboard)
  if (variant === 'watermark') {
    return (
      <div
        className={`pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <img
          src={logoSrc}
          alt=""
          className="w-4/5 max-w-[420px] object-contain opacity-10 dark:opacity-15 mix-blend-screen scale-110 blur-[0.4px] contrast-125"
        />
      </div>
    );
  }

  // Standalone Emblem Icon
  const emblem = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-xl transition-transform ${
        withGlow ? 'shadow-amber-500/30 ring-2 ring-yellow-400/70' : 'border border-amber-400/50'
      } ${sizeConfig.img} ${className}`}
    >
      <img
        src={logoSrc}
        alt={alt}
        className="w-full h-full object-cover object-center scale-102"
        loading="eager"
      />
      {/* Metallic Specular Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
    </div>
  );

  // 2. Icon Only
  if (variant === 'icon') {
    return emblem;
  }

  // 3. Poster Badge (Special compact layout for high-converting promotional banners)
  if (variant === 'poster-badge') {
    return (
      <div className={`flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-black/60 backdrop-blur-md border border-amber-400/50 shadow-lg ${className}`}>
        <img
          src={logoSrc}
          alt={alt}
          className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-300"
        />
        <div className="flex flex-col text-left">
          <span className="font-black text-[11px] uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <Crown className="w-3 h-3 fill-amber-300 text-amber-300" />
            FRESH MONEY EARN
          </span>
          <span className="text-[9px] text-white/80 font-semibold font-mono">
            OFFICIAL PLATFORM
          </span>
        </div>
      </div>
    );
  }

  // 4. Digital ID Card Specific Luxury Badge
  if (variant === 'id-card') {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3.5 ${className}`}>
        <div className="relative shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-400 shadow-amber-500/40 bg-slate-950">
            <img
              src={logoSrc}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Animated active pulse pin */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border border-slate-950"></span>
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent drop-shadow-xs">
              FRESH MONEY EARN
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/25 text-yellow-300 font-mono font-black border border-amber-400/60 shadow-2xs">
              FME VIP
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-white/90 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
            <span>GOVT DIRECT SELLING COMPLIANT ID</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Vertical Stack (Emblem on top, text below)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-2.5 ${className}`}>
        {emblem}
        <div className="flex flex-col items-center">
          <span
            className={`font-black ${sizeConfig.text} tracking-tight uppercase italic drop-shadow-md bg-gradient-to-r from-white via-yellow-100 to-yellow-300 bg-clip-text text-transparent`}
          >
            FRESH MONEY EARN
          </span>
          {showTagline && (
            <div className={`flex items-center gap-1 font-bold text-yellow-300 ${sizeConfig.sub} mt-0.5`}>
              <span>Fast Service</span>
              <span className="text-white/60">|</span>
              <span className="text-amber-400 flex items-center gap-0.5">
                Lifetime Income <Sparkles className="w-3 h-3 fill-yellow-300 inline" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 6. Horizontal (Default Navbar & Flipkart Style)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {emblem}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black ${sizeConfig.text} tracking-tight text-white drop-shadow-xs italic`}
          >
            FRESH MONEY EARN
          </span>
        </div>
        {showTagline && (
          <div className={`flex items-center gap-1 font-bold text-yellow-300 ${sizeConfig.sub}`}>
            <span className="text-white/90">Explore</span>
            <span className="text-[#ffe11b] font-black underline flex items-center gap-0.5">
              Plus <Sparkles className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300 inline" />
            </span>
            <span className="text-white/80 text-[10px] hidden sm:inline ml-1 font-normal">
              | 3-LEVEL FAST SERVICE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
