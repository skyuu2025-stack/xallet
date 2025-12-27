
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { THEME_COLORS } from '../constants';
import { Currency } from '../types';

interface AssetTrendChartProps {
  totalBalance: number;
  lang: 'en' | 'cn';
  currency: Currency;
}

const AssetTrendChart: React.FC<AssetTrendChartProps> = ({ totalBalance, lang, currency }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const currencySymbol = currency === 'USD' ? '$' : '¥';

  const mockData = useMemo(() => {
    const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const data = [];
    let base = totalBalance * 0.9;
    for (let i = 0; i <= points; i++) {
      const volatility = timeframe === '1D' ? 0.02 : 0.08;
      const change = (Math.random() - 0.45) * base * volatility;
      base += change;
      data.push({
        time: i,
        value: Math.floor(base),
      });
    }
    data[data.length - 1].value = totalBalance;
    return data;
  }, [timeframe, totalBalance]);

  const labels = {
    '1D': lang === 'cn' ? '日' : '1D',
    '1W': lang === 'cn' ? '周' : '1W',
    '1M': lang === 'cn' ? '月' : '1M',
    '3M': lang === 'cn' ? '季' : '3M',
    '1Y': lang === 'cn' ? '年' : '1Y',
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2rem] p-5 space-y-4 shadow-2xl overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
            {lang === 'cn' ? '资产波动趋势' : 'PORTFOLIO TREND'}
          </span>
          <div className="flex items-baseline gap-2">
             <span className="text-xl font-black mono text-white">
               {currencySymbol}{mockData[mockData.length - 1].value.toLocaleString()}
             </span>
             <span className={`text-[10px] font-bold ${mockData[0].value < totalBalance ? 'text-[#00df9a]' : 'text-[#ff4b5c]'}`}>
               {mockData[0].value < totalBalance ? '▲' : '▼'} 
               {Math.abs(((totalBalance - mockData[0].value) / (mockData[0].value || 1)) * 100).toFixed(2)}%
             </span>
          </div>
        </div>
        
        <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[9px] font-black rounded-lg transition-all ${
                timeframe === tf ? 'bg-[#0062ff] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {labels[tf]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0062ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#0062ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" opacity={0.5} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
              itemStyle={{ color: '#0062ff', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any) => [`${currencySymbol}${value.toLocaleString()}`, 'Balance']}
            />
            <Area type="monotone" dataKey="value" stroke="#0062ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center text-[8px] font-black text-gray-600 uppercase tracking-widest px-1">
        <span>MARTIAN CORE TELEMETRY</span>
        <span className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#00df9a] animate-pulse"></div>
          LIVE FEED
        </span>
      </div>
    </div>
  );
};

export default AssetTrendChart;
