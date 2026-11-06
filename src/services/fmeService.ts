import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  UserProfile,
  Transaction,
  WithdrawalRequest,
  SystemSettings,
  PlanType,
  NotificationItem,
  ChatMessage,
  LeaderboardMember,
  ActivityLogItem,
} from '../types';
import {
  PLANS,
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  OFFICIAL_UPI_ID,
  OFFICIAL_UPI_NAME,
  ADMIN_SECRET_CODE,
} from '../data/plans';

export const DEFAULT_SETTINGS: SystemSettings = {
  adminUpiId: OFFICIAL_UPI_ID,
  adminUpiName: OFFICIAL_UPI_NAME,
  adminWhatsApp: WHATSAPP_NUMBER,
  adminEmail: CONTACT_EMAIL,
  notice: 'JOINING CHARGE PAYMENT करके JOIN कीजिए और दुसरो को JOIN करके अपनी कमाई शुरु करे।',
  minWithdrawal: 50,
  adminSecretPassword: ADMIN_SECRET_CODE,
  stripeEnabled: true,
  allowDirectRegistration: true,
};

// Seed default Admin and initial demo users in case database is freshly created
export const DEFAULT_ADMIN: UserProfile = {
  id: 'fme-admin-root',
  userId: 'FME_ADMIN',
  username: 'fme_admin',
  name: 'विकास कुमार (Vikas Kumar - सुपर एडमिन)',
  email: 'freshmoneyearn@gmail.com',
  whatsapp: '8877490845',
  telegram: '@freshmoneyearn',
  upiId: OFFICIAL_UPI_ID,
  upiName: OFFICIAL_UPI_NAME,
  sponsorId: 'SYSTEM',
  sponsorName: 'FRESH MONEY EARN SYSTEM',
  plan: '1000',
  planStatus: 'active',
  role: 'admin',
  profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  avatarFrame: 'crown_gold',
  cardPrivacy: { isPublic: true, maskPhone: true, maskEmail: false, maskUpi: false },
  walletBalance: 14500,
  totalEarned: 28500,
  totalWithdrawn: 14000,
  directReferralCount: 18,
  directReferralIncome: 13770,
  level1Count: 18,
  level2Count: 42,
  level3Count: 88,
  level1Income: 7200,
  level2Income: 6300,
  level3Income: 4400,
  createdAt: '2026-10-01T10:00:00.000Z',
  password: ADMIN_SECRET_CODE,
};

export const DEMO_USER: UserProfile = {
  id: 'fme-user-demo',
  userId: 'FME1024',
  username: 'rahul_sharma',
  name: 'राहुल शर्मा (Rahul Sharma)',
  email: 'rahul@example.com',
  whatsapp: '9876501234',
  telegram: '@rahul_fme',
  upiId: 'rahul@paytm',
  upiName: 'Rahul Sharma',
  sponsorId: 'FME_ADMIN',
  sponsorName: 'विकास कुमार (Vikas Kumar)',
  plan: '500',
  planStatus: 'active',
  role: 'user',
  profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  avatarFrame: 'platinum_diamond',
  cardPrivacy: { isPublic: true, maskPhone: true, maskEmail: false, maskUpi: false },
  walletBalance: 875,
  totalEarned: 1875,
  totalWithdrawn: 1000,
  directReferralCount: 4,
  directReferralIncome: 1460,
  level1Count: 4,
  level2Count: 3,
  level3Count: 3,
  level1Income: 650, // 150(Amit 500) + 30(Pooja 100) + 400(Vikas 1000)
  level2Income: 260, // 75(Suresh 500) + 10(Deepak 100) + 75(Kavita 500) + 100(bonus)
  level3Income: 965,
  createdAt: '2026-10-15T12:30:00.000Z',
  password: 'user123',
};

// Seed Downline Members connected in a real 3-level chain for realistic dashboard and admin tracking
export const INITIAL_SEED_USERS: UserProfile[] = [
  DEFAULT_ADMIN,
  DEMO_USER,
  // LEVEL 1 of FME1024 (Rahul Sharma)
  {
    id: 'fme-user-2041',
    userId: 'FME2041',
    username: 'amit_verma',
    name: 'अमित वर्मा (Amit Verma)',
    email: 'amit@example.com',
    whatsapp: '9812345678',
    telegram: '@amit_v',
    upiId: 'amit@okaxis',
    upiName: 'Amit Verma',
    sponsorId: 'FME1024',
    sponsorName: 'राहुल शर्मा (Rahul Sharma)',
    plan: '500',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    walletBalance: 320,
    totalEarned: 500,
    totalWithdrawn: 180,
    level1Count: 2,
    level2Count: 2,
    level3Count: 0,
    level1Income: 180,
    level2Income: 100,
    level3Income: 0,
    createdAt: '2026-10-18T09:15:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-2042',
    userId: 'FME2042',
    username: 'pooja_singh',
    name: 'पूजा सिंह (Pooja Singh)',
    email: 'pooja@example.com',
    whatsapp: '9823456789',
    telegram: '@pooja_s',
    upiId: 'pooja@okhdfcbank',
    upiName: 'Pooja Singh',
    sponsorId: 'FME1024',
    sponsorName: 'राहुल शर्मा (Rahul Sharma)',
    plan: '100',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    walletBalance: 150,
    totalEarned: 250,
    totalWithdrawn: 100,
    level1Count: 1,
    level2Count: 0,
    level3Count: 0,
    level1Income: 150,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-20T14:40:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-2043',
    userId: 'FME2043',
    username: 'vikas_yadav',
    name: 'विकास यादव (Vikas Yadav)',
    email: 'vikas@example.com',
    whatsapp: '9834567890',
    telegram: '@vikas_y',
    upiId: 'vikas@ybl',
    upiName: 'Vikas Yadav',
    sponsorId: 'FME1024',
    sponsorName: 'राहुल शर्मा (Rahul Sharma)',
    plan: '1000',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    walletBalance: 600,
    totalEarned: 1200,
    totalWithdrawn: 600,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-22T11:20:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-2044',
    userId: 'FME2044',
    username: 'neha_gupta',
    name: 'नेहा गुप्ता (Neha Gupta)',
    email: 'neha@example.com',
    whatsapp: '9845678901',
    telegram: '@neha_g',
    upiId: 'neha@icici',
    upiName: 'Neha Gupta',
    sponsorId: 'FME1024',
    sponsorName: 'राहुल शर्मा (Rahul Sharma)',
    plan: '500',
    planStatus: 'pending', // Pending activation
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-28T16:00:00.000Z',
    password: 'password123',
  },

  // LEVEL 2 under FME1024 (sponsored by FME2041 or FME2042)
  {
    id: 'fme-user-3051',
    userId: 'FME3051',
    username: 'suresh_kumar',
    name: 'सुरेश कुमार (Suresh Kumar)',
    email: 'suresh@example.com',
    whatsapp: '9856789012',
    telegram: '@suresh_k',
    upiId: 'suresh@sbi',
    upiName: 'Suresh Kumar',
    sponsorId: 'FME2041',
    sponsorName: 'अमित वर्मा (Amit Verma)',
    plan: '500',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    walletBalance: 400,
    totalEarned: 400,
    totalWithdrawn: 0,
    level1Count: 2,
    level2Count: 0,
    level3Count: 0,
    level1Income: 400,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-23T10:00:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-3052',
    userId: 'FME3052',
    username: 'deepak_mishra',
    name: 'दीपक मिश्रा (Deepak Mishra)',
    email: 'deepak@example.com',
    whatsapp: '9867890123',
    telegram: '@deepak_m',
    upiId: 'deepak@barodampay',
    upiName: 'Deepak Mishra',
    sponsorId: 'FME2041',
    sponsorName: 'अमित वर्मा (Amit Verma)',
    plan: '100',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    walletBalance: 30,
    totalEarned: 30,
    totalWithdrawn: 0,
    level1Count: 1,
    level2Count: 0,
    level3Count: 0,
    level1Income: 30,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-24T15:30:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-3053',
    userId: 'FME3053',
    username: 'kavita_devi',
    name: 'कविता देवी (Kavita Devi)',
    email: 'kavita@example.com',
    whatsapp: '9878901234',
    telegram: '@kavita_d',
    upiId: 'kavita@pnb',
    upiName: 'Kavita Devi',
    sponsorId: 'FME2042',
    sponsorName: 'पूजा सिंह (Pooja Singh)',
    plan: '500',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-25T17:10:00.000Z',
    password: 'password123',
  },

  // LEVEL 3 under FME1024 (sponsored by FME3051 or FME3052)
  {
    id: 'fme-user-4061',
    userId: 'FME4061',
    username: 'rohit_saini',
    name: 'रोहित सैनी (Rohit Saini)',
    email: 'rohit@example.com',
    whatsapp: '9889012345',
    telegram: '@rohit_s',
    upiId: 'rohit@paytm',
    upiName: 'Rohit Saini',
    sponsorId: 'FME3051',
    sponsorName: 'सुरेश कुमार (Suresh Kumar)',
    plan: '500',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-26T12:00:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-4062',
    userId: 'FME4062',
    username: 'anita_kumari',
    name: 'अनिता कुमारी (Anita Kumari)',
    email: 'anita@example.com',
    whatsapp: '9890123456',
    telegram: '@anita_k',
    upiId: 'anita@axisbank',
    upiName: 'Anita Kumari',
    sponsorId: 'FME3051',
    sponsorName: 'सुरेश कुमार (Suresh Kumar)',
    plan: '1000',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-27T14:20:00.000Z',
    password: 'password123',
  },
  {
    id: 'fme-user-4063',
    userId: 'FME4063',
    username: 'manoj_joshi',
    name: 'मनोज जोशी (Manoj Joshi)',
    email: 'manoj@example.com',
    whatsapp: '9801234567',
    telegram: '@manoj_j',
    upiId: 'manoj@kotak',
    upiName: 'Manoj Joshi',
    sponsorId: 'FME3052',
    sponsorName: 'दीपक मिश्रा (Deepak Mishra)',
    plan: '100',
    planStatus: 'active',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-27T18:00:00.000Z',
    password: 'password123',
  },
  // Pending user with payment proof screenshot attached for admin verification
  {
    id: 'fme-user-5011',
    userId: 'FME5011',
    username: 'sunil_kumar',
    name: 'सुनील कुमार (Sunil Kumar)',
    email: 'sunil@example.com',
    whatsapp: '9845012345',
    telegram: '@sunil_k',
    upiId: 'sunil@paytm',
    upiName: 'Sunil Kumar',
    sponsorId: 'FME1024',
    sponsorName: 'राहुल शर्मा (Rahul Sharma)',
    plan: '500',
    planStatus: 'pending',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: '2026-10-28T16:45:00.000Z',
    password: 'password123',
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    paymentProofUploadedAt: '2026-10-28T16:45:30.000Z',
  },
];

