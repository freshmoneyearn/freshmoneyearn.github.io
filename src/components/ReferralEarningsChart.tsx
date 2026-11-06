import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Sparkles } from 'lucide-react';

interface ReferralEarningsChartProps {
  level1Count: number;
  level1Income: number;
  level2Count: number;
  level2Income: number;
  level3Count: number;
  level3Income: number;
}

export const ReferralEarningsChart: React.FC<ReferralEarningsChartProps> = ({
  level1Count,
  level1Income,
  level2Count,
  level2Income,
  level3Count,
  level3Income,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'earnings' | 'referrals'>('both');

  const chartData = [
    {
      name: 'LEVEL 1',
      fullName: 'लेवल 1 (डायरेक्ट)',
      referrals: level1Count,
      earnings: level1Income,
    },
    {
      name: 'LEVEL 2',
      fullName: 'लेवल 2 (टीम)',
      referrals: level2Count,
      earnings: level2Income,
    },
    {
      name: 'LEVEL 3',
      fullName: 'लेवल 3 (नेटवर्क)',
      referrals: level3Count,
      earnings: level3Income,
    },
  ];

  const totalReferrals = level1Count + level2Count + level3Count;
  const totalEarnings = level1Income + level2Income + level3Income;

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = chartData.find((d) => d.name === label);
      return (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[170px]">
          <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{dataItem?.fullName || label}</span>
            <span className="text-[10px] text-slate-400">3-Level FME</span>
          </div>
          <div className="flex justify-between items-center text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              रेफरल्स संख्या:
            </span>
            <span className="font-extrabold text-white">
              {payload.find((p: any) => p.dataKey === 'referrals')?.value ?? 0} मेंबर्स
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              कुल कमाई:
            </span>
            <span className="font-extrabold text-amber-300">
              ₹{(payload.find((p: any) => p.dataKey === 'earnings')?.value ?? 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> 3-Level विजुअलाइजेशन बार चार्ट (Recharts)
          </div>
          <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
            तीनों लेवल के रेफरल्स व कुल कमाई का तुलनात्मक ग्राफ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            लेवल 1, 2 और 3 में कुल <strong>{totalReferrals} रेफरल्स</strong> से <strong>₹{totalEarnings.toLocaleString('en-IN')}</strong> की कमाई हुई।
          </p>
        </div>

        {/* View mode filter buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'both'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            दोनों देखें
          </button>
          <button
            type="button"
            onClick={() => setViewMode('earnings')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'earnings'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            केवल कमाई (₹)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('referrals')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'referrals'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            केवल रेफरल्स
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ opacity: 0.2 }}
              tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
            />
            {/* Left Y-Axis for Referrals Count */}
            {(viewMode === 'both' || viewMode === 'referrals') && (
              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#10b981' }}
                domain={[0, 'auto']}
                name="रेफरल्स"
              />
            )}

            {/* Right Y-Axis for Earnings in Rupees */}
            {(viewMode === 'both' || viewMode === 'earnings') && (
              <YAxis
                yAxisId="right"
                orientation={viewMode === 'earnings' ? 'left' : 'right'}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#f59e0b' }}
                domain={[0, 'auto']}
                tickFormatter={(val) => `₹${val}`}
                name="कमाई ₹"
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: '12px' }}
              formatter={(value) => (
                <span className="text-slate-700 dark:text-slate-300 font-bold">
                  {value === 'referrals' ? 'रेफरल्स संख्या (Referrals)' : 'कुल कमाई (Total Earnings ₹)'}
                </span>
              )}
            />

            {(viewMode === 'both' || viewMode === 'referrals') && (
              <Bar
                yAxisId="left"
                dataKey="referrals"
                name="referrals"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            )}

            {(viewMode === 'both' || viewMode === 'earnings') && (
              <Bar
                yAxisId="right"
                dataKey="earnings"
                name="earnings"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Summary Footnotes */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">LEVEL 1 डायरेक्ट</div>
          <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">
            {level1Count} मेंबर्स · <span className="text-emerald-600 dark:text-emerald-400">₹{level1Income}</span>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">LEVEL 2 टीम</div>
          <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">
            {level2Count} मेंबर्स · <span className="text-emerald-600 dark:text-emerald-400">₹{level2Income}</span>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">LEVEL 3 नेटवर्क</div>
          <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">
            {level3Count} मेंबर्स · <span className="text-emerald-600 dark:text-emerald-400">₹{level3Income}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
