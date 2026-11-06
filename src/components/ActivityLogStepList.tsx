import React, { useState } from 'react';
import {
  ActivityLogItem,
  PlanType,
} from '../types';
import {
  Sparkles,
  UserPlus,
  ArrowDownToLine,
  Crown,
  CreditCard,
  CheckCircle2,
  Clock,
  Filter,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Share2,
  Award,
  RefreshCw,
} from 'lucide-react';

interface ActivityLogStepListProps {
  items: ActivityLogItem[];
  userPlan: PlanType;
  onRefresh?: () => void;
  onOpenSocialShare?: () => void;
  onOpenUpgrade?: () => void;
}

export const ActivityLogStepList: React.FC<ActivityLogStepListProps> = ({
  items,
  userPlan,
  onRefresh,
  onOpenSocialShare,
  onOpenUpgrade,
}) => {
  const [filter, setFilter] = useState<'all' | 'referrals' | 'commissions' | 'plans'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on active tab and search
  const filteredItems = items.filter((item) => {
    if (filter === 'referrals' && item.type !== 'referral_joined') return false;
    if (
      filter === 'commissions' &&
      !['commission_direct', 'commission_l1', 'commission_l2', 'commission_l3'].includes(item.type)
    )
      return false;
    if (filter === 'plans' && !['plan_payment', 'plan_upgrade', 'activation_fee'].includes(item.type))
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchMember = item.memberName?.toLowerCase().includes(q) || false;
      const matchId = item.memberUserId?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchMember || matchId;
    }

    return true;
  });

  // Calculate quick summary metrics
  const totalCommissionAmount = items
    .filter((i) => ['commission_direct', 'commission_l1', 'commission_l2', 'commission_l3'].includes(i.type))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalReferralJoinedCount = items.filter((i) => i.type === 'referral_joined').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-800/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2874f0] to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  गतिविधि व कमाई टाइमलाइन (Activity Log)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ffe11b] text-slate-950 uppercase">
                  Step-by-Step
                </span>
              </div>
              <p className="text-xs text-blue-200/90">
                आपके रेफ़रल जॉइनिंग, इंस्टेंट डायरेक्ट पेआउट्स व कमीशन क्रेडिट्स का विस्तृत स्टेप-बाय-स्टेप विवरण
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="रिफ्रेश करें"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">रिफ्रेश</span>
              </button>
            )}
            {onOpenSocialShare && (
              <button
                type="button"
                onClick={onOpenSocialShare}
                className="px-3.5 py-2 rounded-xl bg-[#ffe11b] hover:bg-yellow-400 active:scale-95 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>नया रेफ़रल जोड़ें</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Metric Summary Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-blue-200">कुल रिकॉर्डेड एक्टिविटीज</div>
            <div className="text-xl font-black text-white mt-0.5">{items.length} स्टेप्स</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-emerald-300">टाइमलाइन से कुल कमीशन</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              ₹{totalCommissionAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-yellow-300">सफल रेफ़रल जॉइनिंग्स</div>
            <div className="text-xl font-black text-yellow-400 mt-0.5">
              {totalReferralJoinedCount} मेंबर्स
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#2874f0] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            सभी स्टेप्स ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('commissions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap ${
              filter === 'commissions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            💰 कमीशन पेआउट्स
          </button>

          <button
            type="button"
            onClick={() => setFilter('referrals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap ${
              filter === 'referrals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            👥 रेफ़रल जॉइनिंग
          </button>

          <button
            type="button"
            onClick={() => setFilter('plans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap ${
              filter === 'plans'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            👑 प्लान अपग्रेड व पेमेंट्स
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, FME ID या विवरण खोजें..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
          />
        </div>
      </div>

      {/* STEP-LIST TIMELINE CONTAINER */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">कोई गतिविधि रिकॉर्ड नहीं मिली</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            इस फ़िल्टर या खोज के लिए कोई गतिविधि नहीं मिली। अपना रेफ़रल लिंक दोस्तों से साझा करें और पहली कमाई शुरू करें!
          </p>
          {onOpenSocialShare && (
            <button
              type="button"
              onClick={onOpenSocialShare}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2874f0] text-white text-xs font-bold cursor-pointer hover:bg-blue-600"
            >
              रेफ़रल लिंक शेयर करें
            </button>
          )}
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#2874f0] before:via-emerald-500 before:to-indigo-500">
          {filteredItems.map((item, index) => {
            const isDirectCommission = item.type === 'commission_direct';
            const isTeamCommission =
              item.type === 'commission_l1' || item.type === 'commission_l2' || item.type === 'commission_l3';
            const isReferralJoin = item.type === 'referral_joined';
            const isPlan = item.type === 'plan_payment' || item.type === 'plan_upgrade';
            const isWithdrawal = item.type === 'withdrawal';

            // Determine badge colors & icon
            let stepIcon = <Sparkles className="w-4 h-4 text-white" />;
            let markerBg = 'bg-[#2874f0]';

            if (isDirectCommission) {
              stepIcon = <Sparkles className="w-4 h-4 text-slate-950" />;
              markerBg = 'bg-gradient-to-r from-amber-400 to-[#ffe11b] ring-4 ring-yellow-400/20';
            } else if (isTeamCommission) {
              stepIcon = <TrendingUp className="w-4 h-4 text-white" />;
              markerBg = 'bg-emerald-600 ring-4 ring-emerald-500/20';
            } else if (isReferralJoin) {
              stepIcon = <UserPlus className="w-4 h-4 text-white" />;
              markerBg = 'bg-indigo-600 ring-4 ring-indigo-500/20';
            } else if (isPlan) {
              stepIcon = <Crown className="w-4 h-4 text-slate-950" />;
              markerBg = 'bg-gradient-to-r from-amber-400 to-yellow-500 ring-4 ring-amber-400/20';
            } else if (isWithdrawal) {
              stepIcon = <ArrowDownToLine className="w-4 h-4 text-white" />;
              markerBg = 'bg-rose-600 ring-4 ring-rose-500/20';
            }

            return (
              <div key={item.id} className="relative group">
                {/* Step Circle Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${markerBg} flex items-center justify-center shadow-md -translate-x-1/2 z-10 transition-transform group-hover:scale-110`}
                >
                  {stepIcon}
                </div>

                {/* Step Content Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#2874f0] dark:hover:border-blue-500 transition-all space-y-3">
                  {/* Step Header: Step Number, Title & Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        STEP #{item.stepNumber}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.timestamp).toLocaleString('hi-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                  </div>

                  {/* Step Details & Financial Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Associated Member details chip if available */}
                      {item.memberName && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            👤 {item.memberName}
                          </span>
                          {item.memberUserId && (
                            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                              ID: {item.memberUserId}
                            </span>
                          )}
                          {item.memberPlan && (
                            <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                              ₹{item.memberPlan} प्लान
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Financial Amount Badge */}
                    {item.amount !== undefined && (
                      <div className="shrink-0 self-start sm:self-center">
                        <div
                          className={`px-3.5 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 shadow-xs ${
                            isWithdrawal
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : isPlan
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {isWithdrawal ? `- ₹${item.amount}` : isPlan ? `₹${item.amount}` : `+ ₹${item.amount}`}
                        </div>
                        {item.badgeText && (
                          <div className="text-[10px] font-semibold text-slate-400 text-right mt-1">
                            {item.badgeText}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-50 dark:border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.status === 'completed' ? 'सिस्टम में सत्यापित (Verified)' : 'प्रक्रियाधीन'}
                      </span>
                    </div>

                    {isReferralJoin && onOpenSocialShare && (
                      <button
                        type="button"
                        onClick={onOpenSocialShare}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>मैसेज भेजें</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
