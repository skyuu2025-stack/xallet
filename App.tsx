
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { INITIAL_ASSETS, THEME_COLORS, TRANSLATIONS, EXCHANGE_RATE_USD_TO_CNY, MARTIAN_QUOTES } from './constants';
import { Language, Currency, Expense, IncomeRecord } from './types';
import AssetList from './components/AssetList';
import AllocationCalculator from './components/AllocationCalculator';
import AIAssistant from './components/AIAssistant';
import ImageEditor from './components/ImageEditor';
import AssetTrendChart from './components/AssetTrendChart';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'tools' | 'assets' | 'studio'>('home');
  const [assets] = useState(INITIAL_ASSETS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const t = TRANSLATIONS[lang];

  // Daily Quote logic: pick based on date to keep it consistent for the day
  const dailyQuote = useMemo(() => {
    const day = new Date().getDate();
    return MARTIAN_QUOTES[day % MARTIAN_QUOTES.length];
  }, []);

  const totalBalanceUSD = useMemo(() => 
    assets.reduce((acc, asset) => acc + (asset.price * asset.amount), 0)
  , [assets]);

  const displayBalance = useMemo(() => {
    return currency === 'CNY' ? totalBalanceUSD * EXCHANGE_RATE_USD_TO_CNY : totalBalanceUSD;
  }, [totalBalanceUSD, currency]);

  const chartData = useMemo(() => 
    assets.map(asset => ({ name: asset.symbol, value: asset.price * asset.amount }))
  , [assets]);

  const COLORS = [
    THEME_COLORS.accent,
    THEME_COLORS.success,
    THEME_COLORS.secondary,
    THEME_COLORS.warning,
    '#64748b',
  ];

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const handleIncomeAdded = (income: IncomeRecord) => {
    setIncomeRecords(prev => [...prev, income]);
  };

  const currencySymbol = currency === 'USD' ? '$' : '¥';

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=2000&auto=format&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'grayscale(100%) contrast(150%) brightness(40%)',
        }}
      ></div>

      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0d0d0f]/60 to-[#0d0d0f]"></div>
      <div 
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      ></div>

      <header className="relative h-14 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
            <svg className="w-8 h-8 relative z-10 drop-shadow-[0_0_8px_rgba(0,98,255,0.8)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="dustGlow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="dustCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="60%" stopColor="#0062ff" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <g className="animate-spin-slow origin-center">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <line key={angle} x1="24" y1="24" x2={24 + 18 * Math.cos(angle * Math.PI / 180)} y2={24 + 18 * Math.sin(angle * Math.PI / 180)} stroke="#0062ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                ))}
              </g>
              <circle cx="24" cy="24" r="16" stroke="#0062ff" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.3" className="animate-spin" style={{ animationDuration: '10s' }} />
              <circle cx="24" cy="24" r="5" fill="url(#dustCore)" filter="url(#dustGlow)" className="animate-pulse" />
              <circle cx="24" cy="24" r="1.5" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 font-black tracking-[0.4em] uppercase leading-none">XALLET</span>
            <span className="text-[6px] text-[#0062ff] font-bold tracking-[0.3em] uppercase leading-none mt-1 opacity-90 animate-pulse">MARTIAN NEURAL LINK</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrency(currency === 'USD' ? 'CNY' : 'USD')}
            className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md hover:bg-white/5 transition-all bg-white/5 backdrop-blur-sm min-w-[36px]"
          >
            {currency}
          </button>
          <button 
            onClick={() => setLang(lang === 'en' ? 'cn' : 'en')}
            className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md hover:bg-white/5 transition-all bg-white/5 backdrop-blur-sm"
          >
            {lang === 'en' ? '中' : 'EN'}
          </button>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-all overflow-hidden group ml-1">
             <svg className="w-5 h-5 text-blue-500/80 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2C7 2 3 7 3 12c0 3 2 9 9 10 7-1 9-7 9-10 0-5-4-10-9-10zm-3 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
               <circle cx="9" cy="11" r="1" fill="#0d0d0f" />
               <circle cx="15" cy="11" r="1" fill="#0d0d0f" />
             </svg>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full relative z-10 pb-20 scroll-smooth">
        {activeTab === 'home' && (
          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Balance Card */}
            <div className="relative p-6 rounded-[2.5rem] bg-gradient-to-br from-[#1c1c1e] to-[#0d0d0f] border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
               <div className="absolute top-0 right-0 opacity-5 -mr-8 -mt-8 rotate-12">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V2a1 1 0 112 0v5a1 1 0 01-1 1h-6zM11 13a1 1 0 112 0v5a1 1 0 11-2 0v-5zM7 11a1 1 0 100-2H2V4a1 1 0 10-2 0v5a1 1 0 001 1h6zM14 17a1 1 0 100-2H9v-5a1 1 0 10-2 0v5a1 1 0 001 1h6z" clipRule="evenodd" /></svg>
               </div>
               <div className="text-[10px] text-blue-500/70 uppercase font-black tracking-[0.3em] mb-2">{t.totalBalance}</div>
               <div className="text-4xl font-black mono tracking-tighter drop-shadow-sm flex items-baseline gap-1">
                 <span className="text-xl text-white/30">{currencySymbol}</span>
                 {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </div>
               
               <div className="flex gap-4 mt-8">
                 <button className="flex-1 bg-gradient-to-b from-[#0062ff] to-[#004dc9] py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,98,255,0.3)] active:scale-95 transition-all">{t.connect}</button>
                 <button className="flex-1 bg-white/5 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-all backdrop-blur-md">{t.trade}</button>
               </div>
            </div>

            {/* Daily Martian Language Section */}
            <div className="p-6 rounded-[2.5rem] bg-[#1a1a1c]/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
               </div>
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#0062ff]"></div>
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t.dailyMartian}</span>
               </div>
               <p className="text-[15px] font-medium leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500 italic">
                 "{lang === 'cn' ? dailyQuote.cn : dailyQuote.en}"
               </p>
               <div className="mt-4 flex items-center justify-between">
                 <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-4 h-[1px] bg-white/10"></div>)}
                 </div>
                 <span className="text-[8px] text-gray-600 font-black tracking-widest uppercase">Transmitted via Neural Link</span>
               </div>
            </div>

            {/* Asset Donut Chart */}
            <div className="h-[220px] w-full flex items-center justify-center relative bg-white/[0.03] rounded-[2.5rem] border border-white/5 shadow-inner">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={6} dataKey="value" stroke="none">
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[8px] text-gray-500 font-black tracking-[0.4em] uppercase mb-1">{t.audit}</span>
                <span className="text-[13px] font-black text-[#0062ff] tracking-tight">2026.Q1</span>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5">
              <AssetList assets={assets.slice(0, 4)} currency={currency} />
            </div>
          </div>
        )}

        {activeTab === 'ai' && <AIAssistant lang={lang} currency={currency} />}

        {activeTab === 'tools' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold px-4">{t.tools}</h2>
            <div className="backdrop-blur-md bg-[#1c1c1e]/40 rounded-[2.5rem]">
              <AllocationCalculator lang={lang} currency={currency} expenses={expenses} incomeRecords={incomeRecords} />
            </div>
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#00df9a]/10 to-transparent border border-[#00df9a]/20 backdrop-blur-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#00df9a]/5 rounded-full blur-3xl -mr-12 -mt-12"></div>
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-2 h-2 rounded-full bg-[#00df9a] animate-pulse shadow-[0_0_8px_#00df9a]"></div>
                 <span className="text-[10px] font-black text-[#00df9a] uppercase tracking-[0.3em]">{t.silverInsight}</span>
               </div>
               <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                 {lang === 'cn' 
                  ? '白银目前处于十年周期的突破口。2026年全球订单将重组白银作为战略储备，建议当前配置比例维持在 15-20%。'
                  : 'Silver is currently at a 10-year breakout point. The 2026 global reorder prioritizes Ag as a reserve asset. Recommend 15-20% allocation.'}
               </p>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="p-4 space-y-6">
            <h2 className="text-xl font-bold px-4 mb-4">{t.assets}</h2>
            <AssetTrendChart totalBalance={displayBalance} lang={lang} currency={currency} />
            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5">
              <AssetList assets={assets} currency={currency} />
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="backdrop-blur-md bg-[#0d0d0f]/30 min-h-full">
            <ImageEditor lang={lang} onExpenseAdded={handleExpenseAdded} onIncomeAdded={handleIncomeAdded} />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0d0d0f]/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-2 z-50">
        {[
          { id: 'home', label: t.home, icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4c-4.4 0-8 3.6-8 8v7h16v-7c0-4.4-3.6-8-8-8z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 19v-2h10v2" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="11" r="1.5" fill="currentColor" className="animate-pulse" /></svg>) },
          { id: 'ai', label: 'AI', icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M2 12h20" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" /><circle cx="12" cy="12" r="8" strokeWidth="2.5" className="animate-spin-slow" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M12 12l4-4M12 12l-4 4" strokeWidth="2" strokeLinecap="round" /></svg>) },
          { id: 'studio', label: t.studio, icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="2.5" opacity="0.3" /><circle cx="12" cy="12" r="5" strokeWidth="2.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeWidth="2" strokeLinecap="round" /></svg>) },
          { id: 'tools', label: t.plan, icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 18l4-4 4 4 8-8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="18" r="2" fill="currentColor" /><circle cx="20" cy="10" r="2" fill="currentColor" /><path d="M12 4v4M12 12v2" strokeWidth="1.5" strokeDasharray="2 2" /></svg>) },
          { id: 'assets', label: t.wallet, icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.1" /></svg>) }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center justify-center w-20 transition-all duration-500 ${activeTab === tab.id ? 'text-[#0062ff]' : 'text-gray-500 hover:text-gray-300'}`}>
            <div className={`transition-transform duration-500 ${activeTab === tab.id ? 'scale-125 drop-shadow-[0_0_15px_rgba(0,98,255,0.4)]' : ''}`}>{tab.icon}</div>
            <span className={`text-[10px] mt-2 font-black tracking-tight transition-all uppercase ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
      <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default App;
