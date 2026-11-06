import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCheck,
  Send,
  MessageSquare,
  QrCode,
  Sparkles,
  Smartphone,
  ExternalLink,
  Flame,
  CheckCircle2,
  Share,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useToast } from './Toast';

interface SocialShareModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  referralLink: string;
}

type MessageTemplateId = 'full' | 'short' | 'english';

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  user,
  isOpen,
  onClose,
  referralLink,
}) => {
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateId>('full');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isOpen) return null;

  // Pre-filled dynamic messages
  const templates: Record<
    MessageTemplateId,
    { label: string; badge: string; text: string }
  > = {
    full: {
      label: '3-Level पूरा प्लान (Recommended)',
      badge: 'सबसे ज्यादा जॉइनिंग',
      text: `🔥 *FRESH MONEY EARN (FME) FAST INCOME SERVICE* 🔥\n\nआ गया पैसा कमाने के लिए ऑनलाइन का बेस्ट तरीका! अब कोई भी कमा सकता है कम समय में ज्यादा से ज्यादा पैसा।\n\n💼 *3 LEVEL तक पैसा कमाने का सुनहरा मौका:*\n\n1️⃣ *₹100 प्लान:* \n   • LEVEL-1: ₹30 प्रति मेंबर\n   • LEVEL-2: ₹10 प्रति मेंबर\n   • LEVEL-3: ₹5 प्रति मेंबर\n\n2️⃣ *₹500 प्लान:* \n   • LEVEL-1: ₹150 प्रति मेंबर\n   • LEVEL-2: ₹75 प्रति मेंबर\n   • LEVEL-3: ₹25 प्रति मेंबर\n\n3️⃣ *₹1000 प्लान:* \n   • LEVEL-1: ₹400 प्रति मेंबर\n   • LEVEL-2: ₹150 प्रति मेंबर\n   • LEVEL-3: ₹50 प्रति मेंबर\n\n✅ 100% सुरक्षित UPI पेआउट्स\n✅ तुरंत एक्टिवेशन & रियल-टाइम डैशबोर्ड\n\nमेरी स्पॉन्सर आईडी: *${user.userId}*\n\n👇 *नीचे दिए लिंक से अभी रजिस्टर करें और आज ही अपनी कमाई शुरू करें:* \n👉 ${referralLink}`,
    },
    short: {
      label: 'शॉर्ट स्टेटस / स्टोरी (Short & Direct)',
      badge: 'WhatsApp/Instagram Story',
      text: `⚡ *घर बैठे मोबाइल से रोज़ाना पैसे कमाएं!* ⚡\n\nFRESH MONEY EARN (FME) के 3-LEVEL प्लान से आज ही जुड़ें।\n\n💰 कम से कम ₹100 से सर्विस शुरू करें और लेवल 1 पर ₹400 तक डायरेक्ट कमाई पाएं।\n\n🔑 स्पॉन्सर आईडी: *${user.userId}*\n📲 रजिस्टर करने के लिए लिंक खोलें:\n👉 ${referralLink}`,
    },
    english: {
      label: 'English Professional Overview',
      badge: 'Professional',
      text: `🚀 *FRESH MONEY EARN (FME) - 3-TIER REFERRAL PROGRAM* 🚀\n\nStart earning online from anywhere with our secure 3-tier commission model!\n\n💡 *Flexible Starter Plans:*\n• ₹100 Plan: Earn up to ₹30 / ₹10 / ₹5 per referral\n• ₹500 Plan: Earn up to ₹150 / ₹75 / ₹25 per referral\n• ₹1000 Plan: Earn up to ₹400 / ₹150 / ₹50 per referral\n\n✨ Direct UPI Payouts & Transparent Dashboard.\n\nMy Sponsor FME ID: *${user.userId}*\nRegister now via my official link:\n👉 ${referralLink}`,
    },
  };

  const currentMessageText = templates[selectedTemplate].text;

  // WhatsApp Share with pre-filled message
  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(currentMessageText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
    showToast(
      'WhatsApp खोला गया!',
      'आपका प्री-फिल्ड रेफ़रल संदेश WhatsApp पर लोड हो गया है।',
      'success'
    );
  };

  // Telegram Share with pre-filled message
  const handleShareTelegram = () => {
    const encodedText = encodeURIComponent(currentMessageText);
    const encodedUrl = encodeURIComponent(referralLink);
    const url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    window.open(url, '_blank');
    showToast(
      'Telegram खोला गया!',
      'आपका प्री-फिल्ड संदेश Telegram पर शेयर करने के लिए तैयार है।',
      'success'
    );
  };

  // Native Web Share API (supports Instagram, WhatsApp, Telegram, SMS, etc. on mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FRESH MONEY EARN (FME) - रेफ़रल आमंत्रण',
          text: currentMessageText,
          url: referralLink,
        });
        showToast('सफलतापूर्वक शेयर किया गया!', 'आपका आमंत्रण शेयर हो गया है।', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyMessage();
        }
      }
    } else {
      handleCopyMessage();
    }
  };

  // Facebook Share
  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralLink
    )}&quote=${encodeURIComponent(currentMessageText)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  // X / Twitter Share
  const handleShareTwitter = () => {
    const text = `🔥 FRESH MONEY EARN (FME): Earn 3-Level income online! Join using my referral code: ${user.userId}\n👉 ${referralLink}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  // SMS Share
  const handleShareSMS = () => {
    const url = `sms:?body=${encodeURIComponent(currentMessageText)}`;
    window.open(url, '_self');
  };

  // Copy Complete Formatted Message
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopiedMessage(true);
    showToast(
      'पूरा संदेश कॉपी हो गया ✓',
      'प्री-फिल्ड रेफ़रल संदेश क्लिपबोर्ड में कॉपी हो गया है। इसे WhatsApp/Telegram पर पेस्ट करें।',
      'success'
    );
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Copy Link Only
  const handleCopyLinkOnly = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('रेफ़रल लिंक कॉपी हुआ ✓', referralLink, 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy Sponsor ID Only
  const handleCopySponsorCode = () => {
    navigator.clipboard.writeText(user.userId);
    setCopiedCode(true);
    showToast('FME स्पॉन्सर आईडी कॉपी हुई ✓', user.userId, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    referralLink
  )}&margin=10`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with vibrant MLM gradient */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Share2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black">
                    सोशल मीडिया पर शेयर करें (Share via Social)
                  </h2>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    3-Level
                  </span>
                </div>
                <p className="text-xs text-emerald-100">
                  ऑटो-जनरेटेड प्री-फिल्ड संदेश व अपने रेफ़रल लिंक से ज्यादा से ज्यादा लोगों को जोड़ें
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100">
          {/* Quick 1-Click Social Action Buttons */}
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>तुरंत 1-क्लिक शेयर करें (Instant 1-Click Share)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Telegram Primary Share Button */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] active:scale-95 text-white font-black text-xs shadow-md transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Telegram शेयर</div>
                  <div className="text-[9px] font-normal opacity-90">1-क्लिक शेयर</div>
                </div>
              </button>

              {/* Telegram Official Channel Join */}
              <a
                href="https://t.me/freshmoneyearn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#229ED9] hover:bg-[#1d8bc0] active:scale-95 text-white font-black text-xs shadow-md transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">FME Telegram</div>
                  <div className="text-[9px] font-normal opacity-90">ऑफिशियल चैनल</div>
                </div>
              </a>

              {/* Native Web Share */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Share className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">सभी ऐप्स (Share)</div>
                  <div className="text-[9px] font-normal opacity-90">Instagram/Snapchat</div>
                </div>
              </button>

              {/* QR Code Toggle */}
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border font-black text-xs transition-all cursor-pointer active:scale-95 ${
                  showQrCode
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">{showQrCode ? 'QR बंद करें' : 'QR कोड दिखाएं'}</div>
                  <div className="text-[9px] font-normal opacity-80">कैमरा स्कैन</div>
                </div>
              </button>
            </div>

            {/* Secondary Social Icons: Facebook, Twitter/X, SMS */}
            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-500 mr-auto flex items-center gap-1">
                अन्य प्लेटफॉर्म्स:
              </span>
              <button
                type="button"
                onClick={handleShareFacebook}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={handleShareTwitter}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>X (Twitter)</span>
              </button>
              <button
                type="button"
                onClick={handleShareSMS}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Smartphone className="w-3 h-3" />
                <span>SMS</span>
              </button>
            </div>
          </div>

          {/* QR Code Scanner Box (Conditionally Shown) */}
          {showQrCode && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row items-center gap-4 animate-scale-up">
              <div className="p-2 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                <img
                  src={qrCodeUrl}
                  alt={`FME Referral QR Code for ${user.userId}`}
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-xs font-bold">
                  <QrCode className="w-3 h-3" />
                  <span>ऑफलाइन कैमरा स्कैन (Direct Scan)</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  सामने वाले के मोबाइल कैमरे से स्कैन करवाएं
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  यह QR कोड स्कैन करते ही उनके फोन में आपका रेफ़रल लिंक खुल जाएगा और आपकी स्पॉन्सर आईडी{' '}
                  <strong>{user.userId}</strong> अपने आप भर जाएगी।
                </p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                  <a
                    href={qrCodeUrl}
                    download={`FME-Referral-QR-${user.userId}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>डाउनलोड QR कोड</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Template Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>संदेश का प्रकार चुनें (Message Template)</span>
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ऑटो-जनरेटेड FME आईडी के साथ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(templates) as MessageTemplateId[]).map((tKey) => {
                const isSelected = selectedTemplate === tKey;
                const item = templates[tKey];
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setSelectedTemplate(tKey)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {item.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {item.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Message Preview & 1-Click Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                लाइव मैसेज प्रीव्यू (व्हाट्सएप/टेलीग्राम में ऐसा दिखेगा):
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  copiedMessage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200'
                }`}
              >
                {copiedMessage ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>पूरा मैसेज कॉपी हुआ ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>पूरा संदेश कॉपी करें</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-xs font-mono leading-relaxed whitespace-pre-line select-all text-slate-800 dark:text-slate-200 max-h-52 overflow-y-auto">
              {currentMessageText}
            </div>
          </div>

          {/* Direct Link & Sponsor ID Quick-Copy Row */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">आपका यूनिक रेफ़रल लिंक</div>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                  {referralLink}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyLinkOnly}
                className="py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 active:scale-95 shrink-0"
              >
                {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'लिंक कॉपी हुआ ✓' : 'सिर्फ लिंक कॉपी'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase">आपकी FME स्पॉन्सर ID</div>
                <div className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
                  {user.userId}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopySponsorCode}
                className="py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-emerald-100 active:scale-95 shrink-0"
              >
                {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'आईडी कॉपी हुई ✓' : 'आईडी कॉपी करें'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            टिप: WhatsApp Status व ग्रुप्स में शेयर करने से सबसे तेज रेफ़रल्स मिलते हैं।
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
