
import React, { useState } from 'react';
import { Language, Currency, Expense, IncomeRecord } from '../types';
import { TRANSLATIONS, EXCHANGE_RATE_USD_TO_CNY } from '../constants';

interface AllocationCalculatorProps {
  lang: Language;
  currency: Currency;
  expenses?: Expense[];
  incomeRecords?: IncomeRecord[];
}

interface AllocationResult {
  investment: number;
  ops: number;
  savings: number;
  investPct: number;
  opsPct: number;
  savingsPct: number;
}

const AllocationCalculator: React.FC<AllocationCalculatorProps> = ({ lang, currency, expenses = [], incomeRecords = [] }) => {
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
  
  // Note: For simplicity, assume user enters income in CURRENT display currency
  const incomeValue = parseFloat(incomeInput) || 0;
  
  // Convert expenses to display currency if needed
  // (Expenses are currently stored as numbers; in a real app we'd track their currency)
  // Here we assume expenses in the list are in USD base for simplicity
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
          </div>
        </div>
      </div>

      <div className="p-6 rounded-[2rem] bg-[#1e1e20]/60 border border-[#2a2a2c] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>

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
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_20px_white] transition-all duration-1000 ease-out flex items-center justify-center z-10 border-4 border-[#0062ff]"
              style={{ left: `calc(${pkPosition}% - 12px)` }}
            >
              <div className="w-2 h-2 bg-[#0062ff] rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="absolute top-[34px] left-0 w-full h-[1px] bg-blue-500/20 shadow-[0_0_10px_#0062ff]"></div>
        </div>

        <div className="mt-6 p-4 bg-[#0a0a0c]/50 rounded-2xl border border-white/5 relative">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#1e1e20] px-2 text-[9px] font-black text-gray-500 uppercase tracking-widest border border-[#2a2a2c] rounded-md">Martian Analysis</div>
          <p className="text-[12px] text-gray-300 leading-relaxed font-medium italic">"{t.pkFeedback[risk]}"</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#00df9a]/10 border border-[#00df9a]/30 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00df9a]">{t.expenses.actualIncome}</h3>
          <span className="text-[9px] font-bold text-gray-500">{t.expenses.projectedIncome}: {currencySymbol}{incomeValue.toLocaleString()}</span>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-2xl font-black mono text-white">{currencySymbol}{actualRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className={`text-[10px] font-bold mb-1 ${actualRevenue >= incomeValue ? 'text-[#00df9a]' : 'text-gray-500'}`}>
            {((actualRevenue / (incomeValue || 1)) * 100).toFixed(1)}% {lang === 'cn' ? '已入账' : 'Realized'}
          </div>
        </div>
        <div className="mt-3 h-1 w-full bg-[#111] rounded-full overflow-hidden">
          <div className="h-full bg-[#00df9a] transition-all duration-1000" style={{ width: `${Math.min(100, (actualRevenue / (incomeValue || 1)) * 100)}%` }}></div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#111]/80 border border-[#2a2a2c] backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{t.expenses.title}</h3>
          <div className="text-[10px] bg-[#ff4b5c]/10 text-[#ff4b5c] px-2 py-0.5 rounded-full border border-[#ff4b5c]/20 font-bold">LIVE AUDIT</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1a1a1c] p-3 rounded-xl border border-[#2a2a2c]">
            <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">{t.expenses.totalSpent}</div>
            <div className="text-lg font-black mono text-[#ff4b5c]">{currencySymbol}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-[#1a1a1c] p-3 rounded-xl border border-[#2a2a2c]">
            <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">{t.expenses.remaining}</div>
            <div className={`text-lg font-black mono ${remainingOps < 0 ? 'text-[#ff4b5c]' : 'text-[#00df9a]'}`}>
              {currencySymbol}{remainingOps.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationCalculator;
