import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  Search,
  Check,
  X,
  CreditCard,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Eye,
  GitBranch,
  Phone,
  Mail,
  Send,
  MessageCircle,
  FileText,
  UserCheck,
  Lock,
  Megaphone,
  Settings,
  Edit,
  Trash2,
  Save,
  MessageSquare,
  KeyRound,
  AlertCircle,
  Award,
  Crown,
  Copy,
  Upload,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { UserProfile, WithdrawalRequest, SystemSettings, PlanType, NotificationItem, ChatMessage } from '../types';
import { PLANS, OFFICIAL_UPI_ID, OFFICIAL_UPI_NAME, ADMIN_SECRET_CODE } from '../data/plans';
import {
  getAllUsers,
  activateUserPlan,
  rejectUserPlan,
  getWithdrawals,
  updateWithdrawalStatus,
  getUserDownline,
  DownlineReport,
  verifyAdminPassword,
  getSystemSettings,
  updateSystemSettings,
  adminUpdateUser,
  adminDeleteUser,
  sendBroadcastNotification,
  getNotifications,
  getChatUserList,
  getChatMessages,
  sendChatMessage,
} from '../services/fmeService';
import { useToast } from './Toast';
import { FmeLogo, FME_LOGO_OPTIONS, getActiveLogoImage, setAdminActiveLogo } from './FmeLogo';
import { compressImageFile } from '../utils/imageCompressor';

