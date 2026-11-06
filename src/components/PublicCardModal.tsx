import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  ShieldCheck,
  Lock,
  UserCheck,
  UserPlus,
  ExternalLink,
  Sparkles,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import { getPublicCardUser } from '../services/fmeService';
import { DigitalIdCard } from './DigitalIdCard';

interface PublicCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUserId?: string;
  onJoinWithSponsor?: (sponsorId: string, plan: PlanType) => void;
}

export const PublicCardModal: React.FC<PublicCardModalProps> = ({
  isOpen,
  onClose,
  initialUserId = '',
  onJoinWithSponsor,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialUserId);
  const [loading, setLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState<UserProfile | null>(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (initialUserId) {
      setSearchQuery(initialUserId);
      handleSearch(initialUserId);
    }
  }, [initialUserId, isOpen]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) {
      setSearchError('कृपया FME यूजर आईडी या यूजरनेम दर्ज करें।');
      return;
    }

    setLoading(true);
    setSearchError('');
    try {
      const user = await getPublicCardUser(q);
      if (!user) {
        setSearchedUser(null);
        setSearchError(`कोई यूजर नहीं मिला: "${q}". कृपया सही FME ID दर्ज करें।`);
      } else {
        setSearchedUser(user);
      }
    } catch (e) {
      setSearchError('कार्ड खोजने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCardPublic = searchedUser?.cardPrivacy?.isPublic ?? true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
            <span>आधिकारिक FME डिजिटल ID सत्यापन</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            सत्यापित डिजिटल ID कार्ड खोजें
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            किसी भी FME सदस्य की स्पॉन्सर आईडी डालकर उनका गवर्नमेंट-रूल कम्पलायंट आईडी कार्ड देखें
          </p>
        </div>

        {/* Search Bar (Flipkart Style) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2 mb-5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FME आईडी दर्ज करें (उदा. FME1024, FME_ADMIN)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {loading ? 'खोज रहे हैं...' : 'वेरीफाई करें'}
          </button>
        </form>

        {/* Error message */}
        {searchError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Card Result Area */}
        {searchedUser && (
          <div className="space-y-4">
            {!isCardPublic ? (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  गोपनीय डिजिटल कार्ड (Private Card)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  यह कार्ड यूजर ({searchedUser.userId}) द्वारा गोपनीयता सेटिंग के तहत प्राइवेट रखा गया है।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <DigitalIdCard user={searchedUser} isOwner={false} />

                {/* Direct Join under this Sponsor */}
                {onJoinWithSponsor && (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                        क्या आप {searchedUser.name} के साथ जुड़ना चाहते हैं?
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        स्पॉन्सर कोड: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{searchedUser.userId}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onJoinWithSponsor(searchedUser.userId, searchedUser.plan || '500');
                        onClose();
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#ffe11b] hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>इनके नीचे जॉइन करें</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Default Quick Samples */}
        {!searchedUser && !loading && (
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
              त्वरित डेमो कार्ड देखें:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('FME1024');
                  handleSearch('FME1024');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                FME1024 (राहुल शर्मा - ₹500)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('FME_ADMIN');
                  handleSearch('FME_ADMIN');
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                FME_ADMIN (विकास कुमार - ₹1000)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
