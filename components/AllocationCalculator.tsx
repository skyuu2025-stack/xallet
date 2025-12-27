
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
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#111] border border-[#222]">
        <h3 className="text-lg font-bold mb-4">{t.allocationTitle}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{t.income} ({currency})</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{currencySymbol}</span>
              <input 
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] rounded-lg p-2 pl-7 focus:border-blue-500 outline-none text-white mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2">{t.risk}</label>
            <div className="flex gap-2">
              {(['conservative', 'balanced', 'aggressive'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`flex-1 py-1.5 text-[11px] rounded-lg border capitalize transition-all ${
                    risk === r ? 'bg-[#0052ff] border-[#0052ff] text-white font-bold shadow-[0_0_15px_rgba(0,82,255,0.4)]' : 'bg-transparent border-[#222] text-gray-400'
                  }`}
                >
                  {t.strategy[r]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#222] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{t.invest}</span>
              <span className="text-blue-400 font-bold mono">{currencySymbol}{results.investment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{t.ops}</span>
              <span className="text-white font-bold mono">{currencySymbol}{results.ops.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{t.savings}</span>
              <span className="text-green-400 font-bold mono">{currencySymbol}{results.savings.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => onPlanConfirmed?.()}
              className="w-full bg-[#00df9a]/10 text-[#00df9a] py-3 rounded-xl border border-[#00df9a]/30 text-[10px] font-black uppercase tracking-widest mt-4"
            >
              {lang === 'cn' ? '确认并同步每日攒钱目标' : 'Confirm & Sync Daily Goal'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-[2rem] bg-[#1e1e20]/60 border border-[#2a2a2c] backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{t.strategicPK}</h4>
            <span className="text-[9px] text-blue-500 font-bold animate-pulse">{t.pkStatus}</span>
          </div>
        </div>
        <div className="relative pt-6 pb-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tight mb-3 px-1">
            <span className="text-[#00c076]">{t.strategy.conservative}</span>
            <span className="text-gray-400">{t.strategy.balanced}</span>
            <span className="text-[#ff4d4f]">{t.strategy.aggressive}</span>
          </div>
          <div className="h-3 w-full bg-[#111] rounded-full overflow-hidden flex border border-[#2a2a2c] relative">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent to-[#00c076]/30"></div>
            <div className="h-full w-1/3 bg-gradient-to-r from-[#00c076]/30 via-[#0052ff]/30 to-[#ff4d4f]/30"></div>
            <div className="h-full w-1/3 bg-gradient-to-r from-[#ff4d4f]/30 to-transparent"></div>
            <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-all duration-1000 ease-out flex items-center justify-center z-10 border-4 border-[#0062ff]" style={{ left: `calc(${pkPosition}% - 12px)` }}>
              <div className="w-2 h-2 bg-[#0062ff] rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-[#0a0a0c]/50 rounded-2xl border border-white/5">
          <p className="text-[12px] text-gray-300 italic">"{t.pkFeedback[risk]}"</p>
        </div>
      </div>
    </div>
  );
};

export default AllocationCalculator;
