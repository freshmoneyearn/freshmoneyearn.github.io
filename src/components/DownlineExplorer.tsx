import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { DownlineMember, DownlineReport } from '../services/fmeService';

interface DownlineExplorerProps {
  downline: DownlineReport;
}

export const DownlineExplorer: React.FC<DownlineExplorerProps> = ({ downline }) => {
  const [activeTab, setActiveTab] = useState<'all' | '1' | '2' | '3'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allMembers: DownlineMember[] = [
    ...downline.level1,
    ...downline.level2,
    ...downline.level3,
  ];

  const getFilteredMembers = () => {
    let list = allMembers;
    if (activeTab === '1') list = downline.level1;
    if (activeTab === '2') list = downline.level2;
    if (activeTab === '3') list = downline.level3;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.userId.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.whatsapp.includes(q)
      );
    }
    return list;
  };

  const filteredMembers = getFilteredMembers();

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1.5">
            <Users className="w-3.5 h-3.5" /> आपकी पूरी डाउनलाइन टीम (3-Level Network)
          </div>
          <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
            आपके नीचे जुड़े सभी मेंबर्स की सूची व विवरण
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            यहाँ आप देख सकते हैं कि आपके डायरेक्ट (L1), सेकंड (L2) और थर्ड (L3) लेवल में कुल कौन-कौन जुड़ा है।
          </p>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            कुल डाउनलाइन: <span className="text-emerald-600 dark:text-emerald-400 font-black">{downline.totalMembers}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            सक्रिय (Active): <span className="font-black">{downline.activeMembers}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            सभी ({allMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('1')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === '1'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LEVEL 1 ({downline.level1.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('2')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === '2'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LEVEL 2 ({downline.level2.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('3')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === '3'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LEVEL 3 ({downline.level3.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="मेंबर का नाम या FME ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Downline Members List / Table */}
      {filteredMembers.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {searchQuery ? 'कोई परिणाम नहीं मिला।' : 'इस लेवल में अभी कोई मेंबर नहीं जुड़ा है।'}
          </p>
          <p className="text-[11px] text-slate-400">
            अपना रेफ़रल लिंक दोस्तों को शेयर करें और अपनी टीम बढ़ाएं।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-3">मेंबर ID व नाम</th>
                <th className="py-3 px-3">लेवल (Tier)</th>
                <th className="py-3 px-3">प्लान</th>
                <th className="py-3 px-3">स्पॉन्सर (किसने जोड़ा)</th>
                <th className="py-3 px-3">जॉइनिंग तारीख</th>
                <th className="py-3 px-3">अकाउंट स्थिति</th>
                <th className="py-3 px-3 text-right">आपको मिला कमीशन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((m) => {
                const isL1 = m.level === 1;
                const isL2 = m.level === 2;

                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{m.name}</span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                              {m.userId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>@{m.username}</span>
                            <span>·</span>
                            <span>{m.whatsapp}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          isL1
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isL2
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        LEVEL {m.level}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      ₹{m.plan}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{m.directSponsorName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{m.directSponsorId}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString('hi-IN')}
                    </td>

                    <td className="py-3 px-3">
                      {m.planStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          सक्रिय
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          पेंडिंग
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {m.commissionEarnedForUser > 0 ? (
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          +₹{m.commissionEarnedForUser}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">पेंडिंग एक्टिवेशन</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
