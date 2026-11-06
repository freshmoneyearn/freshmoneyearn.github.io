import { Plan } from '../types';

export interface PlanWithExactRule extends Plan {
  ruleText: string;
}

export const PLANS: PlanWithExactRule[] = [
  {
    id: '100',
    price: 100,
    name: '₹100 नॉर्मल सर्विस प्लान',
    badge: 'नॉर्मल डिजिटल कार्ड',
    popular: false,
    description: 'कम बजट में आसान शुरुआत। केवल ₹100 की सर्विस जॉइनिंग से डायरेक्ट ₹65 इंस्टेंट पेआउट व 3 LEVEL तक कमाई करें।',
    ruleText: '₹100 प्लान शेयर करने पर आपको तुरंत ₹65 का डायरेक्ट पेआउट मिलेगा! साथ ही LEVEL-1 से ₹30, LEVEL-2 से ₹10 तथा LEVEL-3 से ₹5 की प्राप्ति होगी।',
    directCommission: 65, // ₹65 instant payout per direct referral
    cardType: 'normal',
    commission: {
      level1: 30, // ₹30 per direct referral
      level2: 10, // ₹10 per level 2
      level3: 5,  // ₹5 per level 3
    },
    payoutPerPerson: {
      level1: 30,
      level2: 10,
      level3: 5,
    },
    features: [
      '⚡ डायरेक्ट रेफ़रल पर ₹65 इंस्टेंट पेआउट',
      '🪪 नॉर्मल मस्त लुक डिजिटल ID कार्ड',
      '3 LEVEL पैसिव टीम इनकम (L1 ₹30, L2 ₹10, L3 ₹5)',
      'PhonePe / GPay / Paytm UPI से तुरंत एक्टिवेशन',
      'न्यूनतम ₹50 विड्रॉल सुविधा सीधा खाते में',
      'पब्लिक / प्राइवेट ID कार्ड सुरक्षा कंट्रोल',
    ],
  },
  {
    id: '500',
    price: 500,
    name: '₹500 प्लेटिनम मेंबरशिप प्लान',
    badge: 'प्लेटिनम डिजिटल ID ⭐',
    popular: true,
    description: 'प्लेटिनम मेंबरशिप डैशबोर्ड। डायरेक्ट रेफ़रल पर ₹365 इंस्टेंट पेआउट, कस्टम एनालिटिक्स और एडवांस्ड CSV एक्सपोर्ट।',
    ruleText: '₹500 प्लान शेयर करने पर आपको तुरंत ₹365 का डायरेक्ट पेआउट मिलेगा! साथ ही LEVEL-1 से ₹150, LEVEL-2 से ₹75 तथा LEVEL-3 से ₹25 की प्राप्ति होगी।',
    directCommission: 365, // ₹365 instant payout per direct referral
    cardType: 'platinum',
    commission: {
      level1: 150, // ₹150
      level2: 75,  // ₹75
      level3: 25,  // ₹25
    },
    payoutPerPerson: {
      level1: 150,
      level2: 75,
      level3: 25,
    },
    features: [
      '⚡ डायरेक्ट रेफ़रल पर ₹365 इंस्टेंट पेआउट',
      '🪪 प्लेटिनम मेटैलिक डिजिटल ID कार्ड (Hologram)',
      '📊 कस्टम एनालिटिकल टूल्स & परफॉर्मेंस चार्ट्स',
      '📥 एडवांस्ड टीम & ट्रांजेक्शन CSV एक्सपोर्ट सुविधा',
      '3 LEVEL पैसिव टीम इनकम (L1 ₹150, L2 ₹75, L3 ₹25)',
      'एडमिन पर्सनल गाइड & 1-to-1 चैट प्रायोरिटी',
    ],
  },
  {
    id: '1000',
    price: 1000,
    name: '₹1000 प्रीमियम क्राउन VIP प्लान',
    badge: 'रॉयल क्राउन गोल्ड 👑',
    popular: false,
    description: 'रॉयल क्राउन गोल्ड प्रोफाइल व गोल्डन नेमप्लेट। डायरेक्ट रेफ़रल पर ₹765 का महा-पेआउट और वीआईपी एक्सक्लूसिव बैज।',
    ruleText: '₹1000 प्लान शेयर करने पर आपको तुरंत ₹765 का डायरेक्ट पेआउट मिलेगा! साथ ही LEVEL-1 से ₹400, LEVEL-2 से ₹150 तथा LEVEL-3 से ₹50 की प्राप्ति होगी।',
    directCommission: 765, // ₹765 instant payout per direct referral
    cardType: 'crown_gold',
    commission: {
      level1: 400, // ₹400
      level2: 150, // ₹150
      level3: 50,  // ₹50
    },
    payoutPerPerson: {
      level1: 400,
      level2: 150,
      level3: 50,
    },
    features: [
      '⚡ डायरेक्ट रेफ़रल पर ₹765 इंस्टेंट पेआउट',
      '👑 प्रीमियम क्राउन रॉयल गोल्ड डिजिटल ID कार्ड',
      '✨ गोल्डन नेमप्लेट प्रोफाइल & एक्सक्लूसिव VIP बैज',
      '💎 प्रीमियम फ्रेम डिज़ाइन सिस्टम (Crown & Diamond)',
      '3 LEVEL अधिकतम इनकम (L1 ₹400, L2 ₹150, L3 ₹50)',
      'सुपर-फास्ट ऑटो पेआउट & डायरेक्ट एडमिन हॉटलाइन',
    ],
  },
];

// Official payment details given by user
export const OFFICIAL_UPI_ID = '8877490845@spicepay';
export const OFFICIAL_UPI_NAME = 'vikas kumar';
export const ADMIN_SECRET_CODE = 'RAINAKSH';

export const CONTACT_EMAIL = 'freshmoneyearn@gmail.com';
export const WHATSAPP_DISPLAY = '+91 88774 90845';
export const WHATSAPP_NUMBER = '918877490845';