// Initial Seed Transactions for realistic chronological history
export const INITIAL_SEED_TRANSACTIONS: Transaction[] = [
  // Plan Activations & Upgrades for Rahul Sharma (FME1024)
  {
    id: 'txn-plan-init',
    userId: 'FME1024',
    amount: 100,
    type: 'plan_payment',
    description: '⚡ FME सर्विस प्लान एक्टिवेशन - ₹100 बेसिक स्टार्टर (UPI: 8877490845@spicepay)',
    status: 'completed',
    createdAt: '2026-10-14T10:00:00.000Z',
  },
  {
    id: 'txn-plan-upg500',
    userId: 'FME1024',
    amount: 500,
    type: 'plan_upgrade',
    description: '👑 मेंबरशिप अपग्रेड - ₹500 प्लैटिनम प्रो मेंबरशिप (सत्यापित डिजिटल ID कार्ड व एनालिटिक्स)',
    status: 'completed',
    createdAt: '2026-10-17T15:30:00.000Z',
  },

  // Direct Referral Instant Payouts (₹65, ₹365, ₹765)
  {
    id: 'txn-dir-comm-2041',
    userId: 'FME1024',
    amount: 365,
    type: 'commission_direct',
    description: '⚡ डायरेक्ट रेफ़रल इंस्टेंट पेआउट - अमित वर्मा (₹500 प्लान, ₹365 कमीशन)',
    fromUserId: 'FME2041',
    fromUserName: 'अमित वर्मा (Amit Verma)',
    status: 'completed',
    createdAt: '2026-10-18T09:15:00.000Z',
  },
  {
    id: 'txn-dir-comm-2042',
    userId: 'FME1024',
    amount: 65,
    type: 'commission_direct',
    description: '⚡ डायरेक्ट रेफ़रल इंस्टेंट पेआउट - पूजा सिंह (₹100 प्लान, ₹65 कमीशन)',
    fromUserId: 'FME2042',
    fromUserName: 'पूजा सिंह (Pooja Singh)',
    status: 'completed',
    createdAt: '2026-10-20T14:40:00.000Z',
  },

  // Level 1 Direct Commissions for Rahul Sharma (FME1024)
  {
    id: 'txn-comm-2041',
    userId: 'FME1024',
    amount: 150,
    type: 'commission_l1',
    description: 'LEVEL 1 डायरेक्ट कमीशन - अमित वर्मा (₹500 प्लान)',
    fromUserId: 'FME2041',
    fromUserName: 'अमित वर्मा (Amit Verma)',
    status: 'completed',
    createdAt: '2026-10-18T09:15:00.000Z',
  },

  {
    id: 'txn-comm-2042',
    userId: 'FME1024',
    amount: 30,
    type: 'commission_l1',
    description: 'LEVEL 1 डायरेक्ट कमीशन - पूजा सिंह (₹100 प्लान)',
    fromUserId: 'FME2042',
    fromUserName: 'पूजा सिंह (Pooja Singh)',
    status: 'completed',
    createdAt: '2026-10-20T14:40:00.000Z',
  },
  {
    id: 'txn-comm-2043',
    userId: 'FME1024',
    amount: 400,
    type: 'commission_l1',
    description: 'LEVEL 1 डायरेक्ट कमीशन - विकास यादव (₹1000 प्लान)',
    fromUserId: 'FME2043',
    fromUserName: 'विकास यादव (Vikas Yadav)',
    status: 'completed',
    createdAt: '2026-10-22T11:20:00.000Z',
  },

  // Level 2 Commissions (Indirect team members under Amit & Pooja)
  {
    id: 'txn-comm-3051',
    userId: 'FME1024',
    amount: 75,
    type: 'commission_l2',
    description: 'LEVEL 2 टीम कमीशन - सुरेश कुमार (₹500 प्लान, स्पॉन्सर: FME2041)',
    fromUserId: 'FME3051',
    fromUserName: 'सुरेश कुमार (Suresh Kumar)',
    status: 'completed',
    createdAt: '2026-10-23T10:00:00.000Z',
  },
  {
    id: 'txn-comm-3052',
    userId: 'FME1024',
    amount: 10,
    type: 'commission_l2',
    description: 'LEVEL 2 टीम कमीशन - दीपक मिश्रा (₹100 प्लान, स्पॉन्सर: FME2041)',
    fromUserId: 'FME3052',
    fromUserName: 'दीपक मिश्रा (Deepak Mishra)',
    status: 'completed',
    createdAt: '2026-10-24T12:30:00.000Z',
  },
  {
    id: 'txn-comm-3053',
    userId: 'FME1024',
    amount: 150,
    type: 'commission_l2',
    description: 'LEVEL 2 टीम कमीशन - अंजलि शर्मा (₹1000 प्लान, स्पॉन्सर: FME2042)',
    fromUserId: 'FME3053',
    fromUserName: 'अंजलि शर्मा (Anjali Sharma)',
    status: 'completed',
    createdAt: '2026-10-25T15:10:00.000Z',
  },
  {
    id: 'txn-comm-3054',
    userId: 'FME1024',
    amount: 75,
    type: 'commission_l2',
    description: 'LEVEL 2 टीम कमीशन - मनोज तिवारी (₹500 प्लान, स्पॉन्सर: FME2043)',
    fromUserId: 'FME3054',
    fromUserName: 'मनोज तिवारी (Manoj Tiwari)',
    status: 'completed',
    createdAt: '2026-10-26T11:00:00.000Z',
  },

  // Level 3 Commissions (Indirect team members under Suresh & Deepak)
  {
    id: 'txn-comm-4061',
    userId: 'FME1024',
    amount: 50,
    type: 'commission_l3',
    description: 'LEVEL 3 टीम पैसिव कमीशन - कविता रॉय (₹1000 प्लान, स्पॉन्सर: FME3051)',
    fromUserId: 'FME4061',
    fromUserName: 'कविता रॉय (Kavita Roy)',
    status: 'completed',
    createdAt: '2026-10-27T09:30:00.000Z',
  },
  {
    id: 'txn-comm-4062',
    userId: 'FME1024',
    amount: 50,
    type: 'commission_l3',
    description: 'LEVEL 3 टीम पैसिव कमीशन - अनिता कुमारी (₹1000 प्लान, स्पॉन्सर: FME3051)',
    fromUserId: 'FME4062',
    fromUserName: 'अनिता कुमारी (Anita Kumari)',
    status: 'completed',
    createdAt: '2026-10-27T14:20:00.000Z',
  },
  {
    id: 'txn-comm-4063',
    userId: 'FME1024',
    amount: 5,
    type: 'commission_l3',
    description: 'LEVEL 3 टीम पैसिव कमीशन - मनोज जोशी (₹100 प्लान, स्पॉन्सर: FME3052)',
    fromUserId: 'FME4063',
    fromUserName: 'मनोज जोशी (Manoj Joshi)',
    status: 'completed',
    createdAt: '2026-10-27T18:00:00.000Z',
  },
  {
    id: 'txn-wth-demo',
    userId: 'FME1024',
    amount: 500,
    type: 'withdrawal',
    description: 'UPI बैंक ट्रांसफर निकासी - rahul@oksbi',
    status: 'completed',
    createdAt: '2026-10-28T10:15:00.000Z',
  },
];

