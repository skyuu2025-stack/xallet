
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_ASSETS, TRANSLATIONS, EXCHANGE_RATE_USD_TO_CNY, MARTIAN_QUOTES } from './constants';
import { Language, Currency, Expense, IncomeRecord, UserStats, MBTI, SubscriptionType } from './types';
import AssetList from './components/AssetList';
import AllocationCalculator from './components/AllocationCalculator';
import AIAssistant from './components/AIAssistant';
import ImageEditor from './components/ImageEditor';
import AssetTrendChart from './components/AssetTrendChart';
import MartianCompanion from './components/MartianCompanion';
import PricingModal from './components/PricingModal';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'tools' | 'assets' | 'studio'>('home');
  const [assets] = useState(INITIAL_ASSETS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // Martian Stats State - Default to Elite Pro
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('xallet_user_stats');
    const today = new Date().toISOString().split('T')[0];
    const baseStats = saved ? JSON.parse(saved) : {
      gender: 'female',
      personality: 'INTJ',
      tokens: 19000,
      subscription: SubscriptionType.PREMIUM, // ACTIVATED ALL FEATURES
      ownedItemIds: ['h1', 'b2'],
      equippedItemIds: ['h1', 'b2'],
      rank: 42,
      dailyEarned: false,
      dailySaved: false,
      lastActionDate: today
    };

    if (baseStats.lastActionDate !== today) {
      baseStats.dailyEarned = false;
      baseStats.dailySaved = false;
      baseStats.lastActionDate = today;
    }
    return baseStats;
  });

  const [showProfileSetup, setShowProfileSetup] = useState(!localStorage.getItem('xallet_user_stats'));

  useEffect(() => {
    localStorage.setItem('xallet_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  const t = TRANSLATIONS[lang];
  const dailyQuote = useMemo(() => MARTIAN_QUOTES[new Date().getDate() % MARTIAN_QUOTES.length], []);
  const totalBalanceUSD = useMemo(() => assets.reduce((acc, asset) => acc + (asset.price * asset.amount), 0), [assets]);
  const displayBalance = useMemo(() => currency === 'CNY' ? totalBalanceUSD * EXCHANGE_RATE_USD_TO_CNY : totalBalanceUSD, [totalBalanceUSD, currency]);

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    setUserStats(prev => ({ ...prev, tokens: prev.tokens + 5 }));
  };

  const handleIncomeAdded = (income: IncomeRecord) => {
    setIncomeRecords(prev => [...prev, income]);
    const reward = Math.floor(income.amount * 0.15);
    setUserStats(prev => ({ 
      ...prev, 
      tokens: prev.tokens + reward,
      dailyEarned: true,
      rank: Math.max(1, (prev.rank || 500) - Math.floor(reward / 100))
    }));
  };

  const handlePlanConfirmed = () => {
    setUserStats(prev => ({ ...prev, dailySaved: true }));
    alert(lang === 'cn' ? '每日攒钱计划已同步！火星同伴已记录您的理财姿态。' : 'Daily saving plan synced! Your companion noted your discipline.');
  };

  const handleUpgrade = () => {
    setUserStats(prev => ({
      ...prev,
      subscription: SubscriptionType.PREMIUM,
      tokens: prev.tokens + 19000 
    }));
    setShowPricing(false);
  };

  const currencySymbol = currency === 'USD' ? '$' : '¥';

  // Martianized Icon Definitions
  const navItems = [
    { 
      id: 'home', 
      label: t.home, 
      color: '#fff',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
          <circle cx="12" cy="12" r="5" strokeWidth="2" strokeDasharray="2 2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    { 
      id: 'ai', 
      label: 'AI', 
      color: '#0062ff',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L4.5 9L4.5 15L12 22L19.5 15L19.5 9L12 2Z" strokeOpacity="0.3" />
          <path d="M12 7L8 11L12 15L16 11L12 7Z" fill={active ? 'currentColor' : 'none'} fillOpacity="0.2" />
          <circle cx="12" cy="11" r="1" fill="currentColor" />
          <path d="M12 15v3" />
        </svg>
      )
    },
    { 
      id: 'studio', 
      label: t.studio, 
      color: '#a855f7',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-purple-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="12" rx="2" strokeOpacity="0.3" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
          <path d="M12 10v4M10 12h4" strokeOpacity="0.6" />
          <path d="M7 6l1-2h8l1 2" strokeOpacity="0.3" />
        </svg>
      )
    },
    { 
      id: 'tools', 
      label: t.plan, 
      color: '#00df9a',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-green-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 20l4-6l3 3l6-10" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M3 21h18" strokeOpacity="0.2" />
          <circle cx="17" cy="7" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    { 
      id: 'assets', 
      label: t.wallet, 
      color: '#f3ba2f',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-yellow-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16v16H4z" strokeOpacity="0.3" />
          <path d="M4 10h16M10 4v16" strokeOpacity="0.2" />
          <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      {/* GLOBAL SCI-FI BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Breathing Neural Grid */}
        <div className="absolute inset-0 breathing-grid opacity-30"></div>
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 scanline-overlay opacity-10"></div>
        
        {/* Dynamic Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,180,216,0.05)_0%,transparent_80%)]"></div>
        
        {/* Darkened Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-transparent to-[#08080a]"></div>
      </div>

      <header className="relative h-14 bg-[#08080a]/60 backdrop-blur-2xl border-b border-white/5 z-[60] flex items-center justify-between px-4 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse"></div>
            <svg className="w-7 h-7 relative z-10 drop-shadow-[0_0_12px_rgba(0,98,255,0.8)]" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="8" stroke="#0062ff" strokeWidth="1" strokeDasharray="2 2" />
               <circle cx="12" cy="12" r="4" fill="#0062ff" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-white font-black tracking-[0.4em] uppercase leading-none">XALLET</span>
            <div className="flex items-center gap-1.5 mt-1">
               <span className="text-[6px] text-blue-400 font-black tracking-[0.3em] uppercase leading-none opacity-90">NEURAL LINK: OPTIMIZED</span>
               {userStats.subscription === SubscriptionType.PREMIUM && (
                 <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[5px] font-black rounded-[2px] uppercase tracking-widest shadow-[0_0_10px_rgba(0,98,255,0.4)]">Elite</span>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">LIVE ADVISORY ACTIVE</span>
          </div>
          <button onClick={() => setCurrency(currency === 'USD' ? 'CNY' : 'USD')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm min-w-[36px]">{currency}</button>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm">{lang === 'en' ? '中' : 'EN'}</button>
          <button onClick={() => setShowProfileSetup(true)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-all overflow-hidden relative group">
             <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <svg className="w-5 h-5 text-blue-500/80 relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </button>
        </div>
      </header>

      {showProfileSetup && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#0c0c0e]/95 border border-cyan-500/30 rounded-[3.5rem] p-10 space-y-10 shadow-[0_0_120px_rgba(0,180,216,0.25)] animate-in zoom-in-95 duration-500 relative z-10 backdrop-blur-2xl">
            {/* Sci-fi Corner Elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-[2rem]"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-[2rem]"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-[2rem]"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50 rounded-br-[2rem]"></div>

            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_30px_rgba(0,255,255,0.6)]">XALLET</h2>
              <p className="text-[10px] text-cyan-400/70 font-black uppercase tracking-[0.6em] animate-pulse">Initialize Neural Core</p>
            </div>

            <div className="space-y-6">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.5em] pl-2">{t.companion.genderPrompt}</label>
              <div className="flex gap-4">
                {(['male', 'female'] as const).map(g => (
                  <button 
                    key={g} 
                    onClick={() => setUserStats({...userStats, gender: g})} 
                    className={`flex-1 py-4.5 rounded-[1.75rem] border text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden group/btn ${userStats.gender === g ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_40px_rgba(0,255,255,0.3)] scale-[1.02]' : 'bg-[#121214]/60 border-white/5 text-gray-600 hover:border-cyan-500/30'}`}
                  >
                    {userStats.gender === g && (
                      <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>
                    )}
                    <span className="relative z-10">{g === 'male' ? t.companion.male : t.companion.female}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.5em] pl-2">{t.companion.mbtiPrompt}</label>
              <div className="relative group">
                <select 
                  value={userStats.personality} 
                  onChange={(e) => setUserStats({...userStats, personality: e.target.value as MBTI})} 
                  className="w-full bg-[#08080a]/90 border border-white/10 rounded-[1.75rem] p-5 text-xs font-black text-white outline-none focus:border-cyan-500/60 appearance-none shadow-2xl transition-all group-hover:border-white/20"
                >
                  {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(p => (
                    <option key={p} value={p} className="bg-[#0c0c0e]">{p}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400/50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => setShowProfileSetup(false)} 
                className="w-full relative group/sync active:scale-[0.96] transition-transform"
              >
                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-30 group-hover/sync:opacity-60 transition-opacity rounded-full"></div>
                <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 py-6.5 rounded-[2.25rem] text-[14px] font-black uppercase tracking-[0.6em] shadow-[0_20px_50px_rgba(0,180,216,0.5)] text-white border border-white/10 flex items-center justify-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
                  Sync Connection
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPricing && (
        <PricingModal 
          lang={lang} 
          currentPlan={userStats.subscription} 
          onClose={() => setShowPricing(false)} 
          onUpgrade={handleUpgrade}
        />
      )}

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full relative z-10 pb-24 scroll-smooth">
        {activeTab === 'home' && (
          <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Balance Card */}
            <div className="relative p-8 rounded-[3rem] bg-[#121214]/60 border border-white/5 overflow-hidden shadow-2xl backdrop-blur-2xl group active:scale-[0.98] transition-transform">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                 <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12V7H5a2 2 0 010-4h14v4" strokeWidth="0.5"/><path d="M3 5v14a2 2 0 002 2h16v-5" strokeWidth="0.5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z" strokeWidth="0.5"/></svg>
               </div>
               <div className="text-[10px] text-blue-500/80 uppercase font-black tracking-[0.4em] mb-2">{t.totalBalance}</div>
               <div className="text-4xl font-black mono tracking-tighter flex items-baseline gap-1 relative z-10 group-hover:translate-x-1 transition-transform">
                 <span className="text-xl text-white/30">{currencySymbol}</span>
                 {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </div>
               <div className="flex items-center gap-2 mt-4">
                 <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[7px] font-black text-blue-400 uppercase tracking-widest">Plan: {userStats.subscription === SubscriptionType.PREMIUM ? 'Elite Pro' : 'Activated'}</span>
                 <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Neural Assets Synchronized</span>
               </div>
            </div>

            {/* Goddess Hub */}
            <MartianCompanion stats={userStats} lang={lang} onUpdateStats={setUserStats} />

            {/* AI Constructive Insights Widget */}
            <div className="relative p-7 rounded-[3rem] bg-gradient-to-br from-[#121214] to-[#0a0a0c] border border-blue-500/20 overflow-hidden shadow-2xl backdrop-blur-3xl group">
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full"></div>
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(0,98,255,0.1)]">
                     <svg className="w-5 h-5 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                   </div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">{t.aiInsights.title}</h4>
                 </div>
                 <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[7px] text-blue-400 font-black tracking-widest uppercase animate-pulse">Neural Pulse Active</div>
               </div>

               <div className="space-y-4 relative z-10">
                 <div className="p-4 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                   <div className="flex gap-3 items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0 shadow-[0_0_8px_#60a5fa]"></div>
                     <p className="text-[12px] text-blue-100 font-bold leading-relaxed">{t.aiInsights.silverAlert}</p>
                   </div>
                 </div>
                 <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 opacity-80">
                   <div className="flex gap-3 items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
                     <p className="text-[12px] text-gray-400 font-medium leading-relaxed">{t.aiInsights.marketShift}</p>
                   </div>
                 </div>
               </div>

               <button 
                onClick={() => setActiveTab('ai')}
                className="mt-6 w-full py-4 rounded-[1.5rem] bg-blue-600/20 border border-blue-500/40 text-[9px] font-black uppercase tracking-[0.4em] text-blue-400 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-blue-500/5"
               >
                 {t.aiInsights.viewMore}
               </button>
            </div>

            {/* Performance Telemetry */}
            <AssetTrendChart totalBalance={displayBalance} lang={lang} currency={currency} />

            {/* Daily Quote HUD */}
            <div className="p-6 rounded-[2.5rem] bg-[#121214]/30 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#0062ff]"></div>
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.dailyMartian}</span>
               </div>
               <p className="text-[15px] font-medium italic leading-relaxed text-gray-200">"{lang === 'cn' ? dailyQuote.cn : dailyQuote.en}"</p>
            </div>
          </div>
        )}
        
        {activeTab === 'ai' && <AIAssistant lang={lang} currency={currency} />}
        {activeTab === 'tools' && <div className="p-4 animate-in fade-in duration-500"><AllocationCalculator lang={lang} currency={currency} expenses={expenses} incomeRecords={incomeRecords} onPlanConfirmed={handlePlanConfirmed} /></div>}
        {activeTab === 'assets' && (
          <div className="p-4 space-y-6 animate-in fade-in duration-500">
            <div className="px-2 pt-4 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Asset Repository</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Portfolio Registry</p>
              </div>
              <div className="text-[8px] font-black text-blue-400 uppercase border border-blue-400/20 px-2 py-1 rounded-full">Secure Cold-Sync</div>
            </div>
            <AssetList assets={assets} currency={currency} />
          </div>
        )}
        {activeTab === 'studio' && <ImageEditor lang={lang} onExpenseAdded={handleExpenseAdded} onIncomeAdded={handleIncomeAdded} />}
      </main>

      {/* Neural Command Hub (Navigation Menu) */}
      <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="relative flex items-center justify-center pointer-events-auto">
          {isNavOpen && (
            <div className="absolute bottom-16 w-64 h-64 animate-in zoom-in-50 fade-in duration-300 pointer-events-none">
              <div className="relative w-full h-full">
                {navItems.map((item, idx) => {
                  const angle = (idx * (360 / navItems.length)) - 90;
                  const radius = 95;
                  const x = Math.cos(angle * (Math.PI / 180)) * radius;
                  const y = Math.sin(angle * (Math.PI / 180)) * radius;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setIsNavOpen(false); }}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#121214]/95 backdrop-blur-3xl border rounded-full flex flex-col items-center justify-center pointer-events-auto shadow-2xl transition-all hover:scale-110 active:scale-90 group ${isActive ? 'border-blue-500 shadow-[0_0_20px_rgba(0,98,255,0.2)]' : 'border-white/10 hover:border-white/30'}`}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <div className="mb-1 transition-transform group-hover:scale-110">
                        {item.icon(isActive)}
                      </div>
                      <span className={`text-[7px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`w-20 h-20 rounded-full bg-gradient-to-b from-[#1a1a1c] to-[#08080a] border border-white/15 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,1)] transition-all duration-500 active:scale-95 group relative ${isNavOpen ? 'rotate-45 scale-90' : ''}`}
          >
            <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-2xl transition-opacity duration-500 ${isNavOpen ? 'opacity-100' : 'opacity-40'}`}></div>
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isNavOpen ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_20px_rgba(0,98,255,0.4)]' : 'border-white/10 bg-white/[0.03]'}`}>
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isNavOpen ? 'bg-blue-400 animate-ping' : 'bg-blue-500/60 shadow-[0_0_10px_#0062ff]'}`}></div>
            </div>
            {!isNavOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-lg drop-shadow-lg">
                  {navItems.find(n => n.id === activeTab)?.icon(true)}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {isNavOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsNavOpen(false)} />
      )}

      <style>{`
        .w-20 { width: 5rem; }
        .h-20 { height: 5rem; }
        
        .breathing-grid {
          position: absolute;
          inset: 0;
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
          animation: global-grid-pulse 8s ease-in-out infinite;
        }

        .scanline-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 255, 0.04) 50%,
            transparent 51%
          );
          background-size: 100% 8px;
          animation: global-scanline 6s linear infinite;
        }

        @keyframes global-grid-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1) translateY(0); }
          50% { opacity: 0.45; transform: scale(1.05) translateY(-5px); }
        }

        @keyframes global-scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
