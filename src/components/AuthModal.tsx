import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Send,
  Lock,
  CreditCard,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  LogIn,
  UserPlus,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  FileCheck,
  AlertCircle,
  KeyRound,
  QrCode,
  Copy,
  CheckCheck,
  Check,
  Crown,
  Award,
} from 'lucide-react';
import { PlanType, UserProfile } from '../types';
import { PLANS, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';
import {
  registerUser,
  loginUser,
  lookupSponsor,
  generateFmeUserId,
  generateFmeCustomId,
  findUserForRecovery,
  resetUserPassword,
} from '../services/fmeService';
import { compressImageFile } from '../utils/imageCompressor';
import { FmeLogo } from './FmeLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialPlan?: PlanType;
  onLoginSuccess: (user: UserProfile) => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialPlan = '100',
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_id' | 'forgot_pass'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 5-Step Registration Stepper: 1: Personal, 2: Plan Select, 3: Payment Address, 4: Upload Screenshot, 5: Submit & ID
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Register Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [sponsorId, setSponsorId] = useState('FME_ADMIN');
  const [sponsorName, setSponsorName] = useState('FME सुपर एडमिन');
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [profilePic, setProfilePic] = useState(AVATARS[0]);
  const [password, setPassword] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  // Dynamic preview of the unique User ID format: FME + PLAN + INITIALS + SERIAL (e.g. FME100VK01)
  const [previewFmeId, setPreviewFmeId] = useState('FME100VK01');

  // Payment Proof Screenshot Upload
  const [paymentProofDataUrl, setPaymentProofDataUrl] = useState<string>('');
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>('');
  const [paymentProofSizeKb, setPaymentProofSizeKb] = useState<number>(0);
  const [compressingImage, setCompressingImage] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Login Fields
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot ID State
  const [recoverySearch, setRecoverySearch] = useState('');
  const [recoveredUser, setRecoveredUser] = useState<UserProfile | null>(null);

  // Forgot Password State
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    if (initialPlan) setPlan(initialPlan);
    setRegStep(1);
    setError('');
    setSuccessMsg('');
  }, [initialMode, initialPlan, isOpen]);

  // Recalculate preview user ID in format FME + PLAN + INITIALS + SERIAL (e.g. FME100VK01)
  useEffect(() => {
    const customId = generateFmeUserId(plan, name || 'Vikas Kumar');
    setPreviewFmeId(customId);
  }, [plan, name]);

  // Live sponsor verification
  const handleSponsorChange = async (val: string) => {
    setSponsorId(val);
    if (val.trim()) {
      const sp = await lookupSponsor(val);
      if (sp) {
        setSponsorName(sp.name);
      } else {
        setSponsorName('स्पॉन्सर नहीं मिला (डिफ़ॉल्ट एडमिन जुड़ेगा)');
      }
    } else {
      setSponsorName('FME सुपर एडमिन');
    }
  };

  const handlePaymentProofFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setCompressingImage(true);
    try {
      const result = await compressImageFile(file, 900, 0.75);
      setPaymentProofDataUrl(result.dataUrl);
      setPaymentProofFileName(result.fileName);
      setPaymentProofSizeKb(result.compressedSizeKb);
    } catch (err: any) {
      setError(err?.message || 'इमेज प्रोसेस करने में त्रुटि हुई।');
    } finally {
      setCompressingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemovePaymentProof = () => {
    setPaymentProofDataUrl('');
    setPaymentProofFileName('');
    setPaymentProofSizeKb(0);
  };

  const handleCopyAdminUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (!isOpen) return null;

  // Step 1 Validation
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!username.trim()) {
      setError('कृपया एक यूनिक यूजरनेम चुनें।');
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 10) {
      setError('कृपया 10 अंकों का वैध मोबाइल/व्हाट्सएप नंबर दर्ज करें।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('कृपया वैध ईमेल पता दर्ज करें।');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('कृपया कम से कम 4 अक्षरों का पासवर्ड बनाएं।');
      return;
    }
    setRegStep(2);
  };

  // Step 2 Validation (Plan Select)
  const handleNextFromStep2 = () => {
    setRegStep(3);
  };

  // Step 3 Validation (Payment Address)
  const handleNextFromStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!upiId.trim() || !upiId.includes('@')) {
      setError('कृपया अपना वैध UPI ID दर्ज करें (जहाँ आप रेफरल कमाई प्राप्त करेंगे)।');
      return;
    }
    if (!upiName.trim()) {
      setError('कृपया UPI खाताधारक का नाम दर्ज करें।');
      return;
    }
    setRegStep(4);
  };

  // Step 4 Validation (Screenshot Upload)
  const handleNextFromStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!paymentProofDataUrl) {
      setError('कृपया UPI पेमेंट (8877490845@spicepay) का स्क्रीनशॉट अवश्य अपलोड करें।');
      return;
    }
    setRegStep(5);
  };

  // Final Registration Submit (Step 5)
  const handleFinalRegisterSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const user = await registerUser({
        userId: previewFmeId,
        name,
        username,
        email,
        whatsapp,
        telegram: telegram || `@${username}`,
        upiId,
        upiName,
        sponsorId: sponsorId || 'FME_ADMIN',
        plan,
        profilePic,
        password: password || '123456',
        paymentProof: paymentProofDataUrl || undefined,
      });

      setSuccessMsg(
        `बधाई! आपका FME खाता बन गया है। आपकी यूनिक यूजर ID: ${user.userId}। आपका रेफ़रल डैशबोर्ड तुरंत सक्रिय हो गया है!`
      );
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'रजिस्ट्रेशन में त्रुटि हुई। पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!loginCredential.trim()) {
        setError('कृपया अपना User ID, ईमेल या यूजरनेम दर्ज करें।');
        setLoading(false);
        return;
      }

      const user = await loginUser(loginCredential, loginPassword);
      if (!user) {
        setError('यूज़र नहीं मिला या पासवर्ड गलत है। यदि आप ID या पासवर्ड भूल गए हैं तो नीचे दिए बटन पर क्लिक करें।');
        setLoading(false);
        return;
      }

      setSuccessMsg(`स्वागत है, ${user.name}!`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 800);
    } catch (err: any) {
      setError('लॉगिन में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Find User ID
  const handleRecoverUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const match = await findUserForRecovery(recoverySearch);
      if (!match) {
        setError('इस मोबाइल नंबर, ईमेल या UPI ID से कोई भी FME खाता पंजीकृत नहीं है।');
      } else {
        setRecoveredUser(match);
      }
    } catch (err) {
      setError('जांच में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (!resetNewPassword || resetNewPassword.length < 4) {
        setError('कृपया कम से कम 4 अक्षरों का नया पासवर्ड दर्ज करें।');
        setLoading(false);
        return;
      }
      const res = await resetUserPassword(resetIdentifier, resetNewPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setLoginCredential(res.user?.userId || resetIdentifier);
          setLoginPassword(resetNewPassword);
          setMode('login');
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('पासवर्ड रीसेट करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanInfo = PLANS.find((p) => p.id === plan) || PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <FmeLogo variant="icon" size="md" withGlow={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#ffe11b] text-slate-950 shadow-2xs mb-1">
            <Sparkles className="w-3.5 h-3.5" /> FRESH MONEY EARN (FME)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' && 'अपने FME खाते में लॉगिन करें'}
            {mode === 'register' && 'FME 5-स्टेप रजिस्ट्रेशन (Direct Join)'}
            {mode === 'forgot_id' && 'यूजर ID रिकवर करें (Find User ID)'}
            {mode === 'forgot_pass' && 'पासवर्ड रीसेट करें (Reset Password)'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {mode === 'register'
              ? '₹100, ₹500 या ₹1000 प्लान से जुड़ें और ₹65 / ₹365 / ₹765 तुरंत कमाएं'
              : 'सुरक्षित लॉगिन · तुरंत पेआउट्स · 100% पारदर्शी डायरेक्ट अर्निंग'}
          </p>
        </div>

        {/* Mode Switcher Tabs (Only shown in login / register modes) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>लॉगिन (Login)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setRegStep(1);
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#ffe11b] text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>नया रजिस्ट्रेशन (Join Now)</span>
            </button>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* 1. LOGIN MODE */}
        {/* ============================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                FME Unique User ID / ईमेल / यूजरनेम *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="उदा. FME100VK01 या rahul_fme"
                  value={loginCredential}
                  onChange={(e) => setLoginCredential(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                पासवर्ड (Password) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  placeholder="अपना पासवर्ड दर्ज करें"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                />
              </div>
            </div>

            {/* Forgot User ID & Forgot Password Action Links */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot_id');
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>यूजर ID भूल गए? (Forgot ID)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot_pass');
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>पासवर्ड भूल गए? (Forgot Password)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-[#2874f0] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'सत्यापन हो रहा है...' : 'खाते में लॉगिन करें'}</span>
            </button>

            {/* Direct Switch to Registration */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">अभी तक FME खाता नहीं है? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegStep(1);
                }}
                className="text-xs font-black text-[#2874f0] hover:underline cursor-pointer ml-1"
              >
                यहाँ क्लिक करके Join Now करें
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* 2. FORGOT USER ID MODE */}
        {/* ============================================================== */}
        {mode === 'forgot_id' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
              रजिस्ट्रेशन के समय दिया गया अपना <strong>मोबाइल नंबर, ईमेल या UPI ID</strong> दर्ज करें। हम आपकी FME यूनिक ID खोज देंगे।
            </div>

            {!recoveredUser ? (
              <form onSubmit={handleRecoverUserId} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    रजिस्टर्ड मोबाइल नंबर / ईमेल / UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. 9845012345 या rahul@example.com"
                    value={recoverySearch}
                    onChange={(e) => setRecoverySearch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#2874f0] hover:bg-blue-600 text-white cursor-pointer transition-all"
                >
                  {loading ? 'खोज रहे हैं...' : 'मेरी FME ID खोजें'}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-3">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>खाता मिल गया!</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">आपकी FME Unique User ID:</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#2874f0] my-1">
                    {recoveredUser.userId}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    नाम: {recoveredUser.name} · प्लान: ₹{recoveredUser.plan}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLoginCredential(recoveredUser.userId);
                    setMode('login');
                    setRecoveredUser(null);
                  }}
                  className="w-full py-2.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  इस ID से तुरंत लॉगिन करें
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setRecoveredUser(null);
              }}
              className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>वापस लॉगिन पर जाएं</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. FORGOT PASSWORD MODE */}
        {/* ============================================================== */}
        {mode === 'forgot_pass' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              अपनी <strong>FME User ID या रजिस्टर्ड मोबाइल नंबर</strong> दर्ज करें और अपना नया पासवर्ड सेट करें।
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  FME User ID या मोबाइल नंबर *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. FME100VK01 या 9845012345"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  नया पासवर्ड बनाएं (New Password) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="नया पासवर्ड दर्ज करें (कम से कम 4 अक्षर)"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black cursor-pointer transition-all"
              >
                {loading ? 'पासवर्ड बदल रहे हैं...' : 'पासवर्ड रीसेट व सुरक्षित करें'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>वापस लॉगिन पर जाएं</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. 5-STEP REGISTRATION POPUP */}
        {/* ============================================================== */}
        {mode === 'register' && (
          <div className="space-y-4">
            {/* 5-Step Icon Stepper Navigation Bar */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="grid grid-cols-5 gap-1 text-center">
                {/* Step 1 Icon */}
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    regStep === 1
                      ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm font-black'
                      : regStep > 1
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      regStep === 1
                        ? 'bg-[#2874f0] text-white font-black'
                        : regStep > 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {regStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className="text-[10px] sm:text-[11px] leading-tight hidden sm:inline">
                    पर्सनल
                  </span>
                  <span className="text-[9px] sm:hidden">स्टेप 1</span>
                </button>

                {/* Step 2 Icon */}
                <button
                  type="button"
                  onClick={() => name && setRegStep(2)}
                  className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    regStep === 2
                      ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm font-black'
                      : regStep > 2
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      regStep === 2
                        ? 'bg-[#2874f0] text-white font-black'
                        : regStep > 2
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {regStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <span className="text-[10px] sm:text-[11px] leading-tight hidden sm:inline">
                    प्लान
                  </span>
                  <span className="text-[9px] sm:hidden">स्टेप 2</span>
                </button>

                {/* Step 3 Icon */}
                <button
                  type="button"
                  onClick={() => name && setRegStep(3)}
                  className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    regStep === 3
                      ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm font-black'
                      : regStep > 3
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      regStep === 3
                        ? 'bg-[#2874f0] text-white font-black'
                        : regStep > 3
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {regStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
                  </div>
                  <span className="text-[10px] sm:text-[11px] leading-tight hidden sm:inline">
                    पेमेंट पता
                  </span>
                  <span className="text-[9px] sm:hidden">स्टेप 3</span>
                </button>

                {/* Step 4 Icon */}
                <button
                  type="button"
                  onClick={() => upiId && setRegStep(4)}
                  className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    regStep === 4
                      ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm font-black'
                      : regStep > 4
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      regStep === 4
                        ? 'bg-[#2874f0] text-white font-black'
                        : regStep > 4
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {regStep > 4 ? <Check className="w-3.5 h-3.5" /> : '4'}
                  </div>
                  <span className="text-[10px] sm:text-[11px] leading-tight hidden sm:inline">
                    अपलोड
                  </span>
                  <span className="text-[9px] sm:hidden">स्टेप 4</span>
                </button>

                {/* Step 5 Icon */}
                <button
                  type="button"
                  onClick={() => paymentProofDataUrl && setRegStep(5)}
                  className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    regStep === 5
                      ? 'bg-white dark:bg-slate-900 text-[#2874f0] shadow-sm font-black'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      regStep === 5
                        ? 'bg-[#ffe11b] text-slate-950 font-black'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    5
                  </div>
                  <span className="text-[10px] sm:text-[11px] leading-tight hidden sm:inline">
                    सबमिट
                  </span>
                  <span className="text-[9px] sm:hidden">स्टेप 5</span>
                </button>
              </div>
            </div>

            {/* Live Generated FME User ID Banner with Realtime Calculated Value */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                  अलॉटेड FME यूनिक आईडी (LIVE FORMAT)
                </span>
                <div className="text-base sm:text-lg font-black font-mono text-[#2874f0] dark:text-blue-400 flex items-center gap-1.5">
                  <span>{previewFmeId}</span>
                  <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    ₹{plan} प्लान
                  </span>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="flex items-center gap-1">
                {AVATARS.slice(0, 3).map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfilePic(av)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      profilePic === av
                        ? 'border-[#2874f0] ring-2 ring-blue-300'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: PERSONAL DETAILS */}
            {regStep === 1 && (
              <form onSubmit={handleNextFromStep1} className="space-y-3 animate-in fade-in">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <User className="w-4 h-4 text-[#2874f0]" />
                  <span>स्टेप 1: व्यक्तिगत जानकारी (Personal Details)</span>
                </div>

                {/* Auto-Generated FME User ID Form Input Field */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-emerald-50/80 dark:from-slate-800 dark:to-slate-800/90 border-2 border-blue-200 dark:border-blue-900/60 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>आपकी यूनिक FME आईडी (Auto-Populated User ID) *</span>
                    </label>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ffe11b] text-slate-950 shadow-2xs">
                      FME{plan}..01
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={previewFmeId}
                      className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 font-mono font-black text-base text-[#2874f0] dark:text-blue-400 tracking-wider shadow-inner cursor-default focus:outline-none"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(previewFmeId);
                          setSuccessMsg(`FME ID (${previewFmeId}) क्लिपबोर्ड में कॉपी हो गई!`);
                          setTimeout(() => setSuccessMsg(''), 2500);
                        }}
                        title="ID कॉपी करें"
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-[#2874f0] dark:text-blue-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>कॉपी</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 px-0.5">
                    <span>
                      फॉर्मूला: <strong>FME</strong> + <strong>{plan}</strong> + <strong>{previewFmeId.slice(3 + String(plan).length, -2) || 'VK'}</strong> + <strong>{previewFmeId.slice(-2)}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ इनपुट के अनुसार लाइव तैयार
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पूरा नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. Vikas Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      यूजरनेम (Username) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. vikas_fme"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      मोबाइल नंबर (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Telegram हैंडल (@username)
                    </label>
                    <input
                      type="text"
                      placeholder="@username या लिंक"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ईमेल पता (Email) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पासवर्ड (Password) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="लॉगिन पासवर्ड बनाएं"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    />
                  </div>
                </div>

                {/* Sponsor Code Section */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    स्पॉन्सर आईडी (Sponsor ID / Referral Code)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="FME_ADMIN"
                      value={sponsorId}
                      onChange={(e) => handleSponsorChange(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold uppercase"
                    />
                    <span className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold self-center">
                      {sponsorName}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <span>अगला स्टेप: प्लान चुनें (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: PLAN SELECT */}
            {regStep === 2 && (
              <div className="space-y-3.5 animate-in fade-in">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>स्टेप 2: अपना सर्विस प्लान चुनें (Select Plan)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.map((p) => {
                    const isSel = p.id === plan;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSel
                            ? 'border-[#2874f0] bg-blue-50/60 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-300/60 scale-102'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              p.id === '1000'
                                ? 'bg-amber-100 text-amber-900'
                                : p.id === '500'
                                ? 'bg-cyan-100 text-cyan-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {p.badge}
                          </span>
                          {isSel && <CheckCircle2 className="w-4 h-4 text-[#2874f0]" />}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          ₹{p.price}
                        </div>
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                          {p.name}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                          <div className="font-black text-emerald-600 dark:text-emerald-400">
                            डायरेक्ट पेआउट: ₹{p.directCommission}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            {p.id === '100'
                              ? 'नॉर्मल मस्त लुक डिजिटल कार्ड'
                              : p.id === '500'
                              ? 'प्लैटिनम डिजिटल ID + टूल्स'
                              : 'रॉयल क्राउन ID + गोल्डन प्लेट'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                  ⚡ <strong>{selectedPlanInfo.name} (₹{selectedPlanInfo.price})</strong> चुनने पर आपको प्रत्येक सफल रेफर पर <strong>₹{selectedPlanInfo.directCommission}</strong> सीधा पेआउट मिलेगा।
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पीछे</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="flex-1 py-3 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    <span>अगला स्टेप: पेमेंट पता (Step 3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT ADDRESS */}
            {regStep === 3 && (
              <form onSubmit={handleNextFromStep3} className="space-y-3.5 animate-in fade-in">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>स्टेप 3: पेमेंट विवरण व पता (Payment Details)</span>
                </div>

                {/* Official UPI Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-300 dark:border-emerald-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <span>आधिकारिक प्राप्तकर्ता UPI (FME Official):</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                      100% VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold">UPI ID:</div>
                      <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {OFFICIAL_UPI_ID}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        नाम: <strong>{OFFICIAL_UPI_NAME}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAdminUpi}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedUpi ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'कॉपी हुआ' : 'UPI कॉपी'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-emerald-950 dark:text-emerald-200">
                    PhonePe, Google Pay, Paytm, BHIM से <strong>₹{selectedPlanInfo.price}</strong> इस UPI पर ट्रांसफर करें और अगले स्टेप में स्क्रीनशॉट जोड़ें।
                  </p>
                </div>

                {/* User Payout Account Input */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    आपका पेआउट पता (जहाँ आपको रेफरल कमीशन मिलेगा):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        आपकी व्यक्तिगत UPI ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. mobile@upi या user@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        UPI खाताधारक का नाम *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="बैंक में पंजीकृत नाम"
                        value={upiName}
                        onChange={(e) => setUpiName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पीछे</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    <span>अगला स्टेप: स्क्रीनशॉट अपलोड (Step 4)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: UPLOAD PAYMENT PAGE */}
            {regStep === 4 && (
              <form onSubmit={handleNextFromStep4} className="space-y-3.5 animate-in fade-in">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <Upload className="w-4 h-4 text-[#2874f0]" />
                  <span>स्टेप 4: पेमेंट स्क्रीनशॉट अपलोड (Upload Payment Page)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    12-अंकों का UPI UTR / Transaction Reference Number (ऐच्छिक)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 429182910291"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                  />
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentProofFile}
                  className="hidden"
                />

                {/* Upload Box */}
                {!paymentProofDataUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      compressingImage
                        ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-[#2874f0] hover:bg-blue-50/20'
                    }`}
                  >
                    {compressingImage ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <div className="w-6 h-6 border-2 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-[#2874f0]">
                          स्क्रीनशॉट प्रोसेस हो रहा है...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 py-2 text-slate-600 dark:text-slate-400">
                        <div className="p-3 rounded-2xl bg-blue-100 text-[#2874f0]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          पेमेंट स्क्रीनशॉट अपलोड करने के लिए टैप करें
                        </div>
                        <div className="text-[10px] text-slate-400">
                          JPG, PNG, WEBP (ऑटोमैटिक कंप्रेस)
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => setPreviewModalOpen(true)}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer relative group"
                      >
                        <img
                          src={paymentProofDataUrl}
                          alt="Receipt"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>स्क्रीनशॉट संलग्न है</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {paymentProofFileName || 'payment_proof.jpg'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          साइज़: {paymentProofSizeKb} KB
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                        title="देखें"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePaymentProof}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(3)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पीछे</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    <span>अगला स्टेप: समीक्षा व सबमिट (Step 5)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: SUBMIT PAYMENT SCREENSHOT & ID GENERATION */}
            {regStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>स्टेप 5: समीक्षा एवं अंतिम सबमिट (Review & Submit)</span>
                </div>

                {/* Final ID Badge Card */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl space-y-3 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ffe11b] text-slate-950">
                      GENERATED FME USER ID
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      ₹{selectedPlanInfo.price} सर्विस प्लान
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#ffe11b] tracking-wider text-center py-1">
                    {previewFmeId}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10 text-slate-300">
                    <div>
                      <div className="text-[10px] text-slate-400">सदस्य का नाम:</div>
                      <div className="font-bold text-white truncate">{name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">मोबाइल / व्हाट्सएप:</div>
                      <div className="font-bold text-white">{whatsapp}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">स्पॉन्सर आईडी:</div>
                      <div className="font-bold text-white">{sponsorId}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">स्क्रीनशॉट स्थिति:</div>
                      <div className="font-bold text-emerald-400">✓ सफलतापूर्वक अटैच</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                  📌 <strong>ध्यान दें:</strong> रजिस्ट्रेशन सबमिट करते ही आपका <strong>रेफ़रल डैशबोर्ड तुरंत एक्टिवेट</strong> हो जाएगा। आपको आपकी User ID और शेयर करने के लिए रेफ़रल लिंक व प्रमोशन पोस्टर्स मिल जाएंगे। एडमिन वेरिफिकेशन के बाद आपका डिजिटल आईडी कार्ड डाउनलोड अनलॉक होगा।
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRegStep(4)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पीछे</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleFinalRegisterSubmit}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#ffe11b]" />
                    <span>{loading ? 'आईडी तैयार हो रही है...' : 'रजिस्ट्रेशन पूरा करें (Activate Dashboard)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for Zooming Attached Screenshot */}
        {previewModalOpen && paymentProofDataUrl && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in">
            <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/60 text-white hover:bg-slate-900 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-xs font-black text-slate-900 dark:text-white mb-2">
                पेमेंट स्क्रीनशॉट प्रीव्यू
              </div>
              <img
                src={paymentProofDataUrl}
                alt="Zoomed Payment Proof"
                className="w-full max-h-[70vh] object-contain rounded-2xl border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
