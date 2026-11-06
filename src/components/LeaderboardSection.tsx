import React, { useState } from 'react';
import {
  LeaderboardMember,
  PlanType,
} from '../types';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Users,
  TrendingUp,
  Sparkles,
  Share2,
  ChevronRight,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LeaderboardSectionProps {
  members: LeaderboardMember[];
  currentUserId: string;
  onShareReferral: () => void;
  onUpgradePlan: () => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  members,
  currentUserId,
  onShareReferral,
  onUpgradePlan,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'crown' | 'top5'>('all');

  // Find user's rank in the leaderboard
  const currentUserIndex = members.findIndex((m) => m.userId === currentUserId || m.isCurrentUser);
  const currentUserEntry = currentUserIndex !== -1 ? members[currentUserIndex] : null;
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;

  // Filter members if needed
  const filteredMembers = members.filter((m) => {
    if (activeFilter === 'crown') return m.plan === '1000';
    if (activeFilter === 'top5') return m.rank <= 5;
    return true;
  });

  // Top 3 Podium Members
  const top1 = members.find((m) => m.rank === 1);
  const top2 = members.find((m) => m.rank === 2);
  const top3 = members.find((m) => m.rank === 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 🏆 GAMIFIED HERO BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-slate-950 shadow-xl border border-yellow-300/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-yellow-400 text-xs font-black uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>FRESH MONEY EARN हॉल ऑफ फेम · TOP 10 लीडरबोर्ड</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              टॉप 10 डायरेक्ट रेफ़रल चैंपियंस लीडरबोर्ड
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-900/90 leading-relaxed">
              पूरे भारत में सबसे ज्यादा रेफ़रल और सबसे ज्यादा कमीशन कमाने वाले शीर्ष 10 मेंबर्स। आप भी अपना रेफ़रल लिंक शेयर करके टॉप रैंक हासिल कर सकते हैं!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onShareReferral}
              className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4 text-yellow-400" />
              <span>रेफ़रल लिंक शेयर करें</span>
            </button>
            <button
              type="button"
              onClick={onUpgradePlan}
              className="px-4 py-3 rounded-2xl bg-white/90 hover:bg-white active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>₹1000 क्राउन अपग्रेड</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow icon */}
        <Trophy className="absolute -right-8 -bottom-10 w-64 h-64 text-yellow-400/20 pointer-events-none select-none" />
      </div>

      {/* 🎯 USER'S PERSONAL STANDING BANNER */}
      {currentUserEntry && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border border-blue-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2874f0] text-white flex items-center justify-center font-black text-lg shadow-sm border border-white/20">
              #{currentUserRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-300">आपकी लीडरबोर्ड रैंक:</span>
                <span className="text-base font-black text-yellow-300">#{currentUserRank}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                  {currentUserEntry.badge || 'एक्टिव प्रमोटर'}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                आपके <strong className="text-white font-black">{currentUserEntry.directReferrals} सफल रेफ़रल</strong> हैं।
                {currentUserRank && currentUserRank > 3 ? (
                  <span>
                    {' '}टॉप 3 में आने के लिए केवल{' '}
                    <strong className="text-yellow-300 font-bold">
                      {Math.max(1, (top3?.directReferrals || 11) - currentUserEntry.directReferrals + 1)} और रेफ़रल
                    </strong>{' '}
                    चाहिए!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold"> 🏆 बधाई! आप भारत के टॉप 3 लीडर्स में शामिल हैं!</span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onShareReferral}
            className="px-4 py-2 rounded-xl bg-[#ffe11b] hover:bg-yellow-400 active:scale-95 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>रैंक बढ़ाएं (Share Link)</span>
          </button>
        </div>
      )}

      {/* 🥇 TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* RANK 2: Silver (Left on Desktop) */}
        {top2 && (
          <div className="order-2 md:order-1 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex flex-col justify-between relative hover:border-slate-400 transition-all">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>RANK #2</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={top2.profilePic}
                  alt={top2.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-900">
                  🥈
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  <span>{top2.name}</span>
                  {top2.isCurrentUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-700 font-bold">आप</span>
                  )}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono">ID: {top2.userId} · {top2.city}</div>
              </div>

              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-500">सफल रेफ़रल</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{top2.directReferrals}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-500">कुल कमाई</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{top2.totalEarned.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                {top2.badge || '🥈 स्टार प्रमोटर'}
              </span>
            </div>
          </div>
        )}

        {/* RANK 1: Gold Champion (Center & Elevated) */}
        {top1 && (
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-yellow-100/60 dark:from-amber-950/40 dark:to-slate-900 border-2 border-yellow-400 dark:border-yellow-500/60 shadow-lg flex flex-col justify-between relative hover:scale-102 transition-all">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#ffe11b] text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>चैंपियन #1</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={top1.profilePic}
                  alt={top1.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-xl ring-4 ring-yellow-400/30"
                />
                <div className="absolute -top-3 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-sm font-black shadow-md border-2 border-white">
                  👑
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  <span>{top1.name}</span>
                  {top1.isCurrentUser && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-100 text-blue-700 font-bold">आप</span>
                  )}
                </h3>
                <div className="text-xs text-slate-500 font-mono">ID: {top1.userId} · {top1.city}</div>
              </div>

              <div className="w-full pt-2 border-t border-yellow-200/60 dark:border-yellow-800/40 grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 shadow-xs">
                  <div className="text-[10px] text-slate-500">सफल रेफ़रल</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{top1.directReferrals}</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 shadow-xs">
                  <div className="text-[10px] text-slate-500">कुल कमाई</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{top1.totalEarned.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-400 px-3 py-1 rounded-full shadow-xs">
                {top1.badge || '🏆 ऑल-टाइम चैंपियन'}
              </span>
            </div>
          </div>
        )}

        {/* RANK 3: Bronze (Right on Desktop) */}
        {top3 && (
          <div className="order-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300/60 dark:border-amber-800/60 shadow-sm flex flex-col justify-between relative hover:border-amber-400 transition-all">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>RANK #3</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={top3.profilePic}
                  alt={top3.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-900">
                  🥉
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  <span>{top3.name}</span>
                  {top3.isCurrentUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-700 font-bold">आप</span>
                  )}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono">ID: {top3.userId} · {top3.city}</div>
              </div>

              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-500">सफल रेफ़रल</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{top3.directReferrals}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-500">कुल कमाई</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{top3.totalEarned.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                {top3.badge || '🥉 प्रो लीडर'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 📊 RANKS 4 TO 10 DETAILED LEADERBOARD TABLE */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2874f0]" />
              <span>लीडरबोर्ड रैंकिंग्स (Ranks #4 to #10)</span>
            </h3>
            <p className="text-xs text-slate-500">
              सफल डायरेक्ट रेफ़रल व कुल टीम टर्नओवर के आधार पर वास्तविक समय की रैंकिंग
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              सभी मेंबर्स
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('crown')}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeFilter === 'crown'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              👑 ₹1000 क्राउन
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">रैंक</th>
                <th className="py-3 px-3">मेंबर विवरण</th>
                <th className="py-3 px-3">प्लान मेंबरशिप</th>
                <th className="py-3 px-3 text-center">डायरेक्ट रेफ़रल्स</th>
                <th className="py-3 px-3 text-center">कुल टीम</th>
                <th className="py-3 px-3 text-right">कुल कमाई</th>
                <th className="py-3 px-3 text-center">अचीवमेंट बैज</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers
                .filter((m) => m.rank >= 4)
                .map((m) => {
                  const isCurrent = m.userId === currentUserId || m.isCurrentUser;
                  return (
                    <tr
                      key={m.userId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold border-l-4 border-l-[#2874f0]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank Chip */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs ${
                            isCurrent
                              ? 'bg-[#2874f0] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          #{m.rank}
                        </span>
                      </td>

                      {/* Member Info */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.profilePic}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-600 text-white font-bold">
                                  आप
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {m.userId} · {m.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.plan === '1000'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : m.plan === '500'
                              ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300'
                              : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {m.plan === '1000' && <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />}
                          <span>₹{m.plan} प्लान</span>
                        </span>
                      </td>

                      {/* Direct Referrals Count */}
                      <td className="py-3 px-3 text-center whitespace-nowrap font-black text-slate-900 dark:text-white text-sm">
                        {m.directReferrals}
                      </td>

                      {/* Total Team Count */}
                      <td className="py-3 px-3 text-center whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {m.totalTeam}
                      </td>

                      {/* Total Earned */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{m.totalEarned.toLocaleString('en-IN')}
                      </td>

                      {/* Achievement Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {m.badge || '⚡ एक्टिव'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
