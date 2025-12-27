
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
  
  // Martian Stats State
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('xallet_user_stats');
    const today = new Date().toISOString().split('T')[0];
    const baseStats = saved ? JSON.parse(saved) : {
      gender: 'female',
      personality: 'INTJ',
      tokens: 200,
      subscription: SubscriptionType.FREE, 
      ownedItemIds: ['h1'],
      equippedItemIds: ['h1'],
      rank: 582,
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
    // Success notification and jump back to dashboard to see results
    setActiveTab('home');
    alert(lang === 'cn' ? '每日攒钱计划已同步！火星同伴已记录您的理财姿态。' : 'Daily saving plan synced! Your companion noted your discipline.');
  };

  const handleUpgrade = () => {
    setUserStats(prev => ({
      ...prev,
      subscription: SubscriptionType.PREMIUM,
      tokens: prev.tokens + 19000 
    }));
  };

  const currencySymbol = currency === 'USD' ? '$' : '¥';

  const navItems = [
    { 
      id: 'home', 
      label: t.home, 
      icon: (active: boolean) => (
        <svg className={`w-8 h-8 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    { 
      id: 'ai', 
      label: 'AI', 
      icon: (active: boolean) => (
        <svg className={`w-8 h-8 ${active ? 'text-blue-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L4.5 9L4.5 15L12 22L19.5 15L19.5 9L12 2Z" strokeOpacity="0.3" />
          <circle cx="12" cy="11" r="1" fill="currentColor" />
        </svg>
      )
    },
    { 
      id: 'studio', 
      label: t.studio, 
      icon: (active: boolean) => (
        <svg className={`w-8 h-8 ${active ? 'text-purple-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="12" rx="2" strokeOpacity="0.3" />
          <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
        </svg>
      )
    },
    { 
      id: 'tools', 
      label: t.plan, 
      icon: (active: boolean) => (
        <svg className={`w-8 h-8 ${active ? 'text-green-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 20l4-6l3 3l6-10" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      id: 'assets', 
      label: t.wallet, 
      icon: (active: boolean) => (
        <svg className={`w-8 h-8 ${active ? 'text-yellow-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      {/* Immersive Sci-Fi Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 breathing-grid-sci-fi"></div>
        <div className="absolute inset-0 macro-grid-sci-fi opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,180,216,0.15)_0%,transparent_70%)] animate-pulse-slow"></div>
        <div className="absolute inset-0 scanline-sci-fi opacity-[0.03]"></div>
        <div className="absolute inset-0 particle-noise-sci-fi opacity-20"></div>
      </div>

      <header className="relative h-14 bg-[#08080a]/40 backdrop-blur-3xl border-b border-white/5 z-[60] flex items-center justify-between px-4 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_rgba(0,98,255,0.6)]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" opacity="0.1" />
              <path d="M12 2L2 12l10 10 10-10L12 2zm0 4l6 6-6 6-6-6 6-6z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white font-black tracking-[0.3em] uppercase leading-none">XALLET</span>
            <span className="text-[6px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">NEURAL OS v2.6</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button onClick={() => setCurrency(currency === 'USD' ? 'CNY' : 'USD')} className="text-[10px] font-black border border-white/10 px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors uppercase">
            {currency}
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="text-[10px] font-black border border-white/10 px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            {lang === 'en' ? 'CN' : 'EN'}
          </button>
          
          {/* Enhanced Martian Profile Button */}
          <button 
            onClick={() => setShowProfileSetup(true)} 
            className="w-9 h-9 rounded-full bg-black/40 border border-blue-500/40 flex items-center justify-center transition-all hover:border-blue-400 hover:shadow-[0_0_15px_rgba(0,98,255,0.4)] active:scale-90 relative overflow-hidden group shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg 
              className="w-[18px] h-[18px] text-blue-500 drop-shadow-[0_0_5px_rgba(0,98,255,0.6)]" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-pulse pointer-events-none"></div>
          </button>
        </div>
      </header>

      {showProfileSetup && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#0c0c0e]/95 border border-cyan-500/30 rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 duration-500 relative z-10 shadow-[0_0_100px_rgba(0,180,216,0.15)]">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-white">XALLET</h2>
              <p className="text-[9px] text-cyan-400/70 font-black uppercase tracking-[0.4em]">Initialize Neural Profile</p>
            </div>
            <div className="space-y-4">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.companion.genderPrompt}</label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map(g => (
                  <button key={g} onClick={() => setUserStats({...userStats, gender: g})} className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${userStats.gender === g ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,180,216,0.3)]' : 'bg-white/5 border-white/5 text-gray-600'}`}>
                    {g === 'male' ? t.companion.male : t.companion.female}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.companion.mbtiPrompt}</label>
              <select value={userStats.personality} onChange={(e) => setUserStats({...userStats, personality: e.target.value as MBTI})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-cyan-500/50 transition-all">
                {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(p => (
                  <option key={p} value={p} className="bg-[#0c0c0e]">{p}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowProfileSetup(false)} className="w-full bg-cyan-600 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_10px_40px_rgba(0,180,216,0.4)] text-white mt-4 active:scale-95 transition-all hover:bg-cyan-500">Sync Neural Core</button>
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

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full relative z-10 pb-24 px-4 sm:px-0">
        {activeTab === 'home' && (
          <div className="py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Balance Card */}
            <div className="relative p-7 rounded-[2.5rem] bg-[#121214]/60 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
               </div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <div className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mb-1">{t.totalBalance}</div>
                   <div className="text-3xl font-black mono tracking-tighter flex items-baseline gap-1">
                     <span className="text-lg text-white/30">{currencySymbol}</span>
                     {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </div>
                 </div>
                 {userStats.subscription !== SubscriptionType.PREMIUM && (
                   <button 
                    onClick={() => setShowPricing(true)}
                    className="px-6 py-2.5 bg-[#0062ff] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-[0_10px_25px_rgba(0,98,255,0.5)] hover:shadow-[0_0_30px_rgba(0,98,255,0.7)] active:scale-95 transition-all flex items-center gap-2 relative overflow-hidden group/upgrade"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/upgrade:translate-x-full transition-transform duration-700"></div>
                     <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                     {lang === 'cn' ? '升级至精英版' : 'UPGRADE TO PRO'}
                   </button>
                 )}
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Neural Link: Encrypted Sync Active</span>
               </div>
            </div>

            {/* Silver Market Widget */}
            <div 
              onClick={() => setActiveTab('ai')}
              className="relative p-6 rounded-[2.25rem] bg-[#0c0c0e]/80 border border-white/10 overflow-hidden group cursor-pointer active:scale-[0.98] transition-all backdrop-blur-2xl"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                     <span className="text-xl font-black text-white">Ag</span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{lang === 'cn' ? '白银投资洞察' : 'SILVER MARKET INSIGHT'}</h4>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{lang === 'cn' ? '近期涨势强劲 · 实时分析' : 'RECENT SURGE · REAL-TIME'}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-green-400 font-black mono">+5.67%</span>
                    <div className="h-1 w-12 bg-white/10 rounded-full mt-1 overflow-hidden">
                       <div className="h-full bg-green-400 w-3/4"></div>
                    </div>
                 </div>
               </div>
               <p className="text-[12px] text-gray-400 font-medium leading-relaxed italic">
                 {lang === 'cn' ? '“白银不仅是避险资产，更是2026年全球秩序重组的核心流动性。点击询问如何合理布局。”' : '"Silver is not just a hedge, it\'s the core liquidity for the 2026 reorder. Click to ask for allocation strategy."'}
               </p>
            </div>

            <MartianCompanion stats={userStats} lang={lang} onUpdateStats={setUserStats} />

            <div 
              onClick={() => setActiveTab('ai')}
              className="relative p-6 rounded-[2.25rem] bg-[#121214]/80 border border-blue-500/20 overflow-hidden shadow-xl group backdrop-blur-2xl cursor-pointer active:scale-[0.98] transition-all"
            >
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t.aiInsights.title}</h4>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
               </div>
               <div className="space-y-3">
                 <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                   <p className="text-[11px] text-blue-100 font-bold leading-relaxed">{t.aiInsights.silverAlert}</p>
                 </div>
                 <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                   <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{t.aiInsights.marketShift}</p>
                 </div>
               </div>
            </div>

            <AssetTrendChart totalBalance={displayBalance} lang={lang} currency={currency} />

            <div className="p-6 rounded-[2.25rem] bg-[#121214]/60 border border-white/5 backdrop-blur-xl relative overflow-hidden">
               <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 block">{t.dailyMartian}</span>
               <p className="text-[14px] font-medium italic leading-relaxed text-gray-200">"{lang === 'cn' ? dailyQuote.cn : dailyQuote.en}"</p>
            </div>
          </div>
        )}
        
        {activeTab === 'ai' && <AIAssistant lang={lang} currency={currency} />}
        {activeTab === 'tools' && <div className="py-4 animate-in fade-in duration-500"><AllocationCalculator lang={lang} currency={currency} expenses={expenses} incomeRecords={incomeRecords} onPlanConfirmed={handlePlanConfirmed} /></div>}
        {activeTab === 'assets' && (
          <div className="py-4 space-y-4 animate-in fade-in duration-500">
            <h2 className="text-xl font-black uppercase tracking-widest pl-2">{t.portfolio}</h2>
            <AssetList assets={assets} currency={currency} lang={lang} />
          </div>
        )}
        {activeTab === 'studio' && <ImageEditor lang={lang} onExpenseAdded={handleExpenseAdded} onIncomeAdded={handleIncomeAdded} />}
      </main>

      {/* Navigation Ring */}
      <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="relative flex items-center justify-center pointer-events-auto">
          {isNavOpen && (
            <div className="absolute bottom-20 w-80 h-80 animate-in zoom-in-50 duration-300 pointer-events-none">
              <div className="relative w-full h-full">
                {navItems.map((item, idx) => {
                  const angle = (idx * (360 / navItems.length)) - 90;
                  const radius = 120; // Increased radius for larger buttons
                  const x = Math.cos(angle * (Math.PI / 180)) * radius;
                  const y = Math.sin(angle * (Math.PI / 180)) * radius;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setIsNavOpen(false); }}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#121214] border rounded-full flex flex-col items-center justify-center pointer-events-auto shadow-2xl transition-all active:scale-90 ${isActive ? 'border-blue-500 shadow-[0_0_25px_rgba(0,98,255,0.5)] bg-blue-500/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      {item.icon(isActive)}
                      <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`w-20 h-20 rounded-full bg-gradient-to-b from-[#1a1a1c] to-[#08080a] border border-white/15 flex items-center justify-center shadow-[0_15px_45px_rgba(0,0,0,0.8)] transition-all duration-300 active:scale-95 group relative ${isNavOpen ? 'rotate-45' : ''}`}
          >
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
              <div className={`w-3 h-3 rounded-full transition-all ${isNavOpen ? 'bg-blue-400 animate-ping' : 'bg-blue-600 shadow-[0_0_15px_#0062ff]'}`}></div>
            </div>
            {!isNavOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                {navItems.find(n => n.id === activeTab)?.icon(true)}
              </div>
            )}
          </button>
        </div>
      </div>

      {isNavOpen && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-xl animate-in fade-in" onClick={() => setIsNavOpen(false)} />
      )}

      <style>{`
        .breathing-grid-sci-fi {
          position: absolute;
          inset: -30%;
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right, rgba(0, 180, 216, 0.12) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(0, 180, 216, 0.12) 1.5px, transparent 1.5px);
          transform: perspective(1200px) rotateX(30deg) translateY(-10%);
          animation: sci-fi-grid-breath 12s ease-in-out infinite;
          transform-origin: center center;
        }

        .macro-grid-sci-fi {
          position: absolute;
          inset: 0;
          background-size: 240px 240px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }

        .scanline-sci-fi {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 255, 0.1) 50%,
            transparent 51%
          );
          background-size: 100% 20px;
          animation: sci-fi-scanline 10s linear infinite;
          pointer-events: none;
        }

        .particle-noise-sci-fi {
          background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
          filter: contrast(150%) brightness(120%);
          mix-blend-mode: soft-light;
        }

        @keyframes sci-fi-grid-breath {
          0%, 100% { opacity: 0.2; transform: perspective(1200px) rotateX(30deg) translateY(-10%) scale(1); }
          50% { opacity: 0.5; transform: perspective(1200px) rotateX(35deg) translateY(-12%) scale(1.1); }
        }

        @keyframes sci-fi-scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        main, header, footer {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default App;