interface AdminPanelProps {
  onBackToApp: () => void;
  currentUser: UserProfile;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp, currentUser }) => {
  const { showToast } = useToast();
  // Secret Password Gate (RAINAKSH)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('fme_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Main Tabs (Includes Brand Logo Manager)
  const [activeTab, setActiveTab] = useState<
    'users' | 'control' | 'broadcast' | 'chat' | 'withdrawals' | 'whatsapp_page' | 'logo_manager'
  >('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Brand Logo Studio State
  const [activeLogoSrc, setActiveLogoSrc] = useState<string>(() => getActiveLogoImage());
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    return localStorage.getItem('fme_selected_logo_id') || 'option1';
  });
  const [customLogoFileUrl, setCustomLogoFileUrl] = useState<string>(() => {
    return localStorage.getItem('fme_custom_uploaded_logo') || '';
  });
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFileSizeKb, setLogoFileSizeKb] = useState(0);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleUploadLogoFromPhone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const result = await compressImageFile(file, 800, 0.85);
      setCustomLogoFileUrl(result.dataUrl);
      setLogoFileName(result.fileName);
      setLogoFileSizeKb(result.compressedSizeKb);
      setActiveLogoSrc(result.dataUrl);
      setAdminActiveLogo('custom', result.dataUrl);
      updateSystemSettings({ customLogoUrl: result.dataUrl, selectedLogoId: 'custom' });
      showToast(
        'लोगो अपलोड व सक्रिय हुआ! ✓',
        'आपका कस्टम लोगो पूरे प्लेटफ़ॉर्म (हेडर, ID कार्ड, पोस्टर्स) पर तुरंत लागू हो गया है।',
        'success'
      );
    } catch (err: any) {
      showToast('अपलोड विफल', err?.message || 'लोगो इमेज प्रोसेस नहीं हो सकी।', 'error');
    } finally {
      setLogoUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectPresetLogo = (presetId: string, name: string) => {
    setSelectedPresetId(presetId);
    setCustomLogoFileUrl('');
    setAdminActiveLogo(presetId);
    setActiveLogoSrc(getActiveLogoImage());
    updateSystemSettings({ customLogoUrl: '', selectedLogoId: presetId });
    showToast(
      'लोगो सफलतापूर्वक सेट हुआ! ✓',
      `अब पूरे सिस्टम में "${name}" सक्रिय है।`,
      'success'
    );
  };

  const handleRemoveCustomLogo = () => {
    setCustomLogoFileUrl('');
    setLogoFileName('');
    setLogoFileSizeKb(0);
    setAdminActiveLogo('option1');
    setActiveLogoSrc(getActiveLogoImage());
    updateSystemSettings({ customLogoUrl: '', selectedLogoId: 'option1' });
    showToast('कस्टम लोगो हटाया गया', 'सिस्टम अब डिफ़ॉल्ट 3D FME लोगो पर रीसेट हो गया है।', 'info');
  };

  // WhatsApp Page Builder State
  const [waPageTitle, setWaPageTitle] = useState('FRESH MONEY EARN (FME) - ऑफिशियल व्हाट्सएप कम्युनिटी');
  const [waNumber, setWaNumber] = useState('918877490845');
  const [waGroupLink, setWaGroupLink] = useState('https://chat.whatsapp.com/FmeEarningsGroupOfficial');
  const [waWelcomeMsg, setWaWelcomeMsg] = useState('नमस्ते Admin विकास कुमार, मुझे FME ₹100/₹500/₹1000 प्लान जॉइन करना है और पेमेंट विवरण चाहिए।');
  const [waAnnouncement, setWaAnnouncement] = useState('⚡ आज ही FME जॉइन करें और पहले ही दिन से ₹65 / ₹365 / ₹765 डायरेक्ट पेआउट पाएं!');
  const [copiedWaLink, setCopiedWaLink] = useState(false);

  // Modals for inspecting form data and downline network
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserProfile | null>(null);
  const [selectedUserForDownline, setSelectedUserForDownline] = useState<UserProfile | null>(null);
  const [viewingProof, setViewingProof] = useState<{
    url: string;
    title: string;
    user?: UserProfile;
  } | null>(null);

  // Reject Modal
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('पेमेंट स्क्रीनशॉट या UTR विवरण अस्पष्ट पाया गया।');

  // Master Control Settings
  const [settings, setSettings] = useState<SystemSettings>({
    adminUpiId: OFFICIAL_UPI_ID,
    adminUpiName: OFFICIAL_UPI_NAME,
    adminWhatsApp: '918877490845',
    adminEmail: 'freshmoneyearn@gmail.com',
    notice: 'JOINING CHARGE PAYMENT करके JOIN कीजिए और दुसरो को JOIN करके अपनी कमाई शुरु करे।',
    minWithdrawal: 50,
    adminSecretPassword: ADMIN_SECRET_CODE,
    stripeEnabled: true,
    allowDirectRegistration: true,
  });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFields, setEditFields] = useState<Partial<UserProfile>>({});

  // Broadcast Center State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<NotificationItem['type']>('broadcast');
  const [sentBroadcasts, setSentBroadcasts] = useState<NotificationItem[]>([]);

  // 1-on-1 Chat Desk State
  const [chatUsers, setChatUsers] = useState<
    { userId: string; name: string; username: string; unreadCount: number; lastMessage?: string; plan: PlanType }[]
  >([]);
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [chatThread, setChatThread] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');

  useEffect(() => {
    if (isAdminUnlocked) {
      loadData();
    }
  }, [isAdminUnlocked]);

  const loadData = async () => {
    setLoading(true);
    const uList = await getAllUsers();
    setUsers(uList);
    const wList = await getWithdrawals();
    setWithdrawals(wList);
    const s = await getSystemSettings();
    setSettings(s);
    const notifs = await getNotifications();
    setSentBroadcasts(notifs.filter((n) => n.targetUserId === 'all'));
    const cUsers = await getChatUserList();
    setChatUsers(cUsers);
    setLoading(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('fme_admin_unlocked', 'true');
      setPasswordError('');
      showToast('एडमिन पैनल अनलॉक!', 'मास्टर कंट्रोल सेंटर में आपका स्वागत है।', 'success');
    } else {
      setPasswordError('गलत एडमिन पासवर्ड! कृपया सही गुप्त पासवर्ड (RAINAKSH) दर्ज करें।');
      showToast('प्रमाणीकरण विफल', 'गलत एडमिन पासवर्ड!', 'error');
    }
  };

  const handleActivate = async (userId: string) => {
    setLoading(true);
    const ok = await activateUserPlan(userId);
    if (ok) {
      setActionMsg(`यूज़र ${userId} की सर्विस एक्टिवेट हो गई और डायरेक्ट पेआउट व 3 LEVEL कमीशन क्रेडिट कर दिया गया!`);
      await loadData();
      if (selectedUserForDetails && selectedUserForDetails.userId === userId) {
        setSelectedUserForDetails((prev) => (prev ? { ...prev, planStatus: 'active' } : null));
      }
      showToast('एक्टिवेशन सफल ✓', `यूज़र ${userId} सक्रिय हो गया और कमीशन वॉलेट में जुड़ गया।`, 'success');
      setTimeout(() => setActionMsg(''), 4000);
    }
    setLoading(false);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingUser) return;
    setLoading(true);
    const ok = await rejectUserPlan(rejectingUser.userId, rejectReason);
    if (ok) {
      showToast('सत्यापन अस्वीकृत', `यूज़र ${rejectingUser.userId} को अस्वीकृति संदेश भेज दिया गया।`, 'info');
      setRejectingUser(null);
      await loadData();
    }
    setLoading(false);
  };

  const handleApproveWithdrawal = async (id: string) => {
    const txnRef = prompt(
      'कृपया UPI / बैंक ट्रांजैक्शन रेफरेंस (UTR) नंबर दर्ज करें:',
      `UPI-${Date.now().toString().slice(-8)}`
    );
    if (txnRef) {
      await updateWithdrawalStatus(id, 'approved', txnRef);
      await loadData();
      showToast('विड्रॉल स्वीकृत!', 'यूजर के बैंक/UPI खाते में दर्ज कर दिया गया।', 'success');
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    if (confirm('क्या आप इस विड्रॉल को अस्वीकार करना चाहते हैं? राशि वॉलेट में वापस हो जाएगी।')) {
      await updateWithdrawalStatus(id, 'rejected');
      await loadData();
      showToast('विड्रॉल अस्वीकार किया गया', 'राशि वॉलेट में सुरक्षित है।', 'info');
    }
  };

  // Master Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSystemSettings(settings);
    if (ok) {
      showToast('सेटिंग्स सेव हो गईं!', 'वेबसाइट मास्टर सेटिंग्स सुरक्षित अपडेट हो गईं।', 'success');
    }
  };

  // User Edit Save
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const ok = await adminUpdateUser(editingUser.userId, editFields);
    if (ok) {
      showToast('यूज़र डेटा अपडेट हुआ!', `यूज़र ${editingUser.userId} का विवरण बदल दिया गया।`, 'success');
      setEditingUser(null);
      await loadData();
    }
  };

  // User Delete
  const handleDeleteUser = async (userId: string) => {
    if (confirm(`चेतावनी: क्या आप सचमुच यूज़र ${userId} को पूरी तरह डिलीट करना चाहते हैं? यह क्रिया वापस नहीं होगी।`)) {
      const ok = await adminDeleteUser(userId);
      if (ok) {
        showToast('यूज़र डिलीट किया गया', `यूज़र ${userId} सिस्टम से हटा दिया गया।`, 'info');
        await loadData();
      }
    }
  };

  // Send Broadcast to All
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    await sendBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType);
    showToast('ब्रॉडकास्ट प्रसारित!', 'सभी यूज़र्स को तुरंत नया नोटिफिकेशन भेज दिया गया।', 'success');
    setBroadcastTitle('');
    setBroadcastMessage('');
    await loadData();
  };

  // Chat select & send
  const handleSelectChatUser = async (userId: string) => {
    setSelectedChatUser(userId);
    const msgs = await getChatMessages(userId);
    setChatThread(msgs);
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUser || !adminReplyText.trim()) return;
    const sent = await sendChatMessage({
      fromUserId: 'FME_ADMIN',
      toUserId: selectedChatUser,
      senderName: 'विकास कुमार (सुपर एडमिन)',
      senderRole: 'admin',
      message: adminReplyText.trim(),
    });
    setChatThread((prev) => [...prev, sent]);
    setAdminReplyText('');
    showToast('संदेश भेजा गया ✓', 'यूजर को पर्सनल गाइड उत्तर प्रेषित हुआ।', 'success');
  };

  // Filtered users for table
  const filteredUsers = users.filter(
    (u) =>
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.whatsapp.includes(searchQuery) ||
      u.sponsorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔒 IF NOT UNLOCKED: RENDER STRICT PASSWORD GATE (RAINAKSH)
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl shadow-2xl p-7 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              सुरक्षित एडमिन पैनल (Secret Admin Gate)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              यह पैनल केवल अधिकृत मास्टर एडमिन के लिए आरक्षित है। प्रवेश करने के लिए अपना गुप्त एडमिन पासवर्ड दर्ज करें।
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                मास्टर एडमिन पासवर्ड (Secret Password):
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="एडमिन पासवर्ड दर्ज करें..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
              {passwordError && (
                <div className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBackToApp}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#2874f0] hover:bg-blue-600 active:scale-98 text-white font-black text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>अनलॉक करें</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            FME सुरक्षित डेटाबेस एन्क्रिप्शन सक्रिय है।
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner & Navigation Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-[#2874f0] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-700/40">
        <div className="flex items-center gap-4">
          <FmeLogo variant="icon" size="md" withGlow={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                FME मास्टर एडमिन पैनल (Control Hub)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase">
                RAINAKSH
              </span>
            </div>
            <p className="text-xs text-blue-100">
              स्वागत है विकास कुमार! सम्पूर्ण वेबसाइट, यूज़र्स, पेमेंट्स, ब्रॉडकास्ट व चैट का पूर्ण नियंत्रण।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">रिफ्रेश</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>डैशबोर्ड / ऐप में लौटें</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-[#2874f0] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>यूज़र्स & वेरिफिकेशन ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('control')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'control'
              ? 'bg-[#2874f0] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>वेबसाइट मास्टर कंट्रोल</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('broadcast')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'broadcast'
              ? 'bg-[#2874f0] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>ब्रॉडकास्ट नोटिफिकेशन</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'chat'
              ? 'bg-[#2874f0] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>1-on-1 यूजर प्राइवेट चैट</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('withdrawals')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'withdrawals'
              ? 'bg-[#2874f0] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>विड्रॉल अनुरोध ({withdrawals.filter((w) => w.status === 'pending').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp_page')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'whatsapp_page'
              ? 'bg-[#25D366] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" />
          <span>व्हाट्सएप पेज क्रिएटर</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logo_manager')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
            activeTab === 'logo_manager'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md ring-2 ring-yellow-400'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>🎨 ब्रांड लोगो स्टूडियो & फोन अपलोड</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1️⃣ USERS & VERIFICATION TAB (WITH ACCEPT / REJECT / PROOF) */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="यूज़र ID, नाम, फ़ोन, स्पॉन्सर ID या ईमेल से खोजें..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#2874f0] focus:outline-hidden"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold shrink-0">
              कुल सदस्य: <strong>{filteredUsers.length}</strong>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-3.5 font-bold">सदस्य / ID</th>
                    <th className="p-3.5 font-bold">प्लान & स्थिति</th>
                    <th className="p-3.5 font-bold">पेमेंट प्रूफ</th>
                    <th className="p-3.5 font-bold">स्पॉन्सर</th>
                    <th className="p-3.5 font-bold">वॉलेट बैलेंस</th>
                    <th className="p-3.5 font-bold text-right">कार्य (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isPending = u.planStatus === 'pending';
                    const isRejected = u.planStatus === 'rejected';
                    const hasProof = !!u.paymentProof;

                    return (
                      <tr key={u.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                <span>{u.name}</span>
                                {u.role === 'admin' && (
                                  <span className="text-[9px] bg-purple-100 text-purple-800 px-1 rounded">Admin</span>
                                )}
                              </div>
                              <div className="font-mono text-[11px] text-slate-500 font-bold">{u.userId}</div>
                              <div className="text-[10px] text-slate-400">@{u.username} · {u.whatsapp}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className="font-black font-mono text-slate-900 dark:text-white">
                              ₹{u.plan} प्लान
                            </span>
                            <div>
                              {u.planStatus === 'active' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  ✓ सक्रिय
                                </span>
                              ) : isRejected ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                  अस्वीकृत
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                                  सत्यापन बाकी
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Payment Proof Column */}
                        <td className="p-3.5">
                          {hasProof ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={u.paymentProof}
                                alt="Proof"
                                onClick={() =>
                                  setViewingProof({
                                    url: u.paymentProof!,
                                    title: `${u.name} (${u.userId}) - ₹${u.plan}`,
                                    user: u,
                                  })
                                }
                                className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-500 cursor-pointer hover:scale-105 transition-transform"
                                title="क्लिक करके ज़ूम करें"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setViewingProof({
                                    url: u.paymentProof!,
                                    title: `${u.name} (${u.userId}) - ₹${u.plan}`,
                                    user: u,
                                  })
                                }
                                className="text-[11px] font-bold text-[#2874f0] hover:underline"
                              >
                                रसीद देखें
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">अपलोड नहीं</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {u.sponsorId}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{u.sponsorName}</div>
                        </td>

                        <td className="p-3.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          ₹{u.walletBalance.toLocaleString('en-IN')}
                        </td>

                        {/* Actions: Accept, Reject, Details, Downline */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleActivate(u.userId)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>स्वीकार (Accept)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setRejectingUser(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>अस्वीकार</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedUserForDetails(u)}
                            className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>फॉर्म</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedUserForDownline(u)}
                            className="px-2 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <GitBranch className="w-3 h-3" />
                            <span>टीम</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2️⃣ WEBSITE MASTER CONTROL (SETTINGS & USER MANAGEMENT) */}
      {/* ======================================================== */}
      {activeTab === 'control' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Site Global Configuration Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#2874f0]" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">वेबसाइट मास्टर सेटिंग्स</h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                लाइव
              </span>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  आधिकारिक UPI आईडी (Payment Receiver):
                </label>
                <input
                  type="text"
                  required
                  value={settings.adminUpiId}
                  onChange={(e) => setSettings({ ...settings, adminUpiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  UPI खाताधारक नाम:
                </label>
                <input
                  type="text"
                  required
                  value={settings.adminUpiName}
                  onChange={(e) => setSettings({ ...settings, adminUpiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  एडमिन WhatsApp नंबर:
                </label>
                <input
                  type="text"
                  required
                  value={settings.adminWhatsApp}
                  onChange={(e) => setSettings({ ...settings, adminWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  होम पेज विशेष सूचना (Announcement):
                </label>
                <textarea
                  rows={3}
                  value={settings.notice}
                  onChange={(e) => setSettings({ ...settings, notice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    न्यूनतम विड्रॉल (₹):
                  </label>
                  <input
                    type="number"
                    value={settings.minWithdrawal}
                    onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    एडमिन गुप्त पासवर्ड:
                  </label>
                  <input
                    type="text"
                    value={settings.adminSecretPassword}
                    onChange={(e) => setSettings({ ...settings, adminSecretPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>मास्टर सेटिंग्स सेव करें</span>
              </button>
            </form>
          </div>

          {/* User Master Management Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  यूज़र डेटा पूर्ण नियंत्रण (User Master Control)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">ID, पासवर्ड, प्लान, वॉलेट एडिट</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                नीचे किसी भी यूज़र को चुनें। आप उसका FME ID, पासवर्ड, मोबाइल, प्लान, वॉलेट बैलेंस आदि सीधे बदल या डिलीट कर सकते हैं।
              </p>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {users.map((u) => (
                  <div
                    key={u.userId}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="font-mono text-emerald-600 font-black">{u.userId}</span>
                        <span>· {u.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        पासवर्ड: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{u.password || '******'}</span> · वॉलेट: ₹{u.walletBalance} · प्लान: ₹{u.plan}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setEditFields({
                            name: u.name,
                            userId: u.userId,
                            password: u.password,
                            plan: u.plan,
                            walletBalance: u.walletBalance,
                            whatsapp: u.whatsapp,
                            upiId: u.upiId,
                            planStatus: u.planStatus,
                          });
                        }}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>एडिट</span>
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.userId)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs cursor-pointer"
                          title="यूज़र डिलीट करें"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3️⃣ BROADCAST NOTIFICATION SENDER */}
      {/* ======================================================== */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Megaphone className="w-5 h-5 text-[#2874f0]" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                सभी यूज़र्स को एक साथ संदेश भेजें (Broadcast to All)
              </h3>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  नोटिफिकेशन शीर्षक (Title):
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="उदा. 📢 विशेष सूचना: डायरेक्ट पेआउट जारी!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  प्रकार (Category):
                </label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="broadcast">📢 सामान्य घोषणा (Broadcast)</option>
                  <option value="payout">💰 पेआउट अलर्ट (Payout)</option>
                  <option value="system">⚡ सिस्टम अपडेट (System Update)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  विस्तृत संदेश (Full Message):
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="यहाँ वह पूरा संदेश लिखें जो सभी उपयोगकर्ताओं के डैशबोर्ड नोटिफिकेशन में तुरंत दिखेगा..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>📢 सभी {users.length} यूज़र्स को तुरंत प्रसारित करें</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              भेजे गए हालिया ब्रॉडकास्ट्स
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {sentBroadcasts.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                    <span>{b.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {b.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4️⃣ 1-ON-1 USER PRIVATE CHAT & PERSONAL GUIDE DESK */}
      {/* ======================================================== */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* User List Column (4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2874f0]" />
              <span>यूजर चैट इनबॉक्स</span>
            </h3>

            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {chatUsers.map((u) => {
                const isSelected = selectedChatUser === u.userId;
                return (
                  <button
                    key={u.userId}
                    type="button"
                    onClick={() => handleSelectChatUser(u.userId)}
                    className={`w-full p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-[#2874f0] ring-1 ring-[#2874f0]'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {u.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {u.userId} · ₹{u.plan}
                      </div>
                      {u.lastMessage && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[170px]">
                          {u.lastMessage}
                        </div>
                      )}
                    </div>

                    {u.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {u.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Column (8 cols) */}
          <div className="lg:col-span-8 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            {selectedChatUser ? (
              <>
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      बातचीत: {users.find((u) => u.userId === selectedChatUser)?.name} ({selectedChatUser})
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      1-on-1 व्यक्तिगत मार्गदर्शन मोड
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${users.find((u) => u.userId === selectedChatUser)?.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Messages */}
                <div className="my-4 space-y-3 overflow-y-auto max-h-[350px] p-2 flex-1">
                  {chatThread.map((m) => {
                    const isAdmin = m.senderRole === 'admin';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {isAdmin ? 'आप (सुपर एडमिन)' : m.senderName}
                        </span>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                            isAdmin
                              ? 'bg-[#2874f0] text-white rounded-br-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                          }`}
                        >
                          {m.message}
                        </div>
                        <span className="text-[9px] text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendAdminReply} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="यूज़र को व्यक्तिगत गाइड / उत्तर लिखें..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>उत्तर भेजें</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center p-8 text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
                <div>बाईं सूची से किसी भी यूज़र को चुनकर 1-ऑन-1 चैट और गाइडेंस शुरू करें।</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5️⃣ WITHDRAWALS TAB */}
      {/* ======================================================== */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs font-bold">
            <span>पेंडिंग व प्रोसेस किए गए विड्रॉल अनुरोध</span>
            <span className="text-slate-500">कुल: {withdrawals.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <th className="p-3">सदस्य</th>
                  <th className="p-3">राशि</th>
                  <th className="p-3">UPI विवरण</th>
                  <th className="p-3">तिथि</th>
                  <th className="p-3">स्थिति</th>
                  <th className="p-3 text-right">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold">{w.userName}</div>
                      <div className="font-mono text-slate-500">{w.userId}</div>
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-600 text-sm">₹{w.amount}</td>
                    <td className="p-3">
                      <div className="font-mono font-bold">{w.upiId}</div>
                      <div className="text-[10px] text-slate-400">{w.upiName}</div>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      {w.status === 'approved' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          सफल ({w.txnRef})
                        </span>
                      ) : w.status === 'rejected' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          अस्वीकृत
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                          पेंडिंग
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {w.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            अप्रूव
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectWithdrawal(w.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                          >
                            अस्वीकार
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6️⃣ WHATSAPP PAGE BUILDER & COMMUNITY HUB (ADMIN ONLY) */}
      {/* ======================================================== */}
      {activeTab === 'whatsapp_page' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#25D366] via-emerald-600 to-teal-800 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-xs mb-2">
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>WHATSAPP PAGE & BROADCAST BUILDER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                व्हाट्सएप पेज व ग्रुप ब्रॉडकास्ट क्रिएटर
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
                यहाँ से आप अपना आधिकारिक FME व्हाट्सएप लैंडिंग पेज, ग्रुप इनवाइट लिंक, और प्री-फिल्ड डायरेक्ट चैट लिंक्स डिजाइन और कस्टमाइज कर सकते हैं।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/#whatsapp-community`);
                  setCopiedWaLink(true);
                  showToast('पेज लिंक कॉपी हुआ ✓', 'व्हाट्सएप लैंडिंग पेज लिंक क्लिपबोर्ड में कॉपी हो गया।', 'success');
                  setTimeout(() => setCopiedWaLink(false), 2000);
                }}
                className="py-2.5 px-4 rounded-xl bg-white text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-emerald-50 transition-all active:scale-95"
              >
                {copiedWaLink ? <Check className="w-4 h-4 text-emerald-700" /> : <ExternalLink className="w-4 h-4 text-slate-800" />}
                <span>{copiedWaLink ? 'लिंक कॉपी हुआ ✓' : 'पेज लिंक कॉपी करें'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Configuration Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Settings className="w-4 h-4 text-[#25D366]" />
                  <span>व्हाट्सएप पेज सेटिंग्स (Page Configuration)</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    व्हाट्सएप पेज का मुख्य शीर्षक (Page Title):
                  </label>
                  <input
                    type="text"
                    value={waPageTitle}
                    onChange={(e) => setWaPageTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      एडमिन बिजनेस व्हाट्सएप नंबर:
                    </label>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="उदा. 918877490845"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      व्हाट्सएप ग्रुप / कम्युनिटी लिंक:
                    </label>
                    <input
                      type="text"
                      value={waGroupLink}
                      onChange={(e) => setWaGroupLink(e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ऑफर हेडलाइन / घोषणा संदेश (Offer Headline):
                  </label>
                  <input
                    type="text"
                    value={waAnnouncement}
                    onChange={(e) => setWaAnnouncement(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    डिफ़ॉल्ट वेलकम चैट संदेश (Pre-filled Chat Message):
                  </label>
                  <textarea
                    rows={3}
                    value={waWelcomeMsg}
                    onChange={(e) => setWaWelcomeMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('सेटिंग्स सेव हो गईं!', 'व्हाट्सएप पेज कॉन्फ़िगरेशन अपडेट हो गया है।', 'success');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>व्हाट्सएप पेज सेटिंग्स सेव करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const broadcastCopy = `🔥 ${waPageTitle} 🔥\n\n${waAnnouncement}\n\n👉 ग्रुप जॉइन करें: ${waGroupLink}\n📲 सीधा एडमिन चैट: https://wa.me/${waNumber}?text=${encodeURIComponent(waWelcomeMsg)}`;
                      navigator.clipboard.writeText(broadcastCopy);
                      showToast('ब्रॉडकास्ट टेक्स्ट कॉपी हुआ ✓', 'पूरा ब्रॉडकास्ट संदेश कॉपी हो गया।', 'success');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>ब्रॉडकास्ट कॉपी</span>
                  </button>
                </div>
              </div>

              {/* 3-Plan Quick Chat Links Tester */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>3-प्लान डायरेक्ट चैट लिंक्स (Instant Direct Links)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  प्रत्येक प्लान के लिए कस्टम व्हाट्सएप लिंक जो यूज़र को सीधे विशिष्ट प्लान एक्टिवेशन मैसेज पर ले जाता है:
                </p>

                <div className="space-y-2">
                  {PLANS.map((p) => {
                    const planChatUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `नमस्ते विकास कुमार, मुझे FME का ₹${p.price} (${p.name}) प्लान जॉइन करना है। कृपया पेमेंट QR व एक्टिवेशन विवरण दें।`
                    )}`;
                    return (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="font-black text-emerald-600">₹{p.price}</span>
                            <span>{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({p.directCommission} पेआउट)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-xs font-mono">
                            {planChatUrl}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(planChatUrl);
                              showToast('लिंक कॉपी हुआ ✓', `₹${p.price} का व्हाट्सएप लिंक कॉपी हो गया।`, 'success');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100"
                          >
                            कॉपी
                          </button>
                          <a
                            href={planChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <span>टेस्ट करें</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Simulated Mobile Phone Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>लाइव मोबाइल स्क्रीन प्रीव्यू (Visitor View)</span>
              </div>

              {/* Smartphone Frame */}
              <div className="mx-auto max-w-sm rounded-[36px] bg-slate-950 p-3.5 shadow-2xl border-4 border-slate-800">
                {/* Speaker notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3" />

                {/* Simulated Screen Body */}
                <div className="rounded-[28px] bg-slate-900 text-white overflow-hidden border border-slate-800 p-4 space-y-4 min-h-[500px]">
                  {/* WhatsApp Brand Header */}
                  <div className="p-3 rounded-2xl bg-[#075E54] text-white flex items-center gap-2.5 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 fill-white text-[#075E54]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">{waPageTitle}</div>
                      <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        <span>Online · सुपर एडमिन विकास कुमार</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand Luxury Emblem */}
                  <div className="flex justify-center py-2">
                    <FmeLogo variant="horizontal" size="sm" />
                  </div>

                  {/* Announcement Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-[11px] text-amber-200 text-center font-bold">
                    {waAnnouncement}
                  </div>

                  {/* Join Group Big Button */}
                  <a
                    href={waGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>व्हाट्सएप ग्रुप से तुरंत जुड़ें</span>
                  </a>

                  {/* Quick Plan Direct Chat Options */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 text-center">
                      सीधे प्लान चुनकर एडमिन से बात करें:
                    </div>

                    {PLANS.map((p) => (
                      <a
                        key={p.id}
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                          `नमस्ते विकास कुमार, मुझे FME का ₹${p.price} (${p.name}) प्लान जॉइन करना है।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400">₹{p.price}</span>
                          <span className="text-white font-bold">{p.name}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <span>चैट शुरू करें</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500 text-center pt-2">
                    100% भारत सरकार डायरेक्ट सेलिंग नियम अनुकूल · त्वरित पेआउट्स
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7️⃣ BRAND LOGO STUDIO & PHONE UPLOAD TAB */}
      {/* ======================================================== */}
      {activeTab === 'logo_manager' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-blue-950/30 border-2 border-amber-400 dark:border-amber-600/50 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    एडमिन विशेष · मास्टर ब्रांडिंग
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    आधिकारिक ब्रांड लोगो स्टूडियो (Phone Upload & Logo Switcher)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    अपने फोन या कंप्यूटर से नया लोगो अपलोड करें या नीचे दिए गए 3D आधिकारिक लोगो में से चुनें।
                  </p>
                </div>
              </div>

              {/* Current Active Logo Mini Badge */}
              <div className="p-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400 shrink-0 bg-slate-950">
                  <img src={activeLogoSrc} alt="Active Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">वर्तमान सक्रिय लोगो:</div>
                  <div className="text-xs font-black text-[#2874f0] dark:text-blue-400">
                    {customLogoFileUrl ? 'कस्टम फोन अपलोड लोगो' : selectedPresetId.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Upload From Phone & Preset Variations */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Phone / Device Gallery Upload Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      1. फोन / गैलरी से अपना लोगो अपलोड करें
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    JPG, PNG, WEBP
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  यदि आपके पास अपना बनाया हुआ लोगो है, तो अपने फोन या कंप्यूटर से सीधे फोटो चुनें। सिस्टम इसे ऑटोमैटिक कंप्रेस करके पूरे ऐप पर लाइव लागू कर देगा।
                </p>

                {/* Hidden File Input */}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadLogoFromPhone}
                  className="hidden"
                />

                {/* Upload Action Box */}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                    logoUploading
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/20'
                  }`}
                >
                  {logoUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-3">
                      <div className="w-7 h-7 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-amber-600">
                        लोगो इमेज प्रोसेस व कंप्रेस हो रही है...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-2 text-slate-600 dark:text-slate-400">
                      <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        फोन से लोगो फोटो चुनने के लिए यहाँ टैप करें
                      </div>
                      <div className="text-xs text-slate-400">
                        कैमरा से फोटो लें या गैलरी से अपलोड करें
                      </div>
                    </div>
                  )}
                </div>

                {/* If custom logo is currently uploaded */}
                {customLogoFileUrl && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0 bg-slate-950">
                        <img src={customLogoFileUrl} alt="Custom Logo" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>कस्टम फोन लोगो सक्रिय है!</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {logoFileName || 'custom_brand_logo.jpg'} ({logoFileSizeKb} KB)
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCustomLogo}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएं</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Choose from Official 3D Variations */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    2. आधिकारिक 3D FME लोगो में से चुनें (Official Preset Designs)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  FME के लिए विशेष रूप से डिज़ाइन किए गए 3D लक्ज़री लोगो। जिसे भी सक्रिय करना हो उसके नीचे बटन दबाएं:
                </p>

                <div className="space-y-3.5">
                  {FME_LOGO_OPTIONS.map((logo) => {
                    const isSelected = !customLogoFileUrl && selectedPresetId === logo.id;

                    return (
                      <div
                        key={logo.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 shadow-md ring-2 ring-yellow-400/40'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-amber-400/50 shadow-md shrink-0">
                            <img src={logo.image} alt={logo.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ffe11b] text-slate-950">
                                {logo.tag}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white">
                                  ✓ सक्रिय
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                              {logo.name}
                            </h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                              {logo.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectPresetLogo(logo.id, logo.name)}
                          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#2874f0] hover:bg-blue-600 text-white'
                          }`}
                        >
                          {isSelected ? '✓ यह एक्टिव है' : 'यह लोगो सेट करें'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Device & Digital ID Card Previews */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-500" />
                <span>लाइव सिस्टम प्रीव्यू (Live Real-Time Appearance)</span>
              </div>

              {/* 1. Header Preview */}
              <div className="p-4 rounded-3xl bg-[#2874f0] text-white shadow-lg space-y-2">
                <div className="text-[10px] uppercase font-bold text-blue-200">
                  वेबसाइट हेडर लुक (Flipkart Blue Navbar)
                </div>
                <div className="p-2.5 rounded-2xl bg-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-yellow-400 shrink-0 bg-slate-950">
                    <img src={activeLogoSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-black text-sm italic tracking-tight">FRESH MONEY EARN</div>
                    <div className="text-[10px] text-yellow-300 font-bold">Explore Plus | 3-Level Service</div>
                  </div>
                </div>
              </div>

              {/* 2. Digital ID Card Live Mock */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950 via-yellow-900 to-slate-950 text-white shadow-xl border border-amber-400/60 relative overflow-hidden space-y-3">
                {/* Watermark in background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                  <img src={activeLogoSrc} alt="" className="w-48 h-48 object-contain" />
                </div>

                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-amber-400 shrink-0 bg-slate-950">
                      <img src={activeLogoSrc} alt="ID Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-300">FRESH MONEY EARN</div>
                      <div className="text-[9px] text-white/80">डिजिटल पहचान पत्र (ID CARD)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    👑 VIP CROWN
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-3 py-1">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 ring-2 ring-amber-400 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-black text-white text-sm">विकास कुमार (Vikas Kumar)</div>
                    <div className="font-mono text-amber-300 font-bold">FME1000VK01</div>
                    <div className="text-[10px] text-emerald-400">✓ एक्टिव डिजिटल मेम्बर</div>
                  </div>
                </div>

                <div className="relative z-10 text-[10px] text-white/70 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>सुरक्षा सील & वाटरमार्क सक्रिय</span>
                  <div className="w-6 h-6 rounded-full overflow-hidden opacity-80 border border-amber-300 shrink-0">
                    <img src={activeLogoSrc} alt="Seal" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* 3. Promotional Poster Banner Preview */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white shadow-md relative overflow-hidden space-y-2 border border-emerald-400/50">
                <div className="text-[10px] uppercase font-bold text-emerald-200">
                  टेलीग्राम प्रमोशन पोस्टर लुक
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-amber-300 bg-slate-950">
                    <img src={activeLogoSrc} alt="Poster Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs">
                    <div className="font-black text-amber-300">FRESH MONEY EARN</div>
                    <div className="text-[10px] text-white/90">₹100, ₹500, ₹1000 डायरेक्ट इनकम</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 LIGHTBOX MODAL: PAYMENT PROOF SCREENSHOT */}
      {viewingProof && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{viewingProof.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800">
              <img
                src={viewingProof.url}
                alt="Payment Proof"
                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
              />
            </div>

            <div className="mt-4 flex gap-2">
              {viewingProof.user && viewingProof.user.planStatus === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleActivate(viewingProof.user!.userId);
                      setViewingProof(null);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    ✓ रसीद सही है — एक्टिवेट करें
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingUser(viewingProof.user!);
                      setViewingProof(null);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    अस्वीकार करें
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ REJECT PAYMENT MODAL */}
      {rejectingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-red-300 dark:border-red-900 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>पेमेंट सत्यापन अस्वीकार करें</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              यूज़र <strong>{rejectingUser.name} ({rejectingUser.userId})</strong> का पेमेंट अस्वीकृत होने पर उन्हें कारण सहित नोटिफिकेशन भेजा जाएगा:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                अस्वीकृति का कारण:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                अस्वीकृत करें व सूचित करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-600" />
                <span>यूज़र एडिट करें: {editingUser.userId}</span>
              </h3>
              <button type="button" onClick={() => setEditingUser(null)} className="p-1 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">FME यूजर ID (Edit):</label>
                <input
                  type="text"
                  value={editFields.userId || ''}
                  onChange={(e) => setEditFields({ ...editFields, userId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">पासवर्ड (Password Edit):</label>
                <input
                  type="text"
                  value={editFields.password || ''}
                  onChange={(e) => setEditFields({ ...editFields, password: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">नाम (Name):</label>
                <input
                  type="text"
                  value={editFields.name || ''}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">प्लान (Plan):</label>
                  <select
                    value={editFields.plan || '500'}
                    onChange={(e) => setEditFields({ ...editFields, plan: e.target.value as PlanType })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <option value="100">₹100 नॉर्मल</option>
                    <option value="500">₹500 प्लेटिनम</option>
                    <option value="1000">₹1000 रॉयल क्राउन VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">अकाउंट स्थिति:</label>
                  <select
                    value={editFields.planStatus || 'pending'}
                    onChange={(e) => setEditFields({ ...editFields, planStatus: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <option value="active">सक्रिय (Active)</option>
                    <option value="pending">सत्यापन बाकी (Pending)</option>
                    <option value="rejected">अस्वीकृत (Rejected)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">वॉलेट बैलेंस (₹):</label>
                <input
                  type="number"
                  value={editFields.walletBalance ?? 0}
                  onChange={(e) => setEditFields({ ...editFields, walletBalance: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">WhatsApp नंबर:</label>
                <input
                  type="text"
                  value={editFields.whatsapp || ''}
                  onChange={(e) => setEditFields({ ...editFields, whatsapp: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">UPI ID:</label>
                <input
                  type="text"
                  value={editFields.upiId || ''}
                  onChange={(e) => setEditFields({ ...editFields, upiId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black cursor-pointer shadow-md"
                >
                  अपडेट सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📄 USER DETAILS MODAL (REGISTRATION FORM INSPECTION) */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>पंजीकरण फॉर्म विवरण: {selectedUserForDetails.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">FME यूज़र ID:</span>
                <span className="font-mono font-bold">{selectedUserForDetails.userId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">यूजरनेम:</span>
                <span className="font-bold">@{selectedUserForDetails.username}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">WhatsApp नंबर:</span>
                <span className="font-bold">{selectedUserForDetails.whatsapp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">ईमेल:</span>
                <span className="font-bold">{selectedUserForDetails.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">UPI ID:</span>
                <span className="font-mono font-bold">{selectedUserForDetails.upiId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">UPI खाताधारक नाम:</span>
                <span className="font-bold">{selectedUserForDetails.upiName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">स्पॉन्सर FME ID:</span>
                <span className="font-mono font-bold">{selectedUserForDetails.sponsorId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">चुना गया प्लान:</span>
                <span className="font-black text-emerald-600">₹{selectedUserForDetails.plan}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">रजिस्ट्रेशन तिथि:</span>
                <span>{new Date(selectedUserForDetails.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUserForDetails(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* 👥 DOWNLINE NETWORK TREE MODAL */}
      {selectedUserForDownline && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <span>डाउनलाइन टीम: {selectedUserForDownline.name} ({selectedUserForDownline.userId})</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUserForDownline(null)}
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold">डायरेक्ट रिक्रूट्स (LEVEL 1): </span>
                <span>{users.filter((u) => u.sponsorId === selectedUserForDownline.userId).length} सदस्य</span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {users
                  .filter((u) => u.sponsorId === selectedUserForDownline.userId)
                  .map((rec) => (
                    <div
                      key={rec.userId}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{rec.name}</div>
                        <div className="font-mono text-slate-500 text-[11px]">{rec.userId} · ₹{rec.plan}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.planStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.planStatus === 'active' ? 'सक्रिय' : 'पेंडिंग'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUserForDownline(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