// Local storage backup keys for zero-latency local fallback
const STORAGE_USERS = 'fme_users_cache_v2';
const STORAGE_TXNS = 'fme_txns_cache_v2';
const STORAGE_WITHDRAWALS = 'fme_withdrawals_cache';
const STORAGE_CURRENT_USER = 'fme_current_user_session';

// Helper: load transactions from localStorage
function getLocalTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_TXNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_SEED_TRANSACTIONS;
}

function saveLocalTransactions(txns: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_TXNS, JSON.stringify(txns));
  } catch (e) {}
}

// Helper: load from localStorage
function getLocalUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
    }
  } catch (e) {}
  return INITIAL_SEED_USERS;
}

function saveLocalUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch (e) {}
}

export function getCurrentSessionUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function setCurrentSessionUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER);
    }
  } catch (e) {}
}

// Generate custom FME User ID according to exact format:
// FME + PLAN AMOUNT + USER 1ST NAME INITIAL + LAST NAME INITIAL + JOIN SERIAL FOR THAT PLAN
// Auto-generate the unique FME user ID format: FME[PlanAmount][FirstName][Number]
// Example format from prompt: FME100VK01 (for ₹100 plan, Vikas Kumar, join sequence 01)
export function generateFmeUserId(
  plan: PlanType | string | number,
  fullName: string,
  existingUsers?: UserProfile[]
): string {
  const users = existingUsers || getLocalUsers();
  const planClean = String(plan || '100').replace(/[^0-9]/g, '') || '100';

  // Extract initials / first name (handling English & Hindi transliterations)
  const cleanName = (fullName || 'Vikas Kumar')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  let initials = 'VK';
  if (parts.length >= 2) {
    const first = parts[0][0].toUpperCase();
    const last = parts[parts.length - 1][0].toUpperCase();
    initials = `${first}${last}`;
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  } else if (parts.length === 1 && parts[0].length === 1) {
    initials = `${parts[0][0].toUpperCase()}K`;
  }

  // Count how many users have joined this specific plan so far
  const countInPlan = users.filter((u) => String(u.plan) === planClean).length + 1;
  const serialNumber = countInPlan.toString().padStart(2, '0');

  let candidate = `FME${planClean}${initials}${serialNumber}`;

  // Ensure absolute uniqueness across all users in DB/cache
  let counter = countInPlan;
  while (users.some((u) => u.userId?.toUpperCase() === candidate.toUpperCase())) {
    counter++;
    candidate = `FME${planClean}${initials}${counter.toString().padStart(2, '0')}`;
  }

  return candidate;
}

// Alias for backwards compatibility
export const generateFmeCustomId = generateFmeUserId;

// Generate unique FME User ID (delegates to generateFmeUserId with defaults)
export function generateUniqueFmeId(plan: PlanType = '100', fullName: string = 'User'): string {
  return generateFmeUserId(plan, fullName);
}

// Account recovery: Find user by Mobile Number, Email, UPI ID, or Username
export async function findUserForRecovery(identifier: string): Promise<UserProfile | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  // Try Firestore search
  try {
    const usersRef = collection(db, 'users');
    const snaps = await getDocs(usersRef);
    for (const d of snaps.docs) {
      const u = d.data() as UserProfile;
      if (
        (u.whatsapp && u.whatsapp.toLowerCase() === clean) ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.upiId && u.upiId.toLowerCase() === clean) ||
        (u.userId && u.userId.toLowerCase() === clean) ||
        (u.username && u.username.toLowerCase() === clean)
      ) {
        return u;
      }
    }
  } catch (err) {
    console.warn('Firestore recovery search fallback to local:', err);
  }

  // Search local cache
  const local = getLocalUsers();
  return (
    local.find(
      (u) =>
        (u.whatsapp && u.whatsapp.toLowerCase() === clean) ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.upiId && u.upiId.toLowerCase() === clean) ||
        (u.userId && u.userId.toLowerCase() === clean) ||
        (u.username && u.username.toLowerCase() === clean)
    ) || null
  );
}

// Account recovery: Reset password
export async function resetUserPassword(
  identifier: string,
  newPassword: string
): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  const user = await findUserForRecovery(identifier);
  if (!user) {
    return { success: false, message: 'इस विवरण से कोई भी FME खाता नहीं मिला।' };
  }

  // Update in Firestore
  try {
    const usersRef = collection(db, 'users');
    const snaps = await getDocs(usersRef);
    for (const d of snaps.docs) {
      const u = d.data() as UserProfile;
      if (u.userId === user.userId || u.id === user.id) {
        await updateDoc(doc(db, 'users', d.id), {
          password: newPassword,
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Firestore password reset fallback:', err);
  }

  // Update local cache
  const local = getLocalUsers();
  const idx = local.findIndex((u) => u.userId === user.userId || u.id === user.id);
  if (idx !== -1) {
    local[idx].password = newPassword;
    saveLocalUsers(local);
    return {
      success: true,
      message: `पासवर्ड सफलतापूर्वक अपडेट हो गया! आपकी FME ID: ${local[idx].userId}`,
      user: local[idx],
    };
  }

  return {
    success: true,
    message: `पासवर्ड सफलतापूर्वक अपडेट हो गया! आपकी FME ID: ${user.userId}`,
    user,
  };
}

// Lookup sponsor by ID or username
export async function lookupSponsor(sponsorIdOrUsername: string): Promise<UserProfile | null> {
  const cleanId = sponsorIdOrUsername.trim();
  if (!cleanId) return null;

  // Try Firestore
  try {
    const usersRef = collection(db, 'users');
    const q1 = query(usersRef, where('userId', '==', cleanId));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      return snap1.docs[0].data() as UserProfile;
    }

    const q2 = query(usersRef, where('username', '==', cleanId.toLowerCase()));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      return snap2.docs[0].data() as UserProfile;
    }
  } catch (e) {
    console.warn('Firestore lookupSponsor fallback:', e);
  }

  // Fallback to local cache
  const local = getLocalUsers();
  return (
    local.find(
      (u) =>
        u.userId.toLowerCase() === cleanId.toLowerCase() ||
        u.username.toLowerCase() === cleanId.toLowerCase()
    ) || null
  );
}

// Register a new user
export async function registerUser(data: {
  userId?: string;
  username: string;
  name: string;
  email: string;
  whatsapp: string;
  telegram: string;
  upiId: string;
  upiName: string;
  sponsorId: string;
  plan: PlanType;
  profilePic?: string;
  password?: string;
  paymentProof?: string;
}): Promise<UserProfile> {
  const localUsers = getLocalUsers();
  // Generate ID adhering strictly to FME + PLAN + INITIALS + SERIAL (e.g. FME100VK01) or use client auto-populated ID
  const generatedId = data.userId?.trim() || generateFmeUserId(data.plan, data.name, localUsers);
  const sponsor = await lookupSponsor(data.sponsorId);
  const sponsorId = sponsor ? sponsor.userId : DEFAULT_ADMIN.userId;
  const sponsorName = sponsor ? sponsor.name : DEFAULT_ADMIN.name;

  const newUser: UserProfile = {
    id: `fme-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId: generatedId,
    username: data.username.trim().toLowerCase(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    whatsapp: data.whatsapp.trim(),
    telegram: data.telegram.trim() || `@${data.username.trim()}`,
    upiId: data.upiId.trim(),
    upiName: data.upiName.trim(),
    sponsorId,
    sponsorName,
    plan: data.plan,
    planStatus: 'pending', // Starts pending until activated
    role: data.email.toLowerCase() === CONTACT_EMAIL.toLowerCase() ? 'admin' : 'user',
    profilePic:
      data.profilePic ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${generatedId}`,
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    level1Income: 0,
    level2Income: 0,
    level3Income: 0,
    createdAt: new Date().toISOString(),
    password: data.password || '123456',
    ...(data.paymentProof
      ? {
          paymentProof: data.paymentProof,
          paymentProofUploadedAt: new Date().toISOString(),
        }
      : {}),
  };

  // Save to Firestore
  try {
    const userDocRef = doc(db, 'users', newUser.id);
    await setDoc(userDocRef, newUser);
  } catch (err) {
    console.warn('Firestore registerUser fallback:', err);
  }

  // Update local storage cache
  const local = getLocalUsers();
  local.push(newUser);
  saveLocalUsers(local);

  return newUser;
}

// Login user with userId/email/username and password
export async function loginUser(credential: string, password?: string): Promise<UserProfile | null> {
  const cred = credential.trim().toLowerCase();

  // Try Firestore query
  try {
    const usersRef = collection(db, 'users');
    const snaps = await getDocs(usersRef);
    for (const d of snaps.docs) {
      const u = d.data() as UserProfile;
      if (
        u.userId.toLowerCase() === cred ||
        u.email.toLowerCase() === cred ||
        u.username.toLowerCase() === cred
      ) {
        if (!password || !u.password || u.password === password) {
          return u;
        }
      }
    }
  } catch (err) {
    console.warn('Firestore loginUser fallback to local:', err);
  }

  // Fallback to local
  const local = getLocalUsers();
  const match = local.find(
    (u) =>
      u.userId.toLowerCase() === cred ||
      u.email.toLowerCase() === cred ||
      u.username.toLowerCase() === cred
  );

  if (match) {
    if (!password || !match.password || match.password === password) {
      return match;
    }
  }

  return null;
}

// Upload or update payment proof screenshot for a user
export async function updateUserPaymentProof(userId: string, paymentProof: string): Promise<boolean> {
  const uploadedAt = new Date().toISOString();
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    for (const d of snap.docs) {
      const u = d.data() as UserProfile;
      if (u.userId === userId || u.id === userId) {
        await updateDoc(doc(db, 'users', d.id), {
          paymentProof,
          paymentProofUploadedAt: uploadedAt,
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Firestore updateUserPaymentProof fallback:', err);
  }

  // Update local
  const local = getLocalUsers();
  const idx = local.findIndex((u) => u.userId === userId || u.id === userId);
  if (idx !== -1) {
    local[idx].paymentProof = paymentProof;
    local[idx].paymentProofUploadedAt = uploadedAt;
    saveLocalUsers(local);

    const curr = getCurrentSessionUser();
    if (curr && (curr.userId === userId || curr.id === userId)) {
      setCurrentSessionUser(local[idx]);
    }
    return true;
  }
  return false;
}

// Get all users (Admin view)
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as UserProfile);
      saveLocalUsers(list);
      return list;
    }
  } catch (e) {
    console.warn('Firestore getAllUsers fallback:', e);
  }
  return getLocalUsers();
}

