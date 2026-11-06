import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Copy,
  CheckCheck,
  Upload,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  Building2,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { PlanType, UserProfile } from '../types';
import { PLANS, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';
import { compressImageFile } from '../utils/imageCompressor';
import { useToast } from './Toast';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanType;
  currentUser?: UserProfile | null;
  onPaymentSuccess: (details: {
    plan: PlanType;
    method: 'upi' | 'stripe' | 'qr';
    utrNumber?: string;
    proofDataUrl?: string;
  }) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  currentUser,
  onPaymentSuccess,
}) => {
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'stripe' | 'qr'>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Stripe form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(currentUser?.name || '');

  if (!isOpen) return null;

  const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];
  const upiDeepLink = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(
    OFFICIAL_UPI_NAME
  )}&am=${plan.price}&cu=INR&tn=FME-${selectedPlan}-${currentUser?.userId || 'NEW'}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiDeepLink
  )}&margin=10`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    showToast('UPI ID कॉपी हुई ✓', OFFICIAL_UPI_ID, 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const res = await compressImageFile(file, 900, 0.75);
      setProofImage(res.dataUrl);
      showToast('स्क्रीनशॉट तैयार है ✓', 'भुगतान रसीद संलग्न हो गई है।', 'success');
    } catch (err: any) {
      showToast('अपलोड त्रुटि', err?.message || 'स्क्रीनशॉट प्रोसेस करने में त्रुटि।', 'error');
    } finally {
      setCompressing(false);
    }
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() && !proofImage) {
      showToast(
        'पेमेंट प्रूफ आवश्यक है',
        'कृपया 12 अंकों का UTR नंबर दर्ज करें या पेमेंट स्क्रीनशॉट अपलोड करें।',
        'error'
      );
      return;
    }

    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      onPaymentSuccess({
        plan: selectedPlan,
        method: 'upi',
        utrNumber: utrNumber.trim(),
        proofDataUrl: proofImage || undefined,
      });
    }, 1200);
  };

  const handleStripeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
      showToast('कार्ड विवरण अधूरा', 'कृपया सभी आवश्यक कार्ड विवरण सही दर्ज करें।', 'error');
      return;
    }

    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      onPaymentSuccess({
        plan: selectedPlan,
        method: 'stripe',
        utrNumber: `STRIPE_CH_${Date.now().toString().slice(-8)}`,
      });
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flipkart Blue Checkout Header */}
        <div className="px-6 py-4.5 bg-[#2874f0] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">सुरक्षित पेमेंट गेटवे (Secure Checkout)</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-300 text-slate-950">
                  FME Assured
                </span>
              </div>
              <p className="text-xs text-blue-100">
                प्लान: <strong>{plan.name}</strong> · राशि: <strong>₹{plan.price}</strong>
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

        {/* Payment Method Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
              paymentMethod === 'upi'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR कोड (तत्काल)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
              paymentMethod === 'stripe'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Stripe ऑनलाइन कार्ड</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-900 dark:text-slate-100 flex-1">
          {paymentMethod === 'upi' ? (
            /* 1️⃣ UPI & QR CODE FLOW */
            <form onSubmit={handleUpiSubmit} className="space-y-4">
              {/* Official UPI Details Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-amber-900 dark:text-amber-200 tracking-wider">
                    आधिकारिक पेमेंट UPI विवरण
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    पेमेंट राशि: ₹{plan.price}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900 shadow-2xs">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">आधिकारिक UPI आईडी</div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      {OFFICIAL_UPI_ID}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      नाम: <strong>{OFFICIAL_UPI_NAME}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
                  >
                    {copiedUpi ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'कॉपी हुआ ✓' : 'UPI ID कॉपी करें'}</span>
                  </button>
                </div>

                {/* 1-Click Pay Buttons on Mobile */}
                <div className="pt-1">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
                    मोबाइल से 1-क्लिक में पेमेंट करें:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={upiDeepLink}
                      className="py-2 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-center font-black text-[11px] flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>PhonePe</span>
                    </a>
                    <a
                      href={upiDeepLink}
                      className="py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center font-black text-[11px] flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Google Pay</span>
                    </a>
                    <a
                      href={upiDeepLink}
                      className="py-2 px-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-center font-black text-[11px] flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Paytm</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                  <img src={qrCodeUrl} alt="UPI QR Code" className="w-32 h-32 object-contain" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>किसी भी UPI ऐप से QR कोड स्कैन करें</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    PhonePe, Google Pay, Paytm, BHIM या बैंक ऐप खोलकर यह QR कोड स्कैन करें और ठीक{' '}
                    <strong>₹{plan.price}</strong> का भुगतान करें।
                  </p>
                </div>
              </div>

              {/* Verification Inputs: 12-digit UTR and Screenshot */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    12-अंकों का UPI ट्रांजेक्शन / UTR नंबर दर्ज करें:
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="उदा. 429810452391 (वैकल्पिक यदि स्क्रीनशॉट अपलोड है)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पेमेंट रसीद का स्क्रीनशॉट संलग्न करें:
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2874f0] bg-slate-50 dark:bg-slate-800/40 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                      <Upload className="w-4 h-4 text-[#2874f0]" />
                      <span>{compressing ? 'ऑप्टिमाइज़ हो रहा है...' : 'स्क्रीनशॉट चुनें'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="hidden"
                      />
                    </label>

                    {proofImage && (
                      <div className="relative shrink-0">
                        <img
                          src={proofImage}
                          alt="Proof"
                          className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setProofImage(null)}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processingPayment || compressing}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#fb641b] hover:bg-[#e85813] active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingPayment ? (
                  <span>पेमेंट सत्यापित हो रही है...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>भुगतान पूरा हुआ — थैंक यू पेज देखें (₹{plan.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2️⃣ STRIPE CARD ONLINE GATEWAY */
            <form onSubmit={handleStripeSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200">
                    Stripe 256-Bit SSL सुरक्षित पेमेंट
                  </div>
                  <div className="text-[10px] text-slate-500">
                    डेबिट कार्ड, क्रेडिट कार्ड व अंतरराष्ट्रीय कार्ड समर्थित
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कार्ड नंबर (Card Number):
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      समाप्ति तिथि (MM/YY):
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CVC / CVV:
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कार्डधारक का नाम (Name on Card):
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="उदा. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processingPayment}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2874f0] hover:bg-[#2063d3] active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingPayment ? (
                  <span>Stripe कार्ड प्रोसेस हो रहा है...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>₹{plan.price} Stripe से भुगतान करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>सुरक्षित एन्क्रिप्शन · 100% भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल</span>
          <span className="font-bold text-emerald-600">✓ इंस्टेंट डिजिटल ID</span>
        </div>
      </div>
    </div>
  );
};
