import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Crown,
  Sparkles,
  Download,
  Share2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  QrCode,
  Copy,
  CheckCheck,
  Check,
} from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import { useToast } from './Toast';
import { FmeLogo, fmeOfficialLogoImage, getActiveLogoImage } from './FmeLogo';

interface DigitalIdCardProps {
  user: UserProfile;
  isOwner?: boolean;
  onUpdatePrivacy?: (privacy: {
    isPublic: boolean;
    maskPhone: boolean;
    maskEmail: boolean;
    maskUpi: boolean;
  }) => void;
  onSelectFrame?: (frame: UserProfile['avatarFrame']) => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  user,
  isOwner = false,
  onUpdatePrivacy,
  onSelectFrame,
}) => {
  const { showToast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: user.cardPrivacy?.isPublic ?? true,
    maskPhone: user.cardPrivacy?.maskPhone ?? true,
    maskEmail: user.cardPrivacy?.maskEmail ?? false,
    maskUpi: user.cardPrivacy?.maskUpi ?? false,
  });

  const [hologramLogo, setHologramLogo] = useState<string>(() => getActiveLogoImage());

  React.useEffect(() => {
    const updateLogo = () => setHologramLogo(getActiveLogoImage());
    window.addEventListener('fme_logo_changed', updateLogo);
    return () => window.removeEventListener('fme_logo_changed', updateLogo);
  }, []);

  const cardPlan: PlanType = user.plan || '100';

  const maskString = (str: string, showStart = 2, showEnd = 2) => {
    if (!str || str.length <= showStart + showEnd) return '******';
    const start = str.slice(0, showStart);
    const end = str.slice(-showEnd);
    const masked = '*'.repeat(Math.max(4, str.length - (showStart + showEnd)));
    return `${start}${masked}${end}`;
  };

  const handleTogglePublic = () => {
    const updated = { ...privacySettings, isPublic: !privacySettings.isPublic };
    setPrivacySettings(updated);
    if (onUpdatePrivacy) onUpdatePrivacy(updated);
    showToast(
      updated.isPublic ? 'कार्ड पब्लिक किया गया' : 'कार्ड प्राइवेट किया गया',
      updated.isPublic ? 'अब कोई भी आपकी स्पॉन्सर आईडी से कार्ड देख सकता है।' : 'कार्ड केवल आपके लिए दृश्यमान रहेगा।',
      'success'
    );
  };

  const handleToggleMaskPhone = () => {
    const updated = { ...privacySettings, maskPhone: !privacySettings.maskPhone };
    setPrivacySettings(updated);
    if (onUpdatePrivacy) onUpdatePrivacy(updated);
    showToast(
      updated.maskPhone ? 'फोन नंबर मास्क किया गया' : 'फोन नंबर दिखाया गया',
      updated.maskPhone ? 'पब्लिक में नंबर सुरक्षित रहेगा।' : 'पब्लिक में पूरा नंबर दिखेगा।',
      'info'
    );
  };

  const handleCopyCardLink = () => {
    const link = `${window.location.origin}/?card=${user.userId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('डिजिटल ID कार्ड लिंक कॉपी हुआ!', link, 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintCard = () => {
    window.print();
  };

  // Card Theme configurations based on Plan: ₹100 Normal, ₹500 Platinum, ₹1000 Royal Crown
  const isCrown1000 = cardPlan === '1000';
  const isPlatinum500 = cardPlan === '500';

  // Frame styling for avatar
  const frameClass =
    user.avatarFrame === 'crown_gold' || (isCrown1000 && !user.avatarFrame)
      ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-amber-500/50'
      : user.avatarFrame === 'platinum_diamond' || (isPlatinum500 && !user.avatarFrame)
      ? 'ring-4 ring-cyan-300 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-cyan-400/40'
      : user.avatarFrame === 'cyber_emerald'
      ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-emerald-500/40'
      : 'ring-2 ring-slate-300 ring-offset-1 ring-offset-slate-900';

  const displayPhone =
    isOwner && !privacySettings.maskPhone
      ? user.whatsapp
      : privacySettings.maskPhone
      ? maskString(user.whatsapp, 3, 2)
      : user.whatsapp;

  const displayEmail =
    isOwner && !privacySettings.maskEmail
      ? user.email
      : privacySettings.maskEmail
      ? maskString(user.email, 2, 4)
      : user.email;

  const displayUpi =
    isOwner && !privacySettings.maskUpi
      ? user.upiId
      : privacySettings.maskUpi
      ? maskString(user.upiId, 2, 3)
      : user.upiId;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* 🪪 PHYSICAL-LOOKING DIGITAL ID CARD CONTAINER */}
      <div
        id="fme-digital-id-card"
        className={`relative rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden transition-all duration-300 border ${
          isCrown1000
            ? 'bg-gradient-to-br from-amber-950 via-yellow-900 to-slate-950 border-amber-400/70 shadow-amber-900/40'
            : isPlatinum500
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border-cyan-400/60 shadow-cyan-950/50'
            : 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border-emerald-400/50 shadow-emerald-950/40'
        }`}
      >
        {/* Holographic / Metallic Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        {/* 🌟 Official FME Luxury Watermark embedded inside ID Card */}
        <FmeLogo variant="watermark" className="opacity-15 dark:opacity-20 scale-90 pointer-events-none" />

        {/* 🔒 LOCKED CARD OVERLAY (Active only when user is pending approval) */}
        {user.planStatus !== 'active' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                🔒 सत्यापन प्रतीक्षारत - LOCKED ID CARD
              </div>
              <div className="text-sm font-black text-white">
                डिजिटल आईडी कार्ड अभी लॉक है
              </div>
              <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">
                एडमिन द्वारा पेमेंट सत्यापित होने के बाद आपका आधिकारिक डिजिटल कार्ड व डाउनलोड अनलॉक हो जाएगा। तब तक आप अपना प्रमोशन पोस्टर व रेफ़रल लिंक शेयर करके टीम बना सकते हैं।
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
              <span>आपकी FME ID:</span>
              <span className="font-mono font-black">{user.userId}</span>
            </div>
          </div>
        )}

        {/* Card Header: Brand Logo & Membership Tier Badge */}
        <div className="relative flex items-center justify-between pb-4 border-b border-white/15">
          <FmeLogo variant="id-card" />

          <div className="text-right">
            {isCrown1000 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Crown className="w-3 h-3 fill-slate-950" />
                <span>रॉयल क्राउन VIP</span>
              </span>
            ) : isPlatinum500 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>प्लेटिनम मेंबर</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>सत्यापित ID</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body: Profile Picture with Premium Frame & Golden Nameplate */}
        <div className="relative my-5 flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={user.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              className={`w-20 h-20 rounded-2xl object-cover transition-transform ${frameClass}`}
            />
            {isCrown1000 && (
              <div className="absolute -top-3 -right-2 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md animate-bounce">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            {/* Golden Nameplate for ₹1000 Crown, Platinum Header for ₹500 */}
            {isCrown1000 ? (
              <div className="p-1.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-slate-950 shadow-md">
                <div className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center justify-between">
                  <span>👑 VIP CROWN MEMBER</span>
                  <span className="text-[9px] font-mono font-black">₹1000</span>
                </div>
                <div className="text-sm font-black truncate">{user.name}</div>
              </div>
            ) : isPlatinum500 ? (
              <div className="p-1.5 rounded-xl bg-gradient-to-r from-slate-200 via-cyan-100 to-slate-200 text-slate-950 shadow-md">
                <div className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                  <span>💎 PLATINUM MEMBER</span>
                  <span className="text-[9px] font-mono font-black">₹500</span>
                </div>
                <div className="text-sm font-black truncate">{user.name}</div>
              </div>
            ) : (
              <div>
                <div className="text-base font-black text-white truncate">{user.name}</div>
                <div className="text-[11px] text-emerald-300 font-semibold">नॉर्मल मेंबर (₹100 प्लान)</div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="text-white/70">आईडी:</span>
              <span className="font-mono font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded tracking-wider">
                {user.userId}
              </span>
            </div>
            <div className="text-[11px] text-white/60">@{user.username}</div>
          </div>
        </div>

        {/* Detailed Verification Matrix */}
        <div className="relative p-3.5 rounded-2xl bg-black/35 backdrop-blur-xs border border-white/10 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center py-0.5 border-b border-white/5">
            <span className="text-white/60 text-[11px]">स्पॉन्सर FME ID:</span>
            <span className="font-bold text-amber-300">{user.sponsorId || 'FME_ADMIN'}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-white/5">
            <span className="text-white/60 text-[11px]">WhatsApp:</span>
            <span className="font-bold flex items-center gap-1">
              <span>{displayPhone}</span>
              {privacySettings.maskPhone && <Lock className="w-3 h-3 text-amber-400" />}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-white/5">
            <span className="text-white/60 text-[11px]">UPI पेआउट:</span>
            <span className="font-bold text-white/90">{displayUpi}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-white/60 text-[11px]">अकाउंट स्थिति:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                user.planStatus === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {user.planStatus === 'active' ? '✓ सक्रिय (ACTIVE)' : 'सत्यापन में (PENDING)'}
            </span>
          </div>
        </div>

        {/* 🛡️ Official Security Watermark Hologram */}
        <div className="absolute right-3 bottom-12 w-28 h-28 opacity-20 pointer-events-none rounded-full overflow-hidden select-none mix-blend-screen filter drop-shadow-md">
          <img
            src={hologramLogo}
            alt="FME Hologram Security Seal"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card Footer: Micro QR & Official Seal */}
        <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                  `${window.location.origin}/?ref=${user.userId}`
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider">डिजिटल पहचान पत्र</div>
              <div className="text-white/50">सत्यापित एफिलिएट सदस्य</div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-amber-300 font-bold">₹{user.plan} PLAN</div>
            <div className="text-[9px] text-white/50">सुरक्षित व कानूनी वैध</div>
          </div>
        </div>
      </div>

      {/* 🛠️ OWNER PRIVACY & ACTION CONTROLS */}
      {isOwner && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>डिजिटल ID कार्ड सुरक्षा & प्राइवेसी सेटिंग्स</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              कंट्रोल
            </span>
          </div>

          {/* Privacy Toggles */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleTogglePublic}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                privacySettings.isPublic
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold">कार्ड दृश्यता:</span>
              <span className="flex items-center gap-1 text-[11px] font-black">
                {privacySettings.isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{privacySettings.isPublic ? 'पब्लिक' : 'प्राइवेट'}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleMaskPhone}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                privacySettings.maskPhone
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold">नंबर मास्क:</span>
              <span className="flex items-center gap-1 text-[11px] font-black">
                {privacySettings.maskPhone ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{privacySettings.maskPhone ? 'मास्क (ON)' : 'दिखाएं (OFF)'}</span>
              </span>
            </button>
          </div>

          {/* Action Buttons: Download & Copy Card Link */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyCardLink}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'कार्ड लिंक कॉपी हुआ' : 'कार्ड लिंक कॉपी करें'}</span>
            </button>

            <button
              type="button"
              disabled={user.planStatus !== 'active'}
              onClick={handlePrintCard}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs ${
                user.planStatus === 'active'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              }`}
              title={
                user.planStatus === 'active'
                  ? 'डाउनलोड / प्रिंट करें'
                  : '🔒 एडमिन वेरिफिकेशन के बाद डाउनलोड उपलब्ध होगा'
              }
            >
              {user.planStatus === 'active' ? (
                <Download className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{user.planStatus === 'active' ? 'डाउनलोड / प्रिंट' : '🔒 कार्ड लॉक है'}</span>
            </button>
          </div>

          {/* Premium Avatar Frame Selector */}
          {onSelectFrame && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                प्रीमियम प्रोफाइल फ्रेम चुनें (Avatar Frame):
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectFrame('crown_gold')}
                  className={`p-1.5 rounded-lg border text-center text-[10px] font-bold cursor-pointer transition-all ${
                    user.avatarFrame === 'crown_gold'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  👑 गोल्ड क्राउन
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFrame('platinum_diamond')}
                  className={`p-1.5 rounded-lg border text-center text-[10px] font-bold cursor-pointer transition-all ${
                    user.avatarFrame === 'platinum_diamond'
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-900 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  💎 प्लेटिनम
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFrame('cyber_emerald')}
                  className={`p-1.5 rounded-lg border text-center text-[10px] font-bold cursor-pointer transition-all ${
                    user.avatarFrame === 'cyber_emerald'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  ⚡ एमराल्ड
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFrame('silver_classic')}
                  className={`p-1.5 rounded-lg border text-center text-[10px] font-bold cursor-pointer transition-all ${
                    user.avatarFrame === 'silver_classic'
                      ? 'border-slate-400 bg-slate-100 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🛡️ क्लासिक
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
