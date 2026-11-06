export type PlanType = '100' | '500' | '1000';
export type PlanStatus = 'pending' | 'active' | 'rejected';
export type UserRole = 'user' | 'admin';
export type AvatarFrameType = 'crown_gold' | 'platinum_diamond' | 'cyber_emerald' | 'silver_classic' | 'none';

export interface Plan {
  id: PlanType;
  price: number;
  name: string;
  badge?: string;
  popular?: boolean;
  description: string;
  ruleText: string;
  directCommission: number; // ₹65 for 100, ₹365 for 500, ₹765 for 1000
  commission: {
    level1: number;
    level2: number;
    level3: number;
  };
  payoutPerPerson: {
    level1: number;
    level2: number;
    level3: number;
  };
  cardType: 'normal' | 'platinum' | 'crown_gold';
  features: string[];
}

export interface CardPrivacySettings {
  isPublic: boolean;
  maskPhone: boolean;
  maskEmail: boolean;
  maskUpi: boolean;
}

export interface UserProfile {
  id: string; // Document ID / auth UID
  userId: string; // Unique FME ID (e.g. FME1001)
  username: string;
  name: string;
  email: string;
  whatsapp: string;
  telegram: string;
  upiId: string;
  upiName: string;
  sponsorId: string;
  sponsorName: string;
  plan: PlanType;
  planStatus: PlanStatus;
  role: UserRole;
  profilePic: string; // Avatar URL or avatar id
  avatarFrame?: AvatarFrameType; // Premium Frame design system
  cardPrivacy?: CardPrivacySettings; // Public/Private & details masking
  walletBalance: number; // in ₹
  totalEarned: number; // in ₹
  totalWithdrawn: number; // in ₹
  directReferralCount?: number;
  directReferralIncome?: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  level1Income: number;
  level2Income: number;
  level3Income: number;
  createdAt: string;
  password?: string; // stored for demo authentication sync
  paymentProof?: string; // Base64 data URL of transaction screenshot
  paymentProofUploadedAt?: string;
  rejectionReason?: string;
  lastPaymentMethod?: 'upi' | 'stripe' | 'qr';
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type:
    | 'commission_direct'
    | 'commission_l1'
    | 'commission_l2'
    | 'commission_l3'
    | 'activation_fee'
    | 'plan_payment'
    | 'plan_upgrade'
    | 'withdrawal'
    | 'bonus';
  description: string;
  fromUserId?: string;
  fromUserName?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}


export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  upiName: string;
  status: 'pending' | 'approved' | 'rejected';
  txnRef?: string;
  adminNote?: string;
  createdAt: string;
}

export interface SystemSettings {
  adminUpiId: string;
  adminUpiName: string;
  adminWhatsApp: string;
  adminEmail: string;
  notice: string;
  minWithdrawal: number;
  adminSecretPassword: string; // RAINAKSH
  stripeEnabled: boolean;
  allowDirectRegistration: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'broadcast' | 'payout' | 'verification' | 'system';
  targetUserId: string; // 'all' or specific userId (e.g. FME1024)
  readBy?: string[]; // userIds who read it
  createdAt: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string; // 'admin' or target userId
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface InquiryForm {
  name: string;
  phone: string;
  plan: PlanType;
  message: string;
}

export interface LeaderboardMember {
  rank: number;
  userId: string;
  name: string;
  username: string;
  profilePic: string;
  avatarFrame?: AvatarFrameType;
  plan: PlanType;
  directReferrals: number;
  totalTeam: number;
  totalEarned: number;
  directReferralIncome: number;
  badge?: string;
  city?: string;
  isCurrentUser?: boolean;
}

export interface ActivityLogItem {
  id: string;
  stepNumber: number;
  timestamp: string;
  type:
    | 'referral_joined'
    | 'commission_direct'
    | 'commission_l1'
    | 'commission_l2'
    | 'commission_l3'
    | 'activation_fee'
    | 'plan_payment'
    | 'plan_upgrade'
    | 'withdrawal'
    | 'bonus';
  title: string;
  description: string;
  amount?: number;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'purple' | 'gold';
  level?: 1 | 2 | 3;
  memberUserId?: string;
  memberName?: string;
  memberPlan?: PlanType;
  status: 'completed' | 'pending';
}

