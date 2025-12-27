
import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { INITIAL_ASSETS, THEME_COLORS, TRANSLATIONS, EXCHANGE_RATE_USD_TO_CNY, MARTIAN_QUOTES } from './constants';
import { Language, Currency, Expense, IncomeRecord, UserStats, MBTI, UserGender } from './types';
import AssetList from './components/AssetList';
import AllocationCalculator from './components/AllocationCalculator';
import AIAssistant from './components/AIAssistant';
import ImageEditor from './components/ImageEditor';
import AssetTrendChart from './components/AssetTrendChart';
import MartianCompanion from './components/MartianCompanion';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'tools' | 'assets' | 'studio'>('home');
  const [assets] = useState(INITIAL_ASSETS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  
  // Martian Stats State
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('xallet_user_stats');
    return saved ? JSON.parse(saved) : {
      gender: 'male',
      personality: 'INTJ',
      tokens: 1000, // Initial boost
      ownedItemIds: [],
      equippedItemIds: [],
      rank: Math.floor(Math.random() * 500) + 101 // Random initial rank
    };
  });

  const [showProfileSetup, setShowProfileSetup] = useState(!localStorage.getItem('xallet_user_stats'));

  useEffect(() => {
    localStorage.setItem('xallet_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  const t = TRANSLATIONS[lang];

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

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    // Spending credits? No, but maybe scanning a receipt earns a few tokens (Neural OCR bonus)
    setUserStats(prev => ({ ...prev, tokens: prev.tokens + 5 }));
  };

  const handleIncomeAdded = (income: IncomeRecord) => {
    setIncomeRecords(prev => [...prev, income]);
    // Reward tokens for income added: 15% of amount as tokens
    const reward = Math.floor(income.amount * 0.15);
    setUserStats(prev => ({ 
      ...prev, 
      tokens: prev.tokens + reward,
      // Ranking goes up (number decreases) as tokens increase
      rank: Math.max(1, (prev.rank || 500) - Math.floor(reward / 100))
    }));
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

      <header className="relative h-14 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
            <svg className="w-8 h-8 relative z-10 drop-shadow-[0_0_8px_rgba(0,98,255,0.8)]" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="8" stroke="#0062ff" strokeWidth="1" strokeDasharray="2 2" />
               <circle cx="12" cy="12" r="3" fill="#0062ff" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 font-black tracking-[0.4em] uppercase leading-none">XALLET</span>
            <span className="text-[6px] text-[#0062ff] font-bold tracking-[0.3em] uppercase leading-none mt-1 opacity-90 animate-pulse">MARTIAN NEURAL LINK</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrency(currency === 'USD' ? 'CNY' : 'USD')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm min-w-[36px]">{currency}</button>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="text-[10px] font-black border border-white/10 px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm">{lang === 'en' ? '中' : 'EN'}</button>
          <button onClick={() => setShowProfileSetup(true)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-all overflow-hidden group ml-1">
             <svg className="w-5 h-5 text-blue-500/80" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
             </svg>
          </button>
        </div>
      </header>

      {showProfileSetup && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#161618] border border-white/10 rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Neural Profile</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Identify your core signal</p>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{t.companion.genderPrompt}</label>
              <div className="flex gap-4">
                {(['male', 'female'] as const).map(g => (
                  <button 
                    key={g} 
                    onClick={() => setUserStats({...userStats, gender: g})}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${userStats.gender === g ? 'bg-[#0062ff] border-[#0062ff] text-white shadow-lg shadow-blue-500/30' : 'border-white/5 text-gray-500 hover:bg-white/5'}`}
                  >
                    {g === 'male' ? t.companion.male : t.companion.female}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{t.companion.mbtiPrompt}</label>
              <select 
                value={userStats.personality}
                onChange={(e) => setUserStats({...userStats, personality: e.target.value as MBTI})}
                className="w-full bg-[#0d0d0f] border border-white/10 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-blue-500 shadow-inner"
              >
                {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowProfileSetup(false)}
              className="w-full bg-[#0062ff] py-4 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white"
            >
              Sync Neural Link
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full relative z-10 pb-24 scroll-smooth">
        {activeTab === 'home' && (
          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Balance Card */}
            <div className="relative p-7 rounded-[2.5rem] bg-[#1a1a1c]/80 border border-white/5 overflow-hidden shadow-2xl backdrop-blur-2xl group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="text-[10px] text-blue-500/70 uppercase font-black tracking-[0.3em] mb-2">{t.totalBalance}</div>
               <div className="text-4xl font-black mono tracking-tighter flex items-baseline gap-1 relative z-10">
                 <span className="text-xl text-white/30">{currencySymbol}</span>
                 {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </div>
            </div>

            {/* Martian Companion */}
            <MartianCompanion stats={userStats} lang={lang} onUpdateStats={setUserStats} />

            {/* Daily Martian Language */}
            <div className="p-6 rounded-[2.5rem] bg-[#1a1a1c]/40 border border-white/5 backdrop-blur-xl relative overflow-hidden">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#0062ff]"></div>
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t.dailyMartian}</span>
               </div>
               <p className="text-[14px] font-medium italic leading-relaxed text-gray-200">
                 "{lang === 'cn' ? dailyQuote.cn : dailyQuote.en}"
               </p>
            </div>

            <AssetTrendChart totalBalance={displayBalance} lang={lang} currency={currency} />

            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5">
              <AssetList assets={assets.slice(0, 4)} currency={currency} />
            </div>
          </div>
        )}

        {activeTab === 'ai' && <AIAssistant lang={lang} currency={currency} />}
        {activeTab === 'tools' && <div className="p-4"><AllocationCalculator lang={lang} currency={currency} expenses={expenses} incomeRecords={incomeRecords} /></div>}
        {activeTab === 'assets' && <div className="p-4 space-y-6"><AssetList assets={assets} currency={currency} /></div>}
        {activeTab === 'studio' && <ImageEditor lang={lang} onExpenseAdded={handleExpenseAdded} onIncomeAdded={handleIncomeAdded} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0d0d0f]/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-2 z-50">
        {[
          { id: 'home', label: t.home, icon: '🏠' },
          { id: 'ai', label: 'AI', icon: '🤖' },
          { id: 'studio', label: t.studio, icon: '📸' },
          { id: 'tools', label: t.plan, icon: '📈' },
          { id: 'assets', label: t.wallet, icon: '💰' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center justify-center w-20 transition-all ${activeTab === tab.id ? 'text-[#0062ff]' : 'text-gray-500'}`}>
            <span className="text-xl mb-1 filter drop-shadow-sm">{tab.icon}</span>
            <span className={`text-[9px] font-black uppercase tracking-tight transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
