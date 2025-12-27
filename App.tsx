
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
      gender: 'male',
      personality: 'INTJ',
      tokens: 1000,
      subscription: SubscriptionType.FREE,
      ownedItemIds: [],
      equippedItemIds: [],
      rank: Math.floor(Math.random() * 500) + 101,
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
      tokens: prev.tokens + 19000 // $19 * 1000 MC
    }));
    setShowPricing(false);
    alert(lang === 'cn' ? '恭喜！您已升级至 Elite Pro 精英版。19,000 火星点券已到账。' : 'Congratulations! Upgraded to Elite Pro. 19,000 Martian Credits credited.');
  };

  const currencySymbol = currency === 'USD' ? '$' : '¥';

  const navItems = [
    { id: 'home', label: t.home, icon: '🏠', color: '#fff' },
    { id: 'ai', label: 'AI', icon: '🤖', color: '#0062ff' },
    { id: 'studio', label: t.studio, icon: '📸', color: '#a855f7' },
    { id: 'tools', label: t.plan, icon: '📈', color: '#00df9a' },
    { id: 'assets', label: t.wallet, icon: '💰', color: '#f3ba2f' }
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=2000&auto=format&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
          filter: 'grayscale(100%) contrast(150%) brightness(40%)',
        }}
      ></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#08080a]/60 to-[#08080a]"></div>

      <header className="relative h-14 bg-[#08080a]/80 backdrop-blur-xl border-b border-white/5 z-[60] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse"></div>
            <svg className="w-7 h-7 relative z-10 drop-shadow-[0_0_8px_rgba(0,98,255,0.6)]" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="8" stroke="#0062ff" strokeWidth="0.5" strokeDasharray="2 2" />
               <circle cx="12" cy="12" r="3" fill="#0062ff" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 font-black tracking-[0.4em] uppercase leading-none">XALLET</span>
            <div className="flex items-center gap-1.5 mt-1">
               <span className="text-[6px] text-[#0062ff] font-bold tracking-[0.3em] uppercase leading-none opacity-90 animate-pulse">NEURAL LINK ACTIVE</span>
               {userStats.subscription === SubscriptionType.PREMIUM && (
                 <span className="px-1 py-0.5 bg-blue-500 text-white text-[5px] font-black rounded uppercase">Elite</span>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button onClick={() => setCurrency(currency === 'USD' ? 'CNY' : 'USD')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm min-w-[36px]">{currency}</button>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm">{lang === 'en' ? '中' : 'EN'}</button>
          <button onClick={() => setShowProfileSetup(true)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-all overflow-hidden">
             <svg className="w-5 h-5 text-blue-500/80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </button>
        </div>
      </header>

      {showProfileSetup && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-[4rem] p-10 space-y-10 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Neural Profile</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Initialize Your Connection</p>
            </div>
            <div className="space-y-5">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.companion.genderPrompt}</label>
              <div className="flex gap-4">
                {(['male', 'female'] as const).map(g => (
                  <button key={g} onClick={() => setUserStats({...userStats, gender: g})} className={`flex-1 py-4 rounded-[1.5rem] border text-xs font-black uppercase tracking-widest transition-all ${userStats.gender === g ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-gray-500'}`}>{g === 'male' ? t.companion.male : t.companion.female}</button>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <label className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.companion.mbtiPrompt}</label>
              <select value={userStats.personality} onChange={(e) => setUserStats({...userStats, personality: e.target.value as MBTI})} className="w-full bg-[#08080a] border border-white/10 rounded-[1.5rem] p-4.5 text-sm font-black text-white outline-none focus:border-blue-500 appearance-none shadow-inner">
                {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowProfileSetup(false)} className="w-full bg-blue-600 py-5 rounded-[1.75rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all text-white">Sync Neural Link</button>
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

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full relative z-10 pb-10 scroll-smooth">
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
               <button onClick={() => setShowPricing(true)} className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                 Plan: {userStats.subscription === SubscriptionType.PREMIUM ? 'Elite Pro' : 'Free Tier'}
               </button>
            </div>

            {/* Goddess Hub */}
            <MartianCompanion stats={userStats} lang={lang} onUpdateStats={setUserStats} />

            {/* Daily Quote HUD */}
            <div className="p-6 rounded-[2.5rem] bg-[#121214]/30 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#0062ff]"></div>
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.dailyMartian}</span>
               </div>
               <p className="text-[15px] font-medium italic leading-relaxed text-gray-200">"{lang === 'cn' ? dailyQuote.cn : dailyQuote.en}"</p>
            </div>

            {/* Performance Telemetry */}
            <AssetTrendChart totalBalance={displayBalance} lang={lang} currency={currency} />

            {/* Fast Asset Overview */}
            <div className="bg-white/[0.02] backdrop-blur-2xl p-7 rounded-[3rem] border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Assets</span>
                <button onClick={() => setActiveTab('assets')} className="text-[9px] font-black text-blue-500 uppercase tracking-widest">View All</button>
              </div>
              <AssetList assets={assets.slice(0, 4)} currency={currency} />
            </div>
          </div>
        )}
        
        {activeTab === 'ai' && <AIAssistant lang={lang} currency={currency} />}
        {activeTab === 'tools' && <div className="p-4 animate-in fade-in duration-500"><AllocationCalculator lang={lang} currency={currency} expenses={expenses} incomeRecords={incomeRecords} onPlanConfirmed={handlePlanConfirmed} /></div>}
        {activeTab === 'assets' && <div className="p-4 space-y-6 animate-in fade-in duration-500"><div className="px-2 pt-4"><h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Asset Repository</h2><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Portfolio Registry</p></div><AssetList assets={assets} currency={currency} /></div>}
        {activeTab === 'studio' && <ImageEditor lang={lang} onExpenseAdded={handleExpenseAdded} onIncomeAdded={handleIncomeAdded} />}
      </main>

      {/* NEW Neural Command Hub - Floating UI */}
      <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="relative flex items-center justify-center pointer-events-auto">
          {/* Radial Navigation Menu */}
          {isNavOpen && (
            <div className="absolute bottom-16 w-64 h-64 animate-in zoom-in-50 fade-in duration-300 pointer-events-none">
              <div className="relative w-full h-full">
                {navItems.map((item, idx) => {
                  const angle = (idx * (360 / navItems.length)) - 90;
                  const radius = 90;
                  const x = Math.cos(angle * (Math.PI / 180)) * radius;
                  const y = Math.sin(angle * (Math.PI / 180)) * radius;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setIsNavOpen(false); }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-full flex flex-col items-center justify-center pointer-events-auto shadow-2xl transition-all hover:scale-110 active:scale-90 hover:border-blue-500/50 group"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-white">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Hub Trigger */}
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`w-18 h-18 rounded-full bg-gradient-to-b from-[#1a1a1c] to-[#08080a] border border-white/10 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 active:scale-95 group relative ${isNavOpen ? 'rotate-45' : ''}`}
          >
            <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-xl transition-opacity duration-500 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}></div>
            {/* Inner Core */}
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isNavOpen ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/[0.02]'}`}>
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isNavOpen ? 'bg-blue-400 animate-ping' : 'bg-white/20'}`}></div>
            </div>
            {/* Visual Indicator of current tab icon when closed */}
            {!isNavOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">{navItems.find(n => n.id === activeTab)?.icon}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop for Hub */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <style>{`
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default App;