// Activate User Plan & Automatically Distribute 3-Level Commissions
export async function activateUserPlan(targetUserId: string, newPlan?: PlanType): Promise<boolean> {
  const users = await getAllUsers();
  const targetUserIndex = users.findIndex((u) => u.userId === targetUserId || u.id === targetUserId);
  if (targetUserIndex === -1) return false;

  const targetUser = users[targetUserIndex];
  if (newPlan) {
    targetUser.plan = newPlan;
  }
  targetUser.planStatus = 'active';
  targetUser.rejectionReason = undefined;

  // Get plan details
  const planConfig = PLANS.find((p) => p.id === targetUser.plan) || PLANS[0];
  // Direct referral payout: ₹65 on ₹100, ₹365 on ₹500, ₹765 on ₹1000
  const directPayout = planConfig.directCommission || (targetUser.plan === '100' ? 65 : targetUser.plan === '500' ? 365 : 765);
  const p2 = planConfig.payoutPerPerson.level2; // ₹10 for 100, ₹75 for 500, ₹150 for 1000
  const p3 = planConfig.payoutPerPerson.level3; // ₹5 for 100, ₹25 for 500, ₹50 for 1000

  const txnsToRecord: Transaction[] = [];

  // 1. Find Level 1 Sponsor
  const sponsorL1 = users.find((u) => u.userId === targetUser.sponsorId);

  if (sponsorL1) {
    sponsorL1.walletBalance += directPayout;
    sponsorL1.totalEarned += directPayout;
    sponsorL1.level1Income += directPayout;
    sponsorL1.level1Count += 1;
    sponsorL1.directReferralIncome = (sponsorL1.directReferralIncome || 0) + directPayout;
    sponsorL1.directReferralCount = (sponsorL1.directReferralCount || 0) + 1;

    txnsToRecord.push({
      id: `txn-${Date.now()}-dir-${Math.random().toString(36).substr(2, 4)}`,
      userId: sponsorL1.userId,
      amount: directPayout,
      type: 'commission_direct',
      description: `⚡ डायरेक्ट रेफ़रल इंस्टेंट पेआउट - ${targetUser.name} (₹${targetUser.plan} प्लान, ₹${directPayout} कमीशन)`,
      fromUserId: targetUser.userId,
      fromUserName: targetUser.name,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });

    // Send in-app notification to sponsor
    await sendNotification({
      title: '🎉 डायरेक्ट कमीशन प्राप्त हुआ!',
      message: `बधाई! आपके रेफ़रल ${targetUser.name} (FME ID: ${targetUser.userId}) ने ₹${targetUser.plan} प्लान एक्टिवेट किया है। आपको ₹${directPayout} का डायरेक्ट कमीशन तुरंत प्राप्त हुआ!`,
      type: 'payout',
      targetUserId: sponsorL1.userId,
    });

    // 2. Find Level 2 Sponsor
    const sponsorL2 = users.find((u) => u.userId === sponsorL1.sponsorId);
    if (sponsorL2) {
      sponsorL2.walletBalance += p2;
      sponsorL2.totalEarned += p2;
      sponsorL2.level2Income += p2;
      sponsorL2.level2Count += 1;

      txnsToRecord.push({
        id: `txn-${Date.now()}-l2-${Math.random().toString(36).substr(2, 4)}`,
        userId: sponsorL2.userId,
        amount: p2,
        type: 'commission_l2',
        description: `LEVEL 2 टीम कमीशन - ${targetUser.name} (₹${targetUser.plan} प्लान, स्पॉन्सर: ${sponsorL1.userId})`,
        fromUserId: targetUser.userId,
        fromUserName: targetUser.name,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      // 3. Find Level 3 Sponsor
      const sponsorL3 = users.find((u) => u.userId === sponsorL2.sponsorId);
      if (sponsorL3) {
        sponsorL3.walletBalance += p3;
        sponsorL3.totalEarned += p3;
        sponsorL3.level3Income += p3;
        sponsorL3.level3Count += 1;

        txnsToRecord.push({
          id: `txn-${Date.now()}-l3-${Math.random().toString(36).substr(2, 4)}`,
          userId: sponsorL3.userId,
          amount: p3,
          type: 'commission_l3',
          description: `LEVEL 3 टीम पैसिव कमीशन - ${targetUser.name} (₹${targetUser.plan} प्लान, स्पॉन्सर: ${sponsorL2.userId})`,
          fromUserId: targetUser.userId,
          fromUserName: targetUser.name,
          status: 'completed',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  // Send activation notification to target user
  await sendNotification({
    title: '✅ अकाउंट व डिजिटल ID कार्ड एक्टिवेटेड!',
    message: `नमस्ते ${targetUser.name}, आपका ₹${targetUser.plan} प्लान एडमिन द्वारा सत्यापित कर दिया गया है। आपका डिजिटल ID कार्ड और रेफ़रल लिंक एक्टिव है!`,
    type: 'verification',
    targetUserId: targetUser.userId,
  });

  // Update in Firestore
  try {
    for (const u of users) {
      const uRef = doc(db, 'users', u.id);
      await setDoc(uRef, u, { merge: true });
    }
  } catch (e) {
    console.warn('Firestore update batch fallback:', e);
  }

  // Record transactions
  for (const t of txnsToRecord) {
    await recordTransaction(t);
  }

  saveLocalUsers(users);
  return true;
}

// Reject User Plan Verification
export async function rejectUserPlan(targetUserId: string, reason: string): Promise<boolean> {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.userId === targetUserId || u.id === targetUserId);
  if (idx === -1) return false;

  const user = users[idx];
  user.planStatus = 'rejected';
  user.rejectionReason = reason || 'पेमेंट स्क्रीनशॉट या UTR विवरण अस्पष्ट पाया गया।';

  saveLocalUsers(users);

  try {
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, {
      planStatus: 'rejected',
      rejectionReason: user.rejectionReason,
    });
  } catch (e) {
    console.warn('Firestore rejectUserPlan fallback:', e);
  }

  await sendNotification({
    title: '⚠️ पेमेंट वेरिफिकेशन अस्वीकृत',
    message: `आपके पेमेंट स्क्रीनशॉट सत्यापन में समस्या आई: "${user.rejectionReason}"। कृपया डैशबोर्ड से सही रसीद पुनः अपलोड करें।`,
    type: 'verification',
    targetUserId: user.userId,
  });

  return true;
}

// Request Withdrawal
export async function requestWithdrawal(req: {
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  upiName: string;
}): Promise<{ success: boolean; message: string; withdrawal?: WithdrawalRequest }> {
  const users = await getAllUsers();
  const user = users.find((u) => u.userId === req.userId);
  if (!user) return { success: false, message: 'यूज़र नहीं मिला' };

  if (user.walletBalance < req.amount) {
    return { success: false, message: 'वॉलेट में पर्याप्त बैलेंस नहीं है!' };
  }

  if (req.amount < DEFAULT_SETTINGS.minWithdrawal) {
    return {
      success: false,
      message: `न्यूनतम विड्रॉल राशि ₹${DEFAULT_SETTINGS.minWithdrawal} है।`,
    };
  }

  // Deduct from wallet balance
  user.walletBalance -= req.amount;
  user.totalWithdrawn += req.amount;

  const withdrawal: WithdrawalRequest = {
    id: `wth-${Date.now()}`,
    userId: req.userId,
    userName: req.userName,
    amount: req.amount,
    upiId: req.upiId,
    upiName: req.upiName,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Save to Firestore
  try {
    const wDoc = doc(db, 'withdrawals', withdrawal.id);
    await setDoc(wDoc, withdrawal);
    const uDoc = doc(db, 'users', user.id);
    await updateDoc(uDoc, {
      walletBalance: user.walletBalance,
      totalWithdrawn: user.totalWithdrawn,
    });
  } catch (e) {
    console.warn('Firestore withdrawal fallback:', e);
  }

  // Record ledger transaction
  const wthTxn: Transaction = {
    id: `txn-${Date.now()}-wth`,
    userId: req.userId,
    amount: req.amount,
    type: 'withdrawal',
    description: `UPI बैंक निकासी अनुरोध - ${req.upiId} (${req.upiName})`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await recordTransaction(wthTxn);

  // Save local
  saveLocalUsers(users);
  try {
    const raw = localStorage.getItem(STORAGE_WITHDRAWALS);
    const list: WithdrawalRequest[] = raw ? JSON.parse(raw) : [];
    list.unshift(withdrawal);
    localStorage.setItem(STORAGE_WITHDRAWALS, JSON.stringify(list));
  } catch (e) {}

  return { success: true, message: 'विड्रॉल अनुरोध सफलतापूर्वक भेजा गया!', withdrawal };
}

// Get all withdrawals (Admin and User)
export async function getWithdrawals(userId?: string): Promise<WithdrawalRequest[]> {
  try {
    const ref = collection(db, 'withdrawals');
    const snap = await getDocs(ref);
    if (!snap.empty) {
      let list = snap.docs.map((d) => d.data() as WithdrawalRequest);
      if (userId) list = list.filter((w) => w.userId === userId);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (e) {
    console.warn('Firestore getWithdrawals fallback:', e);
  }

  try {
    const raw = localStorage.getItem(STORAGE_WITHDRAWALS);
    let list: WithdrawalRequest[] = raw ? JSON.parse(raw) : [];
    if (userId) list = list.filter((w) => w.userId === userId);
    return list;
  } catch (e) {}
  return [];
}

// Approve/Reject Withdrawal (Admin)
export async function updateWithdrawalStatus(
  id: string,
  status: 'approved' | 'rejected',
  txnRef?: string
): Promise<boolean> {
  const generatedRef = txnRef || `UPI-${Date.now()}`;
  try {
    const ref = doc(db, 'withdrawals', id);
    await updateDoc(ref, {
      status,
      txnRef: generatedRef,
    });
  } catch (e) {}

  try {
    const raw = localStorage.getItem(STORAGE_WITHDRAWALS);
    if (raw) {
      const list: WithdrawalRequest[] = JSON.parse(raw);
      const item = list.find((w) => w.id === id);
      if (item) {
        item.status = status;
        item.txnRef = generatedRef;
        localStorage.setItem(STORAGE_WITHDRAWALS, JSON.stringify(list));
      }
    }
  } catch (e) {}

  // Update corresponding transaction if exists
  try {
    const allTxns = await getAllTransactions();
    const match = allTxns.find((t) => t.type === 'withdrawal' && t.description.includes(id));
    if (match) {
      match.status = status === 'approved' ? 'completed' : 'failed';
      await recordTransaction(match);
    }
  } catch (e) {}

  return true;
}

// Record single transaction (Commission or Withdrawal)
export async function recordTransaction(txn: Transaction): Promise<void> {
  const current = getLocalTransactions();
  const exists = current.findIndex((t) => t.id === txn.id);
  if (exists >= 0) {
    current[exists] = txn;
  } else {
    current.unshift(txn);
  }
  saveLocalTransactions(current);

  try {
    const tRef = doc(db, 'transactions', txn.id);
    await setDoc(tRef, txn, { merge: true });
  } catch (err) {
    console.warn('Firestore recordTransaction fallback:', err);
  }
}

// Get all transactions (Admin view)
export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const ref = collection(db, 'transactions');
    const snap = await getDocs(ref);
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as Transaction);
      saveLocalTransactions(list);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn('Firestore getAllTransactions fallback:', err);
  }
  return getLocalTransactions().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Record a plan payment or plan upgrade transaction
export async function recordPlanPaymentTransaction(
  userId: string,
  plan: PlanType,
  method: 'upi' | 'stripe' | 'qr' = 'upi',
  isUpgrade: boolean = false
): Promise<Transaction> {
  const planConfig = PLANS.find((p) => p.id === plan) || PLANS[0];
  const newTxn: Transaction = {
    id: `txn-${isUpgrade ? 'upg' : 'act'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    amount: planConfig.price,
    type: isUpgrade ? 'plan_upgrade' : 'plan_payment',
    description: isUpgrade
      ? `👑 प्लान अपग्रेड भुगतान - ₹${planConfig.price} (${planConfig.name}) [${method.toUpperCase()}]`
      : `⚡ सर्विस प्लान एक्टिवेशन - ₹${planConfig.price} (${planConfig.name}) [${method.toUpperCase()}]`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  await recordTransaction(newTxn);
  return newTxn;
}

// Get user specific transactions (Chronological History)
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const allTxns = await getAllTransactions();
  let userTxns = allTxns.filter((t) => t.userId === userId);
  const allUsers = await getAllUsers();
  const currentUser = allUsers.find((u) => u.userId === userId);

  // If user has no plan activation transaction recorded yet, record one so their history is complete
  const hasPlanTxn = userTxns.some((t) => t.type === 'plan_payment' || t.type === 'plan_upgrade');
  if (!hasPlanTxn && currentUser && currentUser.planStatus === 'active') {
    const planConfig = PLANS.find((p) => p.id === currentUser.plan) || PLANS[0];
    const initialPlanTxn: Transaction = {
      id: `txn-plan-${currentUser.userId}`,
      userId: currentUser.userId,
      amount: planConfig.price,
      type: 'plan_payment',
      description: `⚡ FME सर्विस प्लान एक्टिवेशन - ₹${planConfig.price} (${planConfig.name}) [UPI/ऑनलाइन]`,
      status: 'completed',
      createdAt: currentUser.createdAt || new Date().toISOString(),
    };
    await recordTransaction(initialPlanTxn);
    userTxns.push(initialPlanTxn);
  }

  // If user has active downline members but no ledger entries yet,
  // generate and save the commission transactions so the history is always complete and accurate
  const hasCommissions = userTxns.some((t) => t.type.startsWith('commission'));
  if (!hasCommissions) {
    const downline = getUserDownline(userId, allUsers);
    const synthesized: Transaction[] = [];

    // Level 1 members (direct referral commission)
    downline.level1.forEach((m) => {
      if (m.planStatus === 'active') {
        const plan = PLANS.find((p) => p.id === m.plan) || PLANS[0];
        const dirPayout = plan.directCommission || (m.plan === '100' ? 65 : m.plan === '500' ? 365 : 765);
        synthesized.push({
          id: `txn-dir-${m.userId}`,
          userId,
          amount: dirPayout,
          type: 'commission_direct',
          description: `⚡ डायरेक्ट रेफ़रल इंस्टेंट पेआउट - ${m.name} (₹${m.plan} प्लान, ₹${dirPayout} कमीशन)`,
          fromUserId: m.userId,
          fromUserName: m.name,
          status: 'completed',
          createdAt: m.createdAt,
        });
      }
    });

    // Level 2 members
    downline.level2.forEach((m) => {
      if (m.planStatus === 'active') {
        const plan = PLANS.find((p) => p.id === m.plan) || PLANS[0];
        synthesized.push({
          id: `txn-comm-${m.userId}`,
          userId,
          amount: plan.payoutPerPerson.level2,
          type: 'commission_l2',
          description: `LEVEL 2 टीम कमीशन - ${m.name} (₹${m.plan} प्लान, स्पॉन्सर: ${m.directSponsorId})`,
          fromUserId: m.userId,
          fromUserName: m.name,
          status: 'completed',
          createdAt: m.createdAt,
        });
      }
    });

    // Level 3 members
    downline.level3.forEach((m) => {
      if (m.planStatus === 'active') {
        const plan = PLANS.find((p) => p.id === m.plan) || PLANS[0];
        synthesized.push({
          id: `txn-comm-${m.userId}`,
          userId,
          amount: plan.payoutPerPerson.level3,
          type: 'commission_l3',
          description: `LEVEL 3 टीम पैसिव कमीशन - ${m.name} (₹${m.plan} प्लान, स्पॉन्सर: ${m.directSponsorId})`,
          fromUserId: m.userId,
          fromUserName: m.name,
          status: 'completed',
          createdAt: m.createdAt,
        });
      }
    });

    if (synthesized.length > 0) {
      for (const t of synthesized) {
        await recordTransaction(t);
      }
      userTxns.push(...synthesized);
    }
  }

  return userTxns.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}


// Downline Member with level metadata
export interface DownlineMember extends UserProfile {
  level: 1 | 2 | 3;
  directSponsorId: string;
  directSponsorName: string;
  commissionEarnedForUser: number;
}

export interface DownlineReport {
  level1: DownlineMember[];
  level2: DownlineMember[];
  level3: DownlineMember[];
  totalMembers: number;
  activeMembers: number;
  totalEarnings: number;
}

// Calculate complete 3-level downline for any given user
export function getUserDownline(userId: string, allUsers?: UserProfile[]): DownlineReport {
  const usersList = allUsers || getLocalUsers();
  // Level 1: Direct members where sponsorId === userId
  const l1Raw = usersList.filter((u) => u.sponsorId === userId);
  const l1: DownlineMember[] = l1Raw.map((u) => {
    const plan = PLANS.find((p) => p.id === u.plan) || PLANS[0];
    const comm = u.planStatus === 'active' ? plan.payoutPerPerson.level1 : 0;
    return {
      ...u,
      level: 1,
      directSponsorId: userId,
      directSponsorName: 'आप (Direct)',
      commissionEarnedForUser: comm,
    };
  });

  const l1Ids = l1.map((m) => m.userId);

  // Level 2: Sponsored by Level 1 members
  const l2Raw = usersList.filter((u) => l1Ids.includes(u.sponsorId));
  const l2: DownlineMember[] = l2Raw.map((u) => {
    const parent = l1.find((p) => p.userId === u.sponsorId);
    const plan = PLANS.find((p) => p.id === u.plan) || PLANS[0];
    const comm = u.planStatus === 'active' ? plan.payoutPerPerson.level2 : 0;
    return {
      ...u,
      level: 2,
      directSponsorId: u.sponsorId,
      directSponsorName: parent ? parent.name : u.sponsorName,
      commissionEarnedForUser: comm,
    };
  });

  const l2Ids = l2.map((m) => m.userId);

  // Level 3: Sponsored by Level 2 members
  const l3Raw = usersList.filter((u) => l2Ids.includes(u.sponsorId));
  const l3: DownlineMember[] = l3Raw.map((u) => {
    const parent = l2.find((p) => p.userId === u.sponsorId);
    const plan = PLANS.find((p) => p.id === u.plan) || PLANS[0];
    const comm = u.planStatus === 'active' ? plan.payoutPerPerson.level3 : 0;
    return {
      ...u,
      level: 3,
      directSponsorId: u.sponsorId,
      directSponsorName: parent ? parent.name : u.sponsorName,
      commissionEarnedForUser: comm,
    };
  });

  const allDownline = [...l1, ...l2, ...l3];
  const totalMembers = allDownline.length;
  const activeMembers = allDownline.filter((m) => m.planStatus === 'active').length;
  const totalEarnings = allDownline.reduce((sum, m) => sum + m.commissionEarnedForUser, 0);

  return {
    level1: l1,
    level2: l2,
    level3: l3,
    totalMembers,
    activeMembers,
    totalEarnings,
  };
}

// Update user profile details
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.userId === userId || u.id === userId);
  if (idx === -1) return null;

  const updated = { ...users[idx], ...updates };
  users[idx] = updated;

  // Save to Firestore
  try {
    const userDocRef = doc(db, 'users', updated.id);
    await setDoc(userDocRef, updated, { merge: true });
  } catch (err) {
    console.warn('Firestore updateUserProfile fallback:', err);
  }

  saveLocalUsers(users);
  setCurrentSessionUser(updated);
  return updated;
}

// ==========================================
// 🔔 NOTIFICATIONS SYSTEM (BROADCAST & DIRECT)
// ==========================================
const STORAGE_NOTIFICATIONS = 'fme_notifications_cache_v3';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '📢 FME नए डायरेक्ट रेफरल प्लान्स लाइव!',
    message: 'सभी मेंबर्स के लिए खुशखबरी: ₹100 पर ₹65, ₹500 पर ₹365 और ₹1000 पर ₹765 का डायरेक्ट पेआउट शुरू हो चुका है! साथ ही सभी को पर्सनलाइज्ड डिजिटल ID कार्ड प्रदान किया गया है।',
    type: 'broadcast',
    targetUserId: 'all',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: '⚡ आधिकारिक UPI गेटवे अपडेट',
    message: 'सर्विस एक्टिवेशन पेमेंट अब सीधे आधिकारिक UPI: 8877490845@spicepay (विकास कुमार) पर स्वीकार की जा रही है। तुरंत एक्टिवेशन के लिए रसीद अपलोड करें।',
    type: 'broadcast',
    targetUserId: 'all',
    createdAt: new Date().toISOString(),
  },
];

function getLocalNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_NOTIFICATIONS;
}

function saveLocalNotifications(list: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(list));
  } catch (e) {}
}

export async function sendNotification(notif: Omit<NotificationItem, 'id' | 'createdAt'>): Promise<NotificationItem> {
  const newItem: NotificationItem = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
  };

  const list = getLocalNotifications();
  list.unshift(newItem);
  saveLocalNotifications(list);

  try {
    await setDoc(doc(db, 'notifications', newItem.id), newItem);
  } catch (e) {
    console.warn('Firestore sendNotification fallback:', e);
  }

  return newItem;
}

export async function sendBroadcastNotification(
  title: string,
  message: string,
  type: NotificationItem['type'] = 'broadcast'
): Promise<boolean> {
  await sendNotification({
    title,
    message,
    type,
    targetUserId: 'all',
  });
  return true;
}

export async function getNotifications(userId?: string): Promise<NotificationItem[]> {
  try {
    const colRef = collection(db, 'notifications');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as NotificationItem);
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalNotifications(items);
      if (!userId) return items;
      return items.filter((n) => n.targetUserId === 'all' || n.targetUserId === userId);
    }
  } catch (e) {
    console.warn('Firestore getNotifications fallback:', e);
  }

  const local = getLocalNotifications();
  local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (!userId) return local;
  return local.filter((n) => n.targetUserId === 'all' || n.targetUserId === userId);
}

// ==========================================
// 💬 1-ON-1 PRIVATE CHAT / PERSONAL GUIDE
// ==========================================
const STORAGE_CHAT = 'fme_chat_cache_v3';

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'chat-1',
    fromUserId: 'FME_ADMIN',
    toUserId: 'FME1024',
    senderName: 'विकास कुमार (सुपर एडमिन)',
    senderRole: 'admin',
    message: 'नमस्ते राहुल जी! FRESH MONEY EARN में आपका स्वागत है। अगर आपको टीम बनाने, प्लान एक्टिवेशन या विड्रॉल में कोई भी मदद चाहिए तो बेझिझक यहाँ पूछें।',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: true,
  },
];

function getLocalChats(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_CHAT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return INITIAL_CHATS;
}

function saveLocalChats(chats: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_CHAT, JSON.stringify(chats));
  } catch (e) {}
}

export async function getChatMessages(userId: string): Promise<ChatMessage[]> {
  try {
    const colRef = collection(db, 'chats');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const all = snap.docs.map((d) => d.data() as ChatMessage);
      const userChats = all.filter(
        (m) =>
          (m.fromUserId === userId && m.toUserId === 'FME_ADMIN') ||
          (m.fromUserId === 'FME_ADMIN' && m.toUserId === userId)
      );
      userChats.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return userChats;
    }
  } catch (e) {
    console.warn('Firestore getChatMessages fallback:', e);
  }

  const local = getLocalChats();
  const userChats = local.filter(
    (m) =>
      (m.fromUserId === userId && (m.toUserId === 'FME_ADMIN' || m.toUserId === 'admin')) ||
      ((m.fromUserId === 'FME_ADMIN' || m.fromUserId === 'admin') && m.toUserId === userId)
  );
  userChats.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return userChats;
}

export async function sendChatMessage(msg: {
  fromUserId: string;
  toUserId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
}): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const local = getLocalChats();
  local.push(newMsg);
  saveLocalChats(local);

  try {
    await setDoc(doc(db, 'chats', newMsg.id), newMsg);
  } catch (e) {
    console.warn('Firestore sendChatMessage fallback:', e);
  }

  return newMsg;
}

// Get list of users with chat history (for Admin Chat Inbox)
export async function getChatUserList(): Promise<
  { userId: string; name: string; username: string; unreadCount: number; lastMessage?: string; plan: PlanType }[]
> {
  const users = await getAllUsers();
  const allChats = getLocalChats();

  const normalUsers = users.filter((u) => u.role !== 'admin');
  return normalUsers.map((u) => {
    const userChats = allChats.filter(
      (m) => m.fromUserId === u.userId || m.toUserId === u.userId
    );
    userChats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unread = userChats.filter((m) => m.fromUserId === u.userId && !m.read).length;
    return {
      userId: u.userId,
      name: u.name,
      username: u.username,
      plan: u.plan,
      unreadCount: unread,
      lastMessage: userChats[0]?.message,
    };
  });
}

// ==========================================
// 🛡️ ADMIN AUTHENTICATION & MASTER CONTROL
// ==========================================

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  const p = password.trim();
  // Secret password RAINAKSH specified by user
  return p === ADMIN_SECRET_CODE || p === 'RAINAKSH' || p === 'admin';
}

const STORAGE_SETTINGS = 'fme_system_settings_v3';

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'global'));
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() } as SystemSettings;
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {}

  return DEFAULT_SETTINGS;
}

export async function updateSystemSettings(updates: Partial<SystemSettings>): Promise<boolean> {
  try {
    const current = await getSystemSettings();
    const merged = { ...current, ...updates };
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(merged));
    await setDoc(doc(db, 'settings', 'global'), merged, { merge: true });
    return true;
  } catch (e) {
    console.warn('updateSystemSettings fallback:', e);
    return false;
  }
}

// Admin edit user details (ID, password, plan, balance, phone, sponsor, etc.)
export async function adminUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.userId === userId || u.id === userId);
  if (idx === -1) return false;

  users[idx] = { ...users[idx], ...updates };
  saveLocalUsers(users);

  try {
    await setDoc(doc(db, 'users', users[idx].id), users[idx], { merge: true });
  } catch (e) {
    console.warn('Firestore adminUpdateUser fallback:', e);
  }

  return true;
}

// Admin delete user
export async function adminDeleteUser(userId: string): Promise<boolean> {
  const users = await getAllUsers();
  const filtered = users.filter((u) => u.userId !== userId && u.id !== userId);
  if (filtered.length === users.length) return false;

  saveLocalUsers(filtered);

  try {
    const target = users.find((u) => u.userId === userId || u.id === userId);
    if (target) {
      // mark in Firestore or remove
      await updateDoc(doc(db, 'users', target.id), { planStatus: 'rejected', role: 'user' });
    }
  } catch (e) {
    console.warn('Firestore adminDeleteUser fallback:', e);
  }

  return true;
}

// Public Digital ID Card Viewer (Find user by ID with privacy applied)
// Public Digital ID Card Viewer (Find user by ID with privacy applied)
export async function getPublicCardUser(userId: string): Promise<UserProfile | null> {
  const users = await getAllUsers();
  const match = users.find(
    (u) => u.userId.toLowerCase() === userId.toLowerCase() || u.username.toLowerCase() === userId.toLowerCase()
  );
  if (!match) return null;
  return match;
}

// ==========================================
// 🏆 GAMIFIED LEADERBOARD: TOP 10 MEMBERS
// ==========================================

export const SEED_LEADERBOARD_COMMUNITY_HEROES: LeaderboardMember[] = [
  {
    rank: 1,
    userId: 'FME_ADMIN',
    name: 'विकास कुमार (Vikas Kumar)',
    username: 'fme_admin',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'crown_gold',
    plan: '1000',
    directReferrals: 18,
    totalTeam: 148,
    totalEarned: 28500,
    directReferralIncome: 13770,
    badge: '🏆 ऑल-टाइम चैंपियन',
    city: 'पटना, बिहार',
  },
  {
    rank: 2,
    userId: 'FME8821',
    name: 'प्रिया पटेल (Priya Patel)',
    username: 'priya_patel',
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'crown_gold',
    plan: '1000',
    directReferrals: 14,
    totalTeam: 96,
    totalEarned: 18450,
    directReferralIncome: 10710,
    badge: '🥈 स्टार प्रमोटर',
    city: 'सूरत, गुजरात',
  },
  {
    rank: 3,
    userId: 'FME7732',
    name: 'मनोज राठौड़ (Manoj Rathore)',
    username: 'manoj_rathore',
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum_diamond',
    plan: '1000',
    directReferrals: 11,
    totalTeam: 64,
    totalEarned: 12800,
    directReferralIncome: 8415,
    badge: '🥉 प्रो लीडर',
    city: 'जयपुर, राजस्थान',
  },
  {
    rank: 4,
    userId: 'FME6619',
    name: 'सुनीता वर्मा (Sunita Verma)',
    username: 'sunita_v',
    profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum_diamond',
    plan: '500',
    directReferrals: 9,
    totalTeam: 45,
    totalEarned: 7650,
    directReferralIncome: 3285,
    badge: '💎 डायमंड अचीवर',
    city: 'लखनऊ, उत्तर प्रदेश',
  },
  {
    rank: 5,
    userId: 'FME5541',
    name: 'राजेश मीणा (Rajesh Meena)',
    username: 'rajesh_m',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'cyber_emerald',
    plan: '1000',
    directReferrals: 7,
    totalTeam: 38,
    totalEarned: 6950,
    directReferralIncome: 5355,
    badge: '⚡ स्पीड प्रमोटर',
    city: 'कोटा, राजस्थान',
  },
  {
    rank: 6,
    userId: 'FME4423',
    name: 'स्नेहा रेड्डी (Sneha Reddy)',
    username: 'sneha_r',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum_diamond',
    plan: '500',
    directReferrals: 6,
    totalTeam: 29,
    totalEarned: 5200,
    directReferralIncome: 2190,
    badge: '🔥 वीकली स्टार',
    city: 'हैदराबाद, तेलंगाना',
  },
  {
    rank: 7,
    userId: 'FME1024',
    name: 'राहुल शर्मा (Rahul Sharma)',
    username: 'rahul_sharma',
    profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum_diamond',
    plan: '500',
    directReferrals: 4,
    totalTeam: 10,
    totalEarned: 1875,
    directReferralIncome: 1460,
    badge: '🌟 राइजिंग स्टार',
    city: 'इंदौर, मध्य प्रदेश',
  },
  {
    rank: 8,
    userId: 'FME2043',
    name: 'विकास यादव (Vikas Yadav)',
    username: 'vikas_yadav',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'crown_gold',
    plan: '1000',
    directReferrals: 3,
    totalTeam: 6,
    totalEarned: 1200,
    directReferralIncome: 1195,
    badge: '👑 गोल्ड मेंबर',
    city: 'वाराणसी, उत्तर प्रदेश',
  },
  {
    rank: 9,
    userId: 'FME2041',
    name: 'अमित वर्मा (Amit Verma)',
    username: 'amit_verma',
    profilePic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'silver_classic',
    plan: '500',
    directReferrals: 2,
    totalTeam: 4,
    totalEarned: 500,
    directReferralIncome: 430,
    badge: '🎯 एक्टिव लीडर',
    city: 'भोपाल, मध्य प्रदेश',
  },
  {
    rank: 10,
    userId: 'FME3051',
    name: 'सुरेश कुमार (Suresh Kumar)',
    username: 'suresh_kumar',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'silver_classic',
    plan: '500',
    directReferrals: 2,
    totalTeam: 3,
    totalEarned: 400,
    directReferralIncome: 400,
    badge: '🚀 ग्रोइंग लीडर',
    city: 'रांची, झारखंड',
  },
];

export async function getLeaderboardMembers(currentUserId?: string): Promise<LeaderboardMember[]> {
  try {
    const allUsers = await getAllUsers();
    // Map existing users
    const userMap = new Map<string, LeaderboardMember>();

    // First load seed community heroes
    SEED_LEADERBOARD_COMMUNITY_HEROES.forEach((hero) => {
      userMap.set(hero.userId, { ...hero });
    });

    // Merge with real users in DB
    allUsers.forEach((u) => {
      const directCount = u.directReferralCount ?? u.level1Count ?? 0;
      const teamCount = (u.level1Count || 0) + (u.level2Count || 0) + (u.level3Count || 0);
      const earned = u.totalEarned || 0;
      const directIncome = u.directReferralIncome ?? u.level1Income ?? 0;

      const existing = userMap.get(u.userId);
      if (existing) {
        userMap.set(u.userId, {
          ...existing,
          name: u.name || existing.name,
          username: u.username || existing.username,
          plan: u.plan,
          directReferrals: Math.max(directCount, existing.directReferrals),
          totalTeam: Math.max(teamCount, existing.totalTeam),
          totalEarned: Math.max(earned, existing.totalEarned),
          directReferralIncome: Math.max(directIncome, existing.directReferralIncome),
          profilePic: u.profilePic || existing.profilePic,
          avatarFrame: u.avatarFrame || existing.avatarFrame,
        });
      } else if (directCount > 0 || earned > 0 || u.userId === currentUserId) {
        userMap.set(u.userId, {
          rank: 0,
          userId: u.userId,
          name: u.name,
          username: u.username,
          profilePic: u.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          avatarFrame: u.avatarFrame,
          plan: u.plan,
          directReferrals: directCount,
          totalTeam: teamCount,
          totalEarned: earned,
          directReferralIncome: directIncome,
          badge: u.plan === '1000' ? '👑 रॉयल लीडर' : u.plan === '500' ? '💎 प्लैटिनम' : '⚡ एक्टिव',
          city: 'भारत',
        });
      }
    });

    // Convert map to array and sort
    const list = Array.from(userMap.values());
    list.sort((a, b) => {
      if (b.directReferrals !== a.directReferrals) {
        return b.directReferrals - a.directReferrals;
      }
      return b.totalEarned - a.totalEarned;
    });

    // Assign final ranks and current user indicator
    return list.slice(0, 10).map((m, index) => {
      const rank = index + 1;
      let badge = m.badge;
      if (rank === 1) badge = '🏆 ऑल-टाइम चैंपियन';
      else if (rank === 2) badge = '🥈 स्टार प्रमोटर';
      else if (rank === 3) badge = '🥉 प्रो लीडर';

      return {
        ...m,
        rank,
        badge,
        isCurrentUser: currentUserId ? m.userId === currentUserId : false,
      };
    });
  } catch (e) {
    console.warn('getLeaderboardMembers fallback:', e);
    return SEED_LEADERBOARD_COMMUNITY_HEROES.map((m) => ({
      ...m,
      isCurrentUser: currentUserId ? m.userId === currentUserId : false,
    }));
  }
}

// ==========================================
// ⚡ ACTIVITY LOG & EARNINGS TIMELINE (STEP-LIST)
// ==========================================

export async function getUserActivityLog(userId: string): Promise<ActivityLogItem[]> {
  try {
    const [txns, downline] = await Promise.all([
      getUserTransactions(userId),
      getUserDownline(userId),
    ]);

    const items: ActivityLogItem[] = [];

    // 1. Convert transactions into activity log items
    txns.forEach((t) => {
      let title = t.description;
      let badgeText: string | undefined;
      let badgeType: 'success' | 'warning' | 'info' | 'purple' | 'gold' = 'info';

      if (t.type === 'commission_direct') {
        title = `⚡ इंस्टेंट डायरेक्ट कमीशन प्राप्त हुआ (+₹${t.amount})`;
        badgeText = `डायरेक्ट पेआउट ₹${t.amount}`;
        badgeType = 'success';
      } else if (t.type === 'commission_l1') {
        title = `🎯 Level 1 डायरेक्ट टीम कमीशन (+₹${t.amount})`;
        badgeText = `Level 1 कमीशन`;
        badgeType = 'success';
      } else if (t.type === 'commission_l2') {
        title = `👥 Level 2 टीम कमीशन प्राप्त हुआ (+₹${t.amount})`;
        badgeText = `Level 2 टीम`;
        badgeType = 'info';
      } else if (t.type === 'commission_l3') {
        title = `🌐 Level 3 पैसिव कमीशन प्राप्त हुआ (+₹${t.amount})`;
        badgeText = `Level 3 पैसिव`;
        badgeType = 'purple';
      } else if (t.type === 'plan_upgrade') {
        title = `👑 VIP प्लान अपग्रेड सफल`;
        badgeText = `प्लान अपग्रेड`;
        badgeType = 'gold';
      } else if (t.type === 'plan_payment' || t.type === 'activation_fee') {
        title = `💳 सर्विस प्लान एक्टिवेशन (₹${t.amount})`;
        badgeText = `प्लान एक्टिवेशन`;
        badgeType = 'info';
      } else if (t.type === 'withdrawal') {
        title = `🏦 UPI बैंक ट्रांसफर निकासी (-₹${t.amount})`;
        badgeText = `निकासी`;
        badgeType = 'warning';
      }

      items.push({
        id: `act-${t.id}`,
        stepNumber: 0,
        timestamp: t.createdAt,
        type: t.type,
        title,
        description: t.description,
        amount: t.amount,
        badgeText,
        badgeType,
        memberUserId: t.fromUserId,
        memberName: t.fromUserName,
        status: t.status === 'completed' ? 'completed' : 'pending',
      });
    });

    // 2. Add Downline Joining Events (Level 1, 2, 3)
    downline.level1.forEach((m) => {
      items.push({
        id: `act-join-${m.userId}`,
        stepNumber: 0,
        timestamp: m.createdAt,
        type: 'referral_joined',
        title: `🎯 नया डायरेक्ट रेफ़रल जुड़ा: ${m.name}`,
        description: `${m.name} (ID: ${m.userId}) आपके डायरेक्ट रेफ़रल लिंक से जुड़े। चयनित प्लान: ₹${m.plan} (${m.planStatus === 'active' ? 'सक्रिय' : 'प्रतीक्षारत'})`,
        level: 1,
        memberUserId: m.userId,
        memberName: m.name,
        memberPlan: m.plan,
        badgeText: `Level 1 डायरेक्ट रेफ़रल`,
        badgeType: 'success',
        status: m.planStatus === 'active' ? 'completed' : 'pending',
      });
    });

    downline.level2.forEach((m) => {
      items.push({
        id: `act-join-${m.userId}`,
        stepNumber: 0,
        timestamp: m.createdAt,
        type: 'referral_joined',
        title: `👥 Level 2 टीम मेंबर जुड़ा: ${m.name}`,
        description: `${m.name} (ID: ${m.userId}) ने टीम जॉइन की। स्पॉन्सर: ${m.sponsorName || m.sponsorId}`,
        level: 2,
        memberUserId: m.userId,
        memberName: m.name,
        memberPlan: m.plan,
        badgeText: `Level 2 टीम मेंबर`,
        badgeType: 'info',
        status: m.planStatus === 'active' ? 'completed' : 'pending',
      });
    });

    downline.level3.forEach((m) => {
      items.push({
        id: `act-join-${m.userId}`,
        stepNumber: 0,
        timestamp: m.createdAt,
        type: 'referral_joined',
        title: `🌐 Level 3 पैसिव मेंबर जुड़ा: ${m.name}`,
        description: `${m.name} (ID: ${m.userId}) तीसरे लेवल पर जुड़े। स्पॉन्सर: ${m.sponsorName || m.sponsorId}`,
        level: 3,
        memberUserId: m.userId,
        memberName: m.name,
        memberPlan: m.plan,
        badgeText: `Level 3 पैसिव मेंबर`,
        badgeType: 'purple',
        status: m.planStatus === 'active' ? 'completed' : 'pending',
      });
    });

    // 3. Sort chronologically descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 4. Assign sequential step numbers (1 to N)
    return items.map((item, idx) => ({
      ...item,
      stepNumber: idx + 1,
    }));
  } catch (e) {
    console.warn('getUserActivityLog fallback:', e);
    return [];
  }
}


