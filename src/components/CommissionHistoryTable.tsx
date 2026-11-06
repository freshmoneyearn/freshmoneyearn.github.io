import React, { useState, useMemo } from 'react';
import {
  History,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  Layers,
  ArrowUpDown,
  CreditCard,
  Crown,
  Zap,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Transaction } from '../types';

interface CommissionHistoryTableProps {
  transactions: Transaction[];
  currentUserId: string;
  onUpgradePlan?: () => void;
}

export const CommissionHistoryTable: React.FC<CommissionHistoryTableProps> = ({
  transactions,
  currentUserId,
  onUpgradePlan,
}) => {
  const [filterType, setFilterType] = useState<
    'all' | 'commissions' | 'plans' | 'withdrawals'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Filter by tab category
        if (filterType === 'commissions') {
          if (!t.type.startsWith('commission')) return false;
        } else if (filterType === 'plans') {
          if (t.type !== 'plan_payment' && t.type !== 'plan_upgrade' && t.type !== 'activation_fee') {
            return false;
          }
        } else if (filterType === 'withdrawals') {
          if (t.type !== 'withdrawal') return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const nameMatch = t.fromUserName?.toLowerCase().includes(query);
          const idMatch = t.fromUserId?.toLowerCase().includes(query);
          const descMatch = t.description.toLowerCase().includes(query);
          const txIdMatch = t.id.toLowerCase().includes(query);
          const amountMatch = t.amount.toString().includes(query);
          return nameMatch || idMatch || descMatch || txIdMatch || amountMatch;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, filterType, searchQuery, sortOrder]);

  // Aggregate stats
  const totalCommissions = useMemo(() => {
    return transactions
      .filter((t) => t.type.startsWith('commission'))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalPlanPayments = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'plan_payment' || t.type === 'plan_upgrade' || t.type === 'activation_fee')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalWithdrawals = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'withdrawal' && t.status !== 'failed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        date: date.toLocaleDateString('hi-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        time: date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    } catch (e) {
      return { date: isoString, time: '' };
    }
  };

  const getBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'plan_upgrade':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-xs">
            <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>प्लान अपग्रेड</span>
          </span>
        );
      case 'plan_payment':
      case 'activation_fee':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>प्लान एक्टिवेशन</span>
          </span>
        );
      case 'commission_direct':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>डायरेक्ट पेआउट</span>
          </span>
        );
      case 'commission_l1':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>LEVEL 1</span>
          </span>
        );
      case 'commission_l2':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            <span>LEVEL 2</span>
          </span>
        );
      case 'commission_l3':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span>LEVEL 3</span>
          </span>
        );
      case 'withdrawal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />
            <span>UPI निकासी</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            लेन-देन
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Transaction ID', 'Type', 'Amount (INR)', 'Description', 'From Member', 'Date', 'Status'],
      ...filteredTransactions.map((t) => [
        t.id,
        t.type,
        `₹${t.amount}`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.fromUserName ? `${t.fromUserName} (${t.fromUserId})` : '',
        new Date(t.createdAt).toLocaleString('hi-IN'),
        t.status,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FME_Transactions_${currentUserId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#2874f0] flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>लेन-देन इतिहास (Transaction History)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  सभी गतिविधियाँ
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            प्लान अपग्रेड, एक्टिवेशन फीस, डायरेक्ट रेफरल पेआउट्स, 3-लेवल कमीशन और बैंक निकासी का पूर्ण कालानुक्रमिक खाता
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {onUpgradePlan && (
            <button
              type="button"
              onClick={onUpgradePlan}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>प्लान अपग्रेड करें</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV एक्सपोर्ट</span>
          </button>
        </div>
      </div>

      {/* Aggregate Financial Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Commissions */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 space-y-1">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span>कुल कमीशन पेआउट्स</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            +₹{totalCommissions.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70">
            डायरेक्ट + 3-लेवल कमीशन
          </div>
        </div>

        {/* Total Plan Upgrades & Payments */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 space-y-1">
          <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300 flex items-center justify-between">
            <span>प्लान एक्टिवेशन / अपग्रेड</span>
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
            ₹{totalPlanPayments.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-blue-700/70 dark:text-blue-400/70">
            सर्विस फीस व अपग्रेड
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 space-y-1">
          <div className="text-[11px] font-bold text-rose-800 dark:text-rose-300 flex items-center justify-between">
            <span>कुल UPI निकासी</span>
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            -₹{totalWithdrawals.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-rose-700/70 dark:text-rose-400/70">
            सफल बैंक ट्रांसफर
          </div>
        </div>

        {/* Total Count */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>कुल गतिविधियां</span>
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {transactions.length}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            सत्यापित लेजर रिकॉर्ड्स
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setFilterType('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 shrink-0 ${
              filterType === 'all'
                ? 'bg-[#2874f0] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            सभी गतिविधियाँ ({transactions.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterType('commissions');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1.5 ${
              filterType === 'commissions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>कमीशन पेआउट्स</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterType('plans');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1.5 ${
              filterType === 'plans'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>प्लान अपग्रेड व एक्टिवेशन</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterType('withdrawals');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1.5 ${
              filterType === 'withdrawals'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>निकासी</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="नाम, FME ID, या विवरण खोजें..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
            />
          </div>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            title={sortOrder === 'desc' ? 'नवीनतम पहले' : 'पुराना पहले'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {sortOrder === 'desc' ? 'नवीनतम' : 'पुराना'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Table Layout (Desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">तारीख व समय (Date & Time)</th>
              <th className="py-3 px-4">प्रकार (Activity Type)</th>
              <th className="py-3 px-4">सदस्य (Member / Source)</th>
              <th className="py-3 px-4">विवरण (Description)</th>
              <th className="py-3 px-4 text-right">राशि (Amount)</th>
              <th className="py-3 px-4 text-center">स्थिति</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <History className="w-8 h-8 opacity-40 text-slate-400" />
                    <span className="text-sm font-semibold">कोई लेन-देन गतिविधि नहीं मिली।</span>
                    <span className="text-xs text-slate-400">अपनी खोज या फ़िल्टर बदलकर पुनः प्रयास करें।</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((t) => {
                const { date, time } = formatDate(t.createdAt);
                const isWithdrawal = t.type === 'withdrawal';
                const isPlanPayment = t.type === 'plan_payment' || t.type === 'plan_upgrade' || t.type === 'activation_fee';

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 ml-5">{time}</div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getBadge(t.type)}
                    </td>

                    {/* Member */}
                    <td className="py-3 px-4">
                      {t.fromUserName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                            {t.fromUserName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                              {t.fromUserName}
                            </div>
                            {t.fromUserId && (
                              <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                {t.fromUserId}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">- FME -</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium max-w-sm">
                        {t.description}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{t.id}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div
                        className={`text-sm font-black ${
                          isWithdrawal
                            ? 'text-rose-600 dark:text-rose-400'
                            : isPlanPayment
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isWithdrawal ? `- ₹${t.amount}` : isPlanPayment ? `₹${t.amount}` : `+ ₹${t.amount}`}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {t.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          सफल (Credited)
                        </span>
                      ) : t.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          प्रक्रिया में
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          अस्वीकृत
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {paginatedTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
            कोई लेन-देन गतिविधि नहीं मिली।
          </div>
        ) : (
          paginatedTransactions.map((t) => {
            const { date, time } = formatDate(t.createdAt);
            const isWithdrawal = t.type === 'withdrawal';
            const isPlanPayment = t.type === 'plan_payment' || t.type === 'plan_upgrade' || t.type === 'activation_fee';

            return (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getBadge(t.type)}
                    <span className="text-[11px] text-slate-500 font-medium">{date}</span>
                  </div>

                  <div
                    className={`text-base font-black ${
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

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {t.description}
                </div>

                {t.fromUserName && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="text-slate-500">सदस्य / स्त्रोत:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {t.fromUserName} ({t.fromUserId})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-mono text-[10px]">{t.id}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    सफल
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            कुल {filteredTransactions.length} गतिविधियों में से {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} दिखाया जा रहा है
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3.5 py-1 font-bold text-slate-800 dark:text-slate-200">
              पृष्ठ {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
