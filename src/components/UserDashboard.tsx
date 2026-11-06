import React, { useState, useEffect } from 'react';
import {
  User,
  Wallet,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Clock,
  ArrowDownToLine,
  ShieldCheck,
  Users,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  LogOut,
  BarChart3,
  Edit3,
  Camera,
  Save,
  CheckCheck,
  Upload,
  Eye,
  FileCheck,
  Bell,
  MessageSquare,
  Download,
  Crown,
  Award,
  History,
  Trophy,
  Flame,
  Layers,
  Lock,
} from 'lucide-react';
import { UserProfile, WithdrawalRequest, Transaction, PlanType, LeaderboardMember, ActivityLogItem } from '../types';
import { PLANS, CONTACT_EMAIL, WHATSAPP_NUMBER, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME } from '../data/plans';
import {
  requestWithdrawal,
  getWithdrawals,
  getAllUsers,
  getUserDownline,
  updateUserProfile,
  updateUserPaymentProof,
  getUserTransactions,
  recordPlanPaymentTransaction,
  getUserActivityLog,
  getLeaderboardMembers,
  DownlineReport,
} from '../services/fmeService';
import { compressImageFile } from '../utils/imageCompressor';

import { ReferralEarningsChart } from './ReferralEarningsChart';
import { DownlineExplorer } from './DownlineExplorer';
import { CommissionHistoryTable } from './CommissionHistoryTable';
import { ActivityLogStepList } from './ActivityLogStepList';
import { LeaderboardSection } from './LeaderboardSection';
import { CommissionBannerAlert } from './CommissionBannerAlert';
import { SocialShareModal } from './SocialShareModal';
import { DigitalIdCard } from './DigitalIdCard';
import { FmeLogo } from './FmeLogo';
import { PrivateChatModal } from './PrivateChatModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { ThankYouModal } from './ThankYouModal';
import { PendingReferralDashboard } from './PendingReferralDashboard';
import { useToast } from './Toast';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
];

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onRefreshUser: (updatedUser: UserProfile) => void;
  onOpenAdmin?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onLogout,
  onRefreshUser,
  onOpenAdmin,
}) => {
  const { showToast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(user.walletBalance > 50 ? user.walletBalance : 50);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityLogItem[]>([]);
  const [leaderboardMembers, setLeaderboardMembers] = useState<LeaderboardMember[]>([]);
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'transactions' | 'activity' | 'leaderboard' | 'team' | 'idcard'
  >('overview');




  // Profile Edit Modal State

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileUpiId, setProfileUpiId] = useState(user.upiId);
  const [profileUpiName, setProfileUpiName] = useState(user.upiName);
  const [profileWhatsapp, setProfileWhatsapp] = useState(user.whatsapp);
  const [profileTelegram, setProfileTelegram] = useState(user.telegram || '');
  const [profilePic, setProfilePic] = useState(user.profilePic || AVATAR_PRESETS[0]);
  const [profileSaving, setProfileSaving] = useState(false);
  
  // Payment Proof upload & preview in Dashboard
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofPreviewOpen, setProofPreviewOpen] = useState(false);
  const dashboardProofInputRef = React.useRef<HTMLInputElement>(null);

  // Social Share Suite Modal State
  const [socialShareOpen, setSocialShareOpen] = useState(false);

  // New Features Modal States
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ method: 'upi' | 'stripe' | 'qr'; utrNumber?: string } | null>(null);

  const [downlineReport, setDownlineReport] = useState<DownlineReport>({
    level1: [],
    level2: [],
    level3: [],
    totalMembers: 0,
    activeMembers: 0,
    totalEarnings: 0,
  });

  const planInfo = PLANS.find((p) => p.id === user.plan) || PLANS[0];
  const referralLink = `${window.location.origin}/?ref=${user.userId}`;

  useEffect(() => {
    loadDashboardData();
  }, [user.userId]);

  useEffect(() => {
    // Keep form in sync if user prop changes
    setProfileName(user.name);
    setProfileUpiId(user.upiId);
    setProfileUpiName(user.upiName);
    setProfileWhatsapp(user.whatsapp);
    setProfileTelegram(user.telegram || '');
    setProfilePic(user.profilePic || AVATAR_PRESETS[0]);
  }, [user]);

  const loadDashboardData = async () => {
    const list = await getWithdrawals(user.userId);
    setWithdrawals(list);

    const allUsers = await getAllUsers();
    const report = getUserDownline(user.userId, allUsers);
    setDownlineReport(report);

    const txns = await getUserTransactions(user.userId);
    setTransactions(txns);

    const acts = await getUserActivityLog(user.userId);
    setActivityItems(acts);

    const leaders = await getLeaderboardMembers(user.userId);
    setLeaderboardMembers(leaders);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast(
      'रेफ़रल लिंक कॉपी हुआ (Referral Copied)!',
      'लिंक क्लिपबोर्ड में कॉपी हो गया है। इसे दोस्तों व सोशल मीडिया पर शेयर करें।',
      'success'
    );
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.userId);
    setCopiedCode(true);
    showToast(
      'FME स्पॉन्सर आईडी कॉपी हुई!',
      `आपकी आईडी ${user.userId} कॉपी हो गई है।`,
      'success'
    );
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🔥 *FRESH MONEY EARN (FME) FAST INCOME SERVICE*\nनमस्ते! मैं FME के साथ 3 LEVEL ऑनलाइन कमाई कर रहा हूँ।\n\n📌 केवल ₹100, ₹500 या ₹1000 से सर्विस शुरू करें और करवाएं!\n• ₹100 पर: L1 ₹30, L2 ₹10, L3 ₹5\n• ₹500 पर: L1 ₹150, L2 ₹75, L3 ₹25\n• ₹1000 पर: L1 ₹400, L2 ₹150, L3 ₹50\n\nमेरी स्पॉन्सर आईडी: *${user.userId}*\nयहाँ क्लिक करके अभी रजिस्टर करें:\n👉 ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    setWithdrawLoading(true);

    try {
      const res = await requestWithdrawal({
        userId: user.userId,
        userName: user.name,
        amount: Number(withdrawAmount),
        upiId: user.upiId,
        upiName: user.upiName,
      });

      if (!res.success) {
        setWithdrawError(res.message);
        showToast('विड्रॉल विफल', res.message, 'error');
      } else {
        const successMsg = `₹${withdrawAmount} का विड्रॉल अनुरोध दर्ज हो गया! 2-4 घंटे में UPI खाते में क्रेडिट हो जाएगा।`;
        setWithdrawSuccess(successMsg);
        showToast('विड्रॉल अनुरोध दर्ज हुआ!', successMsg, 'success');

        onRefreshUser({
          ...user,
          walletBalance: user.walletBalance - Number(withdrawAmount),
          totalWithdrawn: user.totalWithdrawn + Number(withdrawAmount),
        });
        loadDashboardData();
        setTimeout(() => {
          setWithdrawModalOpen(false);
          setWithdrawSuccess('');
        }, 1800);
      }
    } catch (err: any) {
      setWithdrawError('अनुरोध भेजने में समस्या आई।');
      showToast('त्रुटि हुई', 'अनुरोध भेजने में समस्या आई। कृपया पुनः प्रयास करें।', 'error');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileUpiId.trim() || !profileUpiName.trim()) {
      showToast('अधूरी जानकारी', 'कृपया सभी आवश्यक फ़ील्ड भरें।', 'error');
      return;
    }

    setProfileSaving(true);
    try {
      const updated = await updateUserProfile(user.userId, {
        name: profileName.trim(),
        upiId: profileUpiId.trim(),
        upiName: profileUpiName.trim(),
        whatsapp: profileWhatsapp.trim(),
        telegram: profileTelegram.trim(),
        profilePic: profilePic.trim() || user.profilePic,
      });

      if (updated) {
        onRefreshUser(updated);
        showToast(
          'प्रोफाइल अपडेट हो गई (Profile Updated)!',
          'आपकी नई जानकारी व UPI विवरण सुरक्षित रूप से सेव कर दिया गया है।',
          'success'
        );
        setEditProfileOpen(false);
      } else {
        showToast('प्रोफाइल अपडेट विफल', 'यूज़र नहीं मिला या डेटाबेस त्रुटि हुई।', 'error');
      }
    } catch (err) {
      showToast('त्रुटि हुई', 'सर्वर से कनेक्ट करने में समस्या आई।', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDashboardProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    try {
      const res = await compressImageFile(file, 900, 0.75);
      const ok = await updateUserPaymentProof(user.userId, res.dataUrl);
      if (ok) {
        showToast(
          'पेमेंट प्रूफ सुरक्षित सेव हुआ!',
          'आपका ट्रांजेक्शन स्क्रीनशॉट एडमिन रिव्यू के लिए सुरक्षित सेव हो गया है।',
          'success'
        );
        onRefreshUser({
          ...user,
          paymentProof: res.dataUrl,
          paymentProofUploadedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      showToast('अपलोड त्रुटि', err?.message || 'स्क्रीनशॉट प्रोसेस करने में त्रुटि।', 'error');
    } finally {
      setUploadingProof(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleExportDownlineCSV = () => {
    const rows = [
      ['FME User ID', 'Member Name', 'Username', 'Plan', 'Level', 'Sponsor ID', 'Commission Earned (INR)', 'Status'],
      ...downlineReport.level1.map((m) => [m.userId, m.name, m.username, `₹${m.plan}`, 'LEVEL 1', m.sponsorId, `₹${m.commissionEarnedForUser}`, m.planStatus]),
      ...downlineReport.level2.map((m) => [m.userId, m.name, m.username, `₹${m.plan}`, 'LEVEL 2', m.sponsorId, `₹${m.commissionEarnedForUser}`, m.planStatus]),
      ...downlineReport.level3.map((m) => [m.userId, m.name, m.username, `₹${m.plan}`, 'LEVEL 3', m.sponsorId, `₹${m.commissionEarnedForUser}`, m.planStatus]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FME_Downline_${user.userId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV एक्सपोर्ट सफल!', 'आपकी टीम डाउनलाइन रिपोर्ट डाउनलोड हो गई है।', 'success');
  };

  const handleExportTransactionsCSV = () => {
    const rows = [
      ['Txn ID', 'Type', 'Amount (INR)', 'Description', 'From Member', 'Date', 'Status'],
      ...transactions.map((t) => [t.id, t.type, `₹${t.amount}`, t.description, t.fromUserId || '', new Date(t.createdAt).toLocaleDateString(), t.status]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FME_Transactions_${user.userId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ट्रांजेक्शन CSV एक्सपोर्ट सफल!', 'कमीशन व विड्रॉल हिस्ट्री डाउनलोड हो गई।', 'success');
  };

  const handleUpdateCardPrivacy = async (privacy: {
    isPublic: boolean;
    maskPhone: boolean;
    maskEmail: boolean;
    maskUpi: boolean;
  }) => {
    const updated = await updateUserProfile(user.userId, { cardPrivacy: privacy });
    if (updated) onRefreshUser(updated);
  };

  const handleSelectAvatarFrame = async (frame: UserProfile['avatarFrame']) => {
    const updated = await updateUserProfile(user.userId, { avatarFrame: frame });
    if (updated) {
      onRefreshUser(updated);
      showToast('प्रोफाइल फ्रेम अपडेट हुआ!', 'नया प्रीमियम फ्रेम आपके डिजिटल ID व प्रोफाइल पर लागू हो गया।', 'success');
    }
  };

  const handlePaymentGatewaySuccess = async (details: {
    plan: PlanType;
    method: 'upi' | 'stripe' | 'qr';
    utrNumber?: string;
    proofDataUrl?: string;
  }) => {
    setPaymentGatewayOpen(false);
    const isUpgrade = details.plan !== user.plan;
    await recordPlanPaymentTransaction(user.userId, details.plan, details.method, isUpgrade);
    const updatedTxns = await getUserTransactions(user.userId);
    setTransactions(updatedTxns);

    if (details.proofDataUrl) {
      await updateUserPaymentProof(user.userId, details.proofDataUrl);
      onRefreshUser({
        ...user,
        plan: details.plan,
        paymentProof: details.proofDataUrl,
        paymentProofUploadedAt: new Date().toISOString(),
        lastPaymentMethod: details.method,
      });
    }
    setPaymentSuccessData({ method: details.method, utrNumber: details.utrNumber });
    setThankYouOpen(true);

  };

  const adminActivationWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `नमस्ते Admin, मैंने FME पर रजिस्टर किया है। मेरी FME ID: ${user.userId}, नाम: ${user.name}, चुना गया प्लान: ₹${user.plan}। कृपया सर्विस एक्टिवेट करें।`
  )}`;

  // Use actual calculated downline counts or fallback to user profile stats
  const l1Count = downlineReport.level1.length || user.level1Count;
  const l2Count = downlineReport.level2.length || user.level2Count;
  const l3Count = downlineReport.level3.length || user.level3Count;

  const l1Income = downlineReport.level1.reduce((sum, m) => sum + m.commissionEarnedForUser, 0) || user.level1Income;
  const l2Income = downlineReport.level2.reduce((sum, m) => sum + m.commissionEarnedForUser, 0) || user.level2Income;
  const l3Income = downlineReport.level3.reduce((sum, m) => sum + m.commissionEarnedForUser, 0) || user.level3Income;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setEditProfileOpen(true)}
            title="प्रोफाइल फोटो बदलें"
          >
            <img
              src={user.profilePic || AVATAR_PRESETS[0]}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-5 h-5 drop-shadow" />
            </div>
            {user.planStatus === 'active' && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full text-[10px] shadow-sm" title="सक्रिय खाता">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>

              {/* Interactive FME ID with Copy Button & Pulse */}
              <button
                type="button"
                onClick={handleCopyCode}
                title="FME ID कॉपी करें"
                className="group relative px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{user.userId}</span>
                {copiedCode ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                ) : (
                  <Copy className="w-3 h-3 text-emerald-600/70 group-hover:text-emerald-700 transition-transform group-hover:scale-110" />
                )}
              </button>

              {user.role === 'admin' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  सुपर एडमिन
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>@{user.username}</span>
              <span>·</span>
              <span>प्लान: <strong>₹{user.plan}</strong></span>
              <span>·</span>
              <span>
                स्थिति:{' '}
                {user.planStatus === 'active' ? (
                  <strong className="text-emerald-600 dark:text-emerald-400">सक्रिय (Active)</strong>
                ) : (
                  <strong className="text-amber-600 dark:text-amber-400">सत्यापन प्रक्रिया में (Pending)</strong>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Notification Center Bell */}
          <button
            type="button"
            onClick={() => setNotificationModalOpen(true)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer relative shadow-2xs"
            title="नोटिफिकेशन सेंटर खोलें"
          >
            <Bell className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
          </button>

          {/* 1-on-1 Admin Private Guide Chat */}
          <button
            type="button"
            onClick={() => setChatModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-black bg-[#2874f0] hover:bg-blue-600 active:scale-95 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="एडमिन विकास कुमार से 1-on-1 बात करें"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>एडमिन गाइड चैट</span>
          </button>

          {/* Share via Social Quick Button */}
          <button
            type="button"
            onClick={() => setSocialShareOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ring-1 ring-emerald-400/40"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>सोशल शेयर</span>
          </button>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={() => {
              if (user.planStatus !== 'active') {
                showToast(
                  'प्रोफाइल लॉक्ड है',
                  'एडमिन द्वारा पेमेंट सत्यापित व स्वीकृत होने के बाद आप अपनी प्रोफाइल एडिट कर सकते हैं।',
                  'info'
                );
                return;
              }
              setEditProfileOpen(true);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              user.planStatus === 'active'
                ? 'border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-70'
            }`}
            title={user.planStatus === 'active' ? 'प्रोफाइल एडिट करें' : '🔒 अप्रूवल के बाद अनलॉक होगा'}
          >
            {user.planStatus === 'active' ? (
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>प्रोफाइल</span>
          </button>

          {user.role === 'admin' && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
            >
              ⚡ एडमिन पैनल
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* ⚠️ Rejection Alert Box */}
      {user.planStatus === 'rejected' && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-700/60 mb-8 space-y-2">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-black text-sm">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>पिछला पेमेंट स्क्रीनशॉट अस्वीकृत हो गया है</span>
          </div>
          <p className="text-xs text-red-800 dark:text-red-200">
            कारण: <strong>{user.rejectionReason || 'पेमेंट स्क्रीनशॉट या UTR विवरण अस्पष्ट पाया गया।'}</strong>
          </p>
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaymentGatewayOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#2874f0] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              ऑनलाइन पेमेंट गेटवे से पुनः भरें
            </button>
            <button
              type="button"
              onClick={() => dashboardProofInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              नया स्क्रीनशॉट अपलोड करें
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for uploading payment proof */}
      <input
        ref={dashboardProofInputRef}
        type="file"
        accept="image/*"
        onChange={handleDashboardProofChange}
        className="hidden"
      />

      {/* CONDITIONAL RENDERING: PENDING USER GETS REFERRAL DASHBOARD, APPROVED GETS FULL DASHBOARD */}
      {user.planStatus !== 'active' ? (
        <PendingReferralDashboard
          user={user}
          referralLink={referralLink}
          copiedLink={copiedLink}
          copiedCode={copiedCode}
          onCopyLink={handleCopyLink}
          onCopyCode={handleCopyCode}
          onOpenSocialShare={() => setSocialShareOpen(true)}
          onOpenChat={() => setChatModalOpen(true)}
          onReuploadProof={() => dashboardProofInputRef.current?.click()}
        />
      ) : (
        <>
          {/* 🔔 COMMISSION NOTIFICATION BANNER ALERT (LOCAL SYSTEM) */}
          <CommissionBannerAlert
            transactions={transactions}
            onViewActivity={() => setDashboardTab('activity')}
            onViewTransactions={() => setDashboardTab('transactions')}
          />

          {/* 🧭 USER DASHBOARD MAIN NAVIGATION TABS */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-8 overflow-x-auto scrollbar-none border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setDashboardTab('overview')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'overview'
              ? 'bg-[#2874f0] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>अवलोकन</span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('activity')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'activity'
              ? 'bg-[#2874f0] text-white shadow-sm ring-2 ring-emerald-400/50'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-300" />
          <span>गतिविधि टाइमलाइन</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {activityItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('leaderboard')}
          className={`flex-1 min-w-[145px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'leaderboard'
              ? 'bg-[#2874f0] text-white shadow-sm ring-2 ring-yellow-400/50'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span>लीडरबोर्ड TOP 10</span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black">
            TOP 10
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('transactions')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'transactions'
              ? 'bg-[#2874f0] text-white shadow-sm ring-2 ring-blue-400/50'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>लेन-देन इतिहास</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {transactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('team')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'team'
              ? 'bg-[#2874f0] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>टीम ({l1Count + l2Count + l3Count})</span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('idcard')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            dashboardTab === 'idcard'
              ? 'bg-[#2874f0] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>ID कार्ड</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 💳 TAB 1: TRANSACTION HISTORY & PAYMENT ACTIVITIES (DEDICATED) */}
      {/* ============================================================== */}
      {dashboardTab === 'transactions' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Transaction History Table Component */}
          <CommissionHistoryTable
            transactions={transactions}
            currentUserId={user.userId}
            onUpgradePlan={() => setPaymentGatewayOpen(true)}
          />

          {/* Detailed Withdrawal History Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
                  <span>UPI बैंक निकासी इतिहास (Withdrawal Requests)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  आपके द्वारा सीधे पंजीकृत UPI ({user.upiId}) पर भेजे गए विड्रॉल अनुरोधों की स्थिति
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWithdrawModalOpen(true)}
                disabled={user.walletBalance < 50}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs self-start sm:self-auto"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>नया विड्रॉल करें</span>
              </button>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
                अभी तक कोई विड्रॉल अनुरोध नहीं किया गया है। वॉलेट बैलेंस ₹50 होते ही आप विड्रॉल कर सकते हैं।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">अनुरोध तारीख</th>
                      <th className="py-2.5 px-3">राशि (Amount)</th>
                      <th className="py-2.5 px-3">UPI खाता</th>
                      <th className="py-2.5 px-3">स्थिति (Status)</th>
                      <th className="py-2.5 px-3">रेफरेंस / UTR नंबर</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 whitespace-nowrap">{new Date(w.createdAt).toLocaleDateString('hi-IN')}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">₹{w.amount}</td>
                        <td className="py-2.5 px-3 font-mono">{w.upiId}</td>
                        <td className="py-2.5 px-3">
                          {w.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              सफल (Paid)
                            </span>
                          ) : w.status === 'rejected' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              अस्वीकृत
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              प्रक्रिया में (Pending)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{w.txnRef || 'प्रतीक्षारत'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ⚡ TAB: ACTIVITY LOG & EARNINGS TIMELINE (STEP-LIST COMPONENT) */}
      {/* ============================================================== */}
      {dashboardTab === 'activity' && (
        <ActivityLogStepList
          items={activityItems}
          userPlan={user.plan}
          onRefresh={loadDashboardData}
          onOpenSocialShare={() => setSocialShareOpen(true)}
          onOpenUpgrade={() => setPaymentGatewayOpen(true)}
        />
      )}

      {/* ============================================================== */}
      {/* 🏆 TAB: GAMIFIED LEADERBOARD (TOP 10 REFERRAL CHAMPIONS)       */}
      {/* ============================================================== */}
      {dashboardTab === 'leaderboard' && (
        <LeaderboardSection
          members={leaderboardMembers}
          currentUserId={user.userId}
          onShareReferral={() => setSocialShareOpen(true)}
          onUpgradePlan={() => setPaymentGatewayOpen(true)}
        />
      )}

      {/* ============================================================== */}
      {/* 👥 TAB 2: MY DOWNLINE TEAM (3-LEVEL TEAM BREAKDOWN & EXPLORER) */}
      {/* ============================================================== */}
      {dashboardTab === 'team' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 3-LEVEL Team Performance Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  आपकी 3 LEVEL टीम व कमाई विश्लेषण
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  कमीशन दर: ₹{planInfo.payoutPerPerson.level1} (L1), ₹{planInfo.payoutPerPerson.level2} (L2), ₹{planInfo.payoutPerPerson.level3} (L3)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  कुल टीम: {l1Count + l2Count + l3Count} सदस्य
                </div>
                {(user.plan === '500' || user.plan === '1000') && (
                  <button
                    type="button"
                    onClick={handleExportDownlineCSV}
                    className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                    LEVEL 1 (डायरेक्ट रेफ़रल)
                  </span>
                  <span className="text-xs font-bold text-slate-500">₹{planInfo.payoutPerPerson.level1}/मेंबर</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{l1Count}</span>
                    <span className="text-xs text-slate-500 ml-1">मेंबर्स</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">कुल कमाई</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{l1Income.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                    LEVEL 2 (सेकंड टीम)
                  </span>
                  <span className="text-xs font-bold text-slate-500">₹{planInfo.payoutPerPerson.level2}/मेंबर</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{l2Count}</span>
                    <span className="text-xs text-slate-500 ml-1">मेंबर्स</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">कुल कमाई</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{l2Income.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                    LEVEL 3 (थर्ड लेवल पैसिव)
                  </span>
                  <span className="text-xs font-bold text-slate-500">₹{planInfo.payoutPerPerson.level3}/मेंबर</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{l3Count}</span>
                    <span className="text-xs text-slate-500 ml-1">मेंबर्स</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">कुल कमाई</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{l3Income.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📊 RECHARTS VISUALIZATION: Bar Chart showing Referrals & Earnings across 3 Levels */}
          <ReferralEarningsChart
            level1Count={l1Count}
            level1Income={l1Income}
            level2Count={l2Count}
            level2Income={l2Income}
            level3Count={l3Count}
            level3Income={l3Income}
          />

          {/* 👥 DOWNLINE EXPLORER: Who Joined Under This User Across Levels 1, 2, 3 */}
          <DownlineExplorer downline={downlineReport} />
        </div>
      )}

      {/* ============================================================== */}
      {/* 🪪 TAB 3: DIGITAL ID CARD SHOWCASE & FRAME CUSTOMIZER */}
      {/* ============================================================== */}
      {dashboardTab === 'idcard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <FmeLogo variant="icon" size="md" withGlow={true} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    आपका आधिकारिक डिजिटल ID कार्ड
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {user.plan === '1000' ? 'रॉयल क्राउन VIP' : user.plan === '500' ? 'प्लेटिनम मेंबर' : 'नॉर्मल मस्त लुक'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल · सार्वजनिक या निजी दृश्यता व फोन नंबर मास्किंग नियंत्रण
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPaymentGatewayOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 transition-all"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>प्लान अपग्रेड (₹100 / ₹500 / ₹1000)</span>
            </button>
          </div>

          <DigitalIdCard
            user={user}
            isOwner={true}
            onUpdatePrivacy={handleUpdateCardPrivacy}
            onSelectFrame={handleSelectAvatarFrame}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* 🏠 TAB 4: GENERAL DASHBOARD OVERVIEW (DEFAULT VIEW) */}
      {/* ============================================================== */}
      {dashboardTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Financial Overview Cards (4 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Wallet Balance */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold opacity-90">
                <span>उपलब्ध वॉलेट बैलेंस</span>
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black">
                ₹{user.walletBalance.toLocaleString('en-IN')}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(true)}
                  disabled={user.walletBalance < 50}
                  className="w-full py-2 px-3 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 active:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>पैसे निकालें (Withdraw)</span>
                </button>
              </div>
            </div>

            {/* Direct Referrals Income (Instant Payout) */}
            <div
              onClick={() => setDashboardTab('transactions')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer hover:border-[#2874f0] transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>डायरेक्ट रेफरल कमाई</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 group-hover:scale-102 transition-transform">
                ₹{(user.directReferralIncome || l1Income).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 pt-1 font-semibold flex items-center justify-between">
                <span>₹65 / ₹365 / ₹765 पेआउट्स</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Total Earned */}
            <div
              onClick={() => setDashboardTab('transactions')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer hover:border-[#2874f0] transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>कुल जीवनकाल कमाई (Lifetime)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:scale-102 transition-transform">
                ₹{user.totalEarned.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 pt-1 font-semibold flex items-center justify-between">
                <span>इतिहास देखें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Total Withdrawn */}
            <div
              onClick={() => setDashboardTab('transactions')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer hover:border-[#2874f0] transition-colors group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>सफलतापूर्वक निकाला गया</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:scale-102 transition-transform">
                ₹{user.totalWithdrawn.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 pt-1 font-semibold flex items-center justify-between">
                <span>निकासी रिकॉर्ड्स देखें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Referral Hub: Link & Social Share Suite */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1d5ec4] via-blue-900 to-slate-900 text-white shadow-lg space-y-5 border border-blue-600/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ffe11b]/20 border border-[#ffe11b]/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#ffe11b]" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">आपका पर्सनल इनवाइट व डायरेक्ट रेफ़रल लिंक</h2>
                  <p className="text-[11px] text-blue-200">
                    FME स्पॉन्सर आईडी: <strong className="font-mono text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded">{user.userId}</strong>
                  </p>
                </div>
              </div>

              {/* Social Share Primary Highlight Button */}
              <button
                type="button"
                onClick={() => setSocialShareOpen(true)}
                className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#ffe11b] to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-md shrink-0"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>सोशल मीडिया पर शेयर करें</span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-full bg-slate-950 text-white text-[9px] font-bold">
                  WhatsApp & Telegram
                </span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              यह लिंक अपने दोस्तों, रिश्तेदारों व सोशल मीडिया ग्रुप्स में शेयर करें। ₹100 प्लान शेयर करने पर ₹65, ₹500 पर ₹365 और ₹1000 पर ₹765 इंस्टेंट डायरेक्ट पेआउट प्राप्त करें!
            </p>

            <div className="flex flex-col lg:flex-row gap-2.5">
              <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-black/40 border border-blue-500/40 text-xs font-mono select-all truncate">
                <span className="text-yellow-400 font-bold select-none shrink-0">लिंक:</span>
                <span className="truncate">{referralLink}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm ${
                    copiedLink
                      ? 'bg-yellow-300 text-slate-950 scale-102 ring-2 ring-white/50'
                      : 'bg-white text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {copiedLink ? (
                    <CheckCheck className="w-4 h-4 text-emerald-800 animate-bounce" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-900" />
                  )}
                  <span>{copiedLink ? 'लिंक कॉपी हुआ ✓' : 'रेफ़रल कॉपी'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSocialShareOpen(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm"
                  title="WhatsApp, Telegram व सोशल मीडिया संदेश जनरेटर खोलें"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp शेयर</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Recent Transactions Preview Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2874f0]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  हालिया भुगतान व कमीशन गतिविधियाँ (Recent Transactions)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDashboardTab('transactions')}
                className="text-xs font-black text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>पूरा लेन-देन इतिहास देखें ({transactions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {transactions.slice(0, 4).map((t) => {
                const isWithdrawal = t.type === 'withdrawal';
                const isPlanPayment = t.type === 'plan_payment' || t.type === 'plan_upgrade' || t.type === 'activation_fee';
                return (
                  <div
                    key={t.id}
                    onClick={() => setDashboardTab('transactions')}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#2874f0] flex items-center justify-center font-bold shrink-0">
                        {isWithdrawal ? <ArrowDownToLine className="w-4 h-4 text-rose-600" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {t.description}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(t.createdAt).toLocaleDateString('hi-IN')} · {t.id}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-black shrink-0 ml-3 ${
                        isWithdrawal
                          ? 'text-rose-600 dark:text-rose-400'
                          : isPlanPayment
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isWithdrawal ? `- ₹${t.amount}` : isPlanPayment ? `₹${t.amount}` : `+ ₹${t.amount}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🌟 DUAL GAMIFICATION & TIMELINE SHOWCASE CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Leaderboard Showcase Preview Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-slate-900 border border-yellow-300/60 dark:border-yellow-700/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-yellow-200/60 dark:border-yellow-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-[#ffe11b] flex items-center justify-center text-slate-950 shadow-xs">
                    <Trophy className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>टॉप 10 चैंपियंस लीडरबोर्ड</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400 text-slate-950 font-black">
                        LIVE
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500">सबसे ज्यादा डायरेक्ट रेफ़रल व कुल कमाई वाले मेंबर्स</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDashboardTab('leaderboard')}
                  className="text-xs font-black text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>पूरा लीडरबोर्ड देखें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top 3 Quick Preview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {leaderboardMembers.slice(0, 3).map((m, idx) => (
                  <div
                    key={m.userId}
                    onClick={() => setDashboardTab('leaderboard')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      idx === 0
                        ? 'bg-amber-100/70 dark:bg-amber-900/40 border-yellow-400'
                        : 'bg-white/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black">{idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : '🥉 #3'}</div>
                    <img
                      src={m.profilePic}
                      alt={m.name}
                      className="w-10 h-10 rounded-full mx-auto my-1.5 object-cover border-2 border-yellow-400 shadow-xs"
                    />
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">{m.name.split(' ')[0]}</div>
                    <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{m.directReferrals} रेफ़रल</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-yellow-200 dark:border-yellow-800/30 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {leaderboardMembers.some((m) => m.userId === user.userId)
                    ? `आपकी लीडरबोर्ड रैंक: #${leaderboardMembers.findIndex((m) => m.userId === user.userId) + 1}`
                    : `आपकी वर्तमान रेफ़रल संख्या: ${user.level1Count || 0}`}
                </span>
                <button
                  type="button"
                  onClick={() => setDashboardTab('leaderboard')}
                  className="font-black text-[#2874f0] hover:underline cursor-pointer"
                >
                  रैंक बढ़ाएं →
                </button>
              </div>
            </div>

            {/* 2. Activity Log Step-List Preview Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-slate-900 border border-blue-200/60 dark:border-blue-800/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#2874f0] flex items-center justify-center text-white shadow-xs">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>हालिया गतिविधि टाइमलाइन</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {activityItems.length} स्टेप्स
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500">रेफ़रल जॉइनिंग व कमीशन का क्रमिक स्टेप-बाय-स्टेप प्रवाह</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDashboardTab('activity')}
                  className="text-xs font-black text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>पूरी टाइमलाइन</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Step Mini Timeline */}
              <div className="space-y-2.5">
                {activityItems.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => setDashboardTab('activity')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 hover:border-[#2874f0] transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                        {act.stepNumber}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{act.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(act.timestamp).toLocaleDateString('hi-IN')}
                        </div>
                      </div>
                    </div>

                    {act.amount !== undefined && (
                      <span className="font-black text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                        +₹{act.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDashboardTab('activity')}
                className="w-full py-2 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>स्टेप-बाय-स्टेप एक्टिविटी टाइमलाइन खोलें</span>
              </button>
            </div>
          </div>

          {/* Profile Details & Payout UPI details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>पंजीकृत पेआउट (UPI) जानकारी</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(true)}
                  className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>बदलें</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">UPI ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{user.upiId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">खाताधारक नाम:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.upiName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">WhatsApp नंबर:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.whatsapp}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Telegram ID:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.telegram || 'दर्ज नहीं'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>स्पॉन्सर व नेटवर्क जानकारी</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">स्पॉन्सर का नाम:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.sponsorName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">स्पॉन्सर FME ID:</span>
                  <span className="font-mono font-bold text-[#2874f0]">{user.sponsorId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">रजिस्ट्रेशन तिथि:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">सर्विस प्लान:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{user.plan} (वन-टाइम)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}


      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              पैसे निकालें (Withdraw Funds)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              उपलब्ध बैलेंस: <strong>₹{user.walletBalance}</strong> (न्यूनतम: ₹50)
            </p>

            {withdrawError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                {withdrawError}
              </div>
            )}
            {withdrawSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                {withdrawSuccess}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  निकासी राशि (रुपयों में) *
                </label>
                <input
                  type="number"
                  min="50"
                  max={user.walletBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="text-slate-500">क्रेडिट होने वाला UPI खाता:</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white">{user.upiId}</div>
                <div className="text-slate-500 font-medium">नाम: {user.upiName}</div>
              </div>

              <button
                type="submit"
                disabled={withdrawLoading || user.walletBalance < 50}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all duration-200"
              >
                {withdrawLoading ? 'अनुरोध भेजा जा रहा है...' : 'विड्रॉल कन्फर्म करें'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                प्रोफाइल अपडेट करें (Edit Profile)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              अपनी पेआउट (UPI) जानकारी और संपर्क विवरण अपडेट करें।
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  प्रोफाइल अवतार चुनें (Choose Avatar)
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {AVATAR_PRESETS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfilePic(avatar)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-95 border-2 ${
                        profilePic === avatar
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={avatar} alt="Avatar" className="w-11 h-11 object-cover" />
                      {profilePic === avatar && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पेआउट UPI ID (जैसे mobile@upi या name@oksbi) *
                </label>
                <input
                  type="text"
                  required
                  value={profileUpiId}
                  onChange={(e) => setProfileUpiId(e.target.value)}
                  placeholder="name@okaxis / 98XXXXXXXX@paytm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* UPI Account Holder Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  UPI खाताधारक का नाम (Account Holder Name) *
                </label>
                <input
                  type="text"
                  required
                  value={profileUpiName}
                  onChange={(e) => setProfileUpiName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* WhatsApp & Telegram row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telegram ID / Handle
                  </label>
                  <input
                    type="text"
                    value={profileTelegram}
                    onChange={(e) => setProfileTelegram(e.target.value)}
                    placeholder="@username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* FME System Info (Read-only) */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div>FME आईडी: <strong className="font-mono text-slate-800 dark:text-slate-200">{user.userId}</strong> (बदला नहीं जा सकता)</div>
                <div>स्पॉन्सर: <strong className="text-slate-800 dark:text-slate-200">{user.sponsorName} ({user.sponsorId})</strong></div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="w-1/3 py-3 px-4 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {profileSaving ? (
                    <span>सेव हो रहा है...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>प्रोफाइल सेव करें</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔍 LIGHTBOX MODAL FOR USER PAYMENT PROOF */}
      {proofPreviewOpen && user.paymentProof && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>आपका अपलोड किया गया पेमेंट स्क्रीनशॉट</span>
              </div>
              <button
                type="button"
                onClick={() => setProofPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 border border-slate-200/60 dark:border-slate-800">
              <img
                src={user.paymentProof}
                alt="Payment Proof"
                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
              />
            </div>

            <div className="mt-3 text-center space-y-2">
              <div className="text-[11px] text-slate-500">
                {user.paymentProofUploadedAt && (
                  <span>अपलोड समय: {new Date(user.paymentProofUploadedAt).toLocaleString('hi-IN')}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setProofPreviewOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                विंडो बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 SOCIAL SHARE SUITE MODAL (WhatsApp, Telegram, Pre-filled pitch generator) */}
      <SocialShareModal
        user={user}
        isOpen={socialShareOpen}
        onClose={() => setSocialShareOpen(false)}
        referralLink={referralLink}
      />

      {/* 💳 ONLINE PAYMENT GATEWAY MODAL (UPI & STRIPE) */}
      <PaymentGatewayModal
        isOpen={paymentGatewayOpen}
        onClose={() => setPaymentGatewayOpen(false)}
        selectedPlan={user.plan}
        currentUser={user}
        onPaymentSuccess={handlePaymentGatewaySuccess}
      />

      {/* 🎉 THANK YOU ORDER CONFIRMATION MODAL */}
      <ThankYouModal
        isOpen={thankYouOpen}
        onClose={() => setThankYouOpen(false)}
        user={user}
        planId={user.plan}
        method={paymentSuccessData?.method || 'upi'}
        utrNumber={paymentSuccessData?.utrNumber}
        onGoToDashboard={() => setThankYouOpen(false)}
        onViewDigitalCard={() => {
          setThankYouOpen(false);
          const el = document.getElementById('fme-digital-id-card');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 💬 1-ON-1 ADMIN PRIVATE GUIDE CHAT MODAL */}
      <PrivateChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        currentUser={user}
      />

      {/* 🔔 NOTIFICATION CENTER MODAL */}
      <NotificationCenterModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        currentUser={user}
      />
    </div>
  );
};
