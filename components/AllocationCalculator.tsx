
import React, { useState } from 'react';
import { Language, Currency, Expense, IncomeRecord } from '../types';
import { TRANSLATIONS, EXCHANGE_RATE_USD_TO_CNY } from '../constants';

interface AllocationCalculatorProps {
  lang: Language;
  currency: Currency;
  expenses?: Expense[];
  incomeRecords?: IncomeRecord[];
  onPlanConfirmed?: () => void;
}

interface AllocationResult {
  investment: number;
  ops: number;
  savings: number;
  investPct: number;
  opsPct: number;
  savingsPct: number;
}

const AllocationCalculator: React.FC<AllocationCalculatorProps> = ({ lang, currency, expenses = [], incomeRecords = [], onPlanConfirmed }) => {
  const t = TRANSLATIONS[lang];
  const [incomeInput, setIncomeInput] = useState<string>('10000');
  const [risk, setRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const currencySymbol = currency === 'USD' ? '$' : '¥';

  const calculate = (): AllocationResult => {
    const val = parseFloat(incomeInput) || 0;
    if (risk === 'conservative') return { 
      investment: val * 0.2, ops: val * 0.5, savings: val * 0.3, 
      investPct: 20, opsPct: 50, savingsPct: 30 
    };
    if (risk === 'aggressive') return { 
      investment: val * 0.5, ops: val * 0.4, savings: val * 0.1,
      investPct: 50, opsPct: 40, savingsPct: 10 
    };
    return { 
      investment: val * 0.35, ops: val * 0.45, savings: val * 0.2,
      investPct: 35, opsPct: 45, savingsPct: 20 
    };
  };

  const results = calculate();
  const rate = currency === 'CNY' ? EXCHANGE_RATE_USD_TO_CNY : 1;
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount * rate), 0);
  const actualRevenue = incomeRecords.reduce((sum, i) => sum + (i.amount * rate), 0);
  const remainingOps = results.ops - totalSpent;

  const pkPosition = risk === 'conservative' ? 15 : risk === 'balanced' ? 50 : 85;

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Primary Calculator Card */}
      <div className="relative p-7 rounded-[3rem] bg-[#0c0c0e]/80 border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl group">
        {/* Sci-fi Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 allocation-grid-pattern"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,216,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Tech Corners */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-xl"></div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
              {t.allocationTitle}
            </h3>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 pl-1">
                {t.income} (NEURAL BASE)
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400/60 font-black text-lg group-focus-within:text-cyan-400 transition-colors">
                  {currencySymbol}
                </span>
                <input 
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="w-full bg-[#050505]/80 border border-white/5 rounded-2xl p-5 pl-11 focus:border-cyan-500/50 outline-none text-white font-black mono text-xl tracking-tighter transition-all shadow-inner"
                />
                <div className="absolute inset-0 rounded-2xl border border-cyan-500/0 group-focus-within:border-cyan-500/20 pointer-events-none transition-all"></div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mb-4 pl-1">
                {t.risk} (STRATEGY BIAS)
              </label>
              <div className="flex bg-[#050505]/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm gap-2">
                {(['conservative', 'balanced', 'aggressive'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRisk(r)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden ${
                      risk === r 
                        ? 'bg-cyan-600/20 border border-cyan-500/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                        : 'text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]'
                    }`}
                  >
                    {risk === r && <div className="absolute inset-0 bg-cyan-400/5 animate-pulse"></div>}
                    <span className="relative z-10">{t.strategy[r]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-5">
              <div className="flex justify-between items-center group/item">
                <span className="text-gray-500 text-[11px] font-black uppercase tracking-widest group-hover/item:text-cyan-400/60 transition-colors">{t.invest}</span>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></div>
                  <span className="text-cyan-400 font-black mono text-lg tracking-tighter">
                    {currencySymbol}{results.investment.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-gray-500 text-[11px] font-black uppercase tracking-widest group-hover/item:text-white/60 transition-colors">{t.ops}</span>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <span className="text-white font-black mono text-lg tracking-tighter">
                    {currencySymbol}{results.ops.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-gray-500 text-[11px] font-black uppercase tracking-widest group-hover/item:text-green-400/60 transition-colors">{t.savings}</span>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/30"></div>
                  <span className="text-green-400 font-black mono text-lg tracking-tighter">
                    {currencySymbol}{results.savings.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => onPlanConfirmed?.()}
                className="w-full relative group/sync overflow-hidden mt-4"
              >
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover/sync:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#00df9a]/5 border border-[#00df9a]/20 text-[#00df9a] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(0,223,154,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:border-[#00df9a]/50">
                   <div className="w-1.5 h-1.5 bg-[#00df9a] rounded-full animate-ping"></div>
                   {lang === 'cn' ? '确认并同步每日攒钱目标' : 'Sync Daily Goal'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Stance Visualizer */}
      <div className="relative p-8 rounded-[3rem] bg-[#0c0c0e]/60 border border-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
          <svg className="w-16 h-16 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/>
          </svg>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">
                {t.strategicPK} <span className="text-cyan-500/50 ml-1">POSTURE</span>
              </h4>
              <span className="text-[9px] text-cyan-400/60 font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-[1px] bg-cyan-500"></div>
                {t.pkStatus}
              </span>
            </div>
            <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
              SECURE LINK
            </div>
          </div>

          <div className="relative pt-8 pb-4">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-4 px-2">
              <span className="text-green-500/80">{t.strategy.conservative}</span>
              <span className="text-cyan-400/80">{t.strategy.balanced}</span>
              <span className="text-red-500/80">{t.strategy.aggressive}</span>
            </div>
            
            <div className="relative h-4 w-full bg-[#050505] rounded-full overflow-visible flex items-center border border-white/5 shadow-inner">
              <div className="absolute inset-0 flex rounded-full overflow-hidden opacity-40">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-green-500/40 to-cyan-500/40"></div>
                <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500/40 to-red-500/40"></div>
                <div className="h-full w-1/3 bg-gradient-to-r from-red-500/40 to-transparent"></div>
              </div>
              
              {/* Animated Slider Thumb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 transition-all duration-1000 ease-out z-20"
                style={{ left: `calc(${pkPosition}% - 20px)` }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-full animate-pulse"></div>
                  <div className="w-7 h-7 bg-[#0c0c0e] rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                  </div>
                  {/* Decorative Crosshair HUD */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-400/50"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyan-400/50"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-cyan-400/50"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-400/50"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#050505]/60 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40"></div>
            <p className="text-[13px] text-gray-400 font-medium italic leading-relaxed pl-2">
              "{t.pkFeedback[risk]}"
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .allocation-grid-pattern {
          background-size: 25px 25px;
          background-image:
            linear-gradient(to right, rgba(34, 211, 238, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.08) 1px, transparent 1px);
          animation: alloc-grid-pulse 10s ease-in-out infinite;
        }

        @keyframes alloc-grid-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AllocationCalculator;
