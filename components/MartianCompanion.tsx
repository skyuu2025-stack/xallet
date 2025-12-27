
import React, { useState, useMemo, useRef } from 'react';
import { UserStats, WardrobeItem, Language } from '../types';
import { TRANSLATIONS, WARDROBE_ITEMS } from '../constants';

interface MartianCompanionProps {
  stats: UserStats;
  lang: Language;
  onUpdateStats: (newStats: UserStats) => void;
}

const MartianCompanion: React.FC<MartianCompanionProps> = ({ stats, lang, onUpdateStats }) => {
  const t = TRANSLATIONS[lang].companion;
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  
  // Rotation Logic
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    startX.current = e.clientX;
    startRotation.current = rotation;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 5) setDragMoved(true);
    setRotation(startRotation.current + delta * 0.8);
  };

  const handlePointerUp = () => {
    // If we didn't drag much, treat as a click to toggle gender
    if (!dragMoved && isDragging) {
      handleToggleGender();
    }
    setIsDragging(false);
  };

  const handleToggleGender = () => {
    onUpdateStats({
      ...stats,
      gender: stats.gender === 'female' ? 'male' : 'female'
    });
  };

  const personalityColor = useMemo(() => {
    // Override: If Male, use Purple as requested. If Female, use Anime Pink/Cyan.
    if (stats.gender === 'male') return '#a855f7'; // Purple (Representing Male version)
    
    const analytic = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
    const sentinel = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
    if (analytic.includes(stats.personality)) return '#00f2ff'; // High-tech Cyan
    if (sentinel.includes(stats.personality)) return '#ff00ff'; // Cyber Pink
    return '#7fff00'; // Lime Acid
  }, [stats.personality, stats.gender]);

  const isTeeUnlocked = (stats.tokens >= 10000 && (stats.rank || 999) <= 100);
  const canClaimDaily = stats.dailyEarned && stats.dailySaved;

  const handleClaimMysteryBox = () => {
    const unowned = WARDROBE_ITEMS.filter(item => !stats.ownedItemIds.includes(item.id));
    if (unowned.length === 0) {
      onUpdateStats({ ...stats, tokens: stats.tokens + 100, dailyEarned: false, dailySaved: false });
      return;
    }
    const randomItem = unowned[Math.floor(Math.random() * unowned.length)];
    onUpdateStats({
      ...stats,
      ownedItemIds: [...stats.ownedItemIds, randomItem.id],
      dailyEarned: false,
      dailySaved: false,
      tokens: stats.tokens + 50
    });
    alert(lang === 'cn' ? `抽到啦！获得新限定：${randomItem.name.cn}` : `Lucky! Acquired: ${randomItem.name.en}`);
  };

  const handleBuy = (item: WardrobeItem) => {
    if (stats.tokens < item.price) return;
    onUpdateStats({
      ...stats,
      tokens: stats.tokens - item.price,
      ownedItemIds: [...stats.ownedItemIds, item.id],
      equippedItemIds: [...stats.equippedItemIds, item.id],
    });
  };

  const handleEquip = (itemId: string) => {
    const item = WARDROBE_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    
    let newEquipped = stats.equippedItemIds.filter(id => {
      const existingItem = WARDROBE_ITEMS.find(i => i.id === id);
      return existingItem?.category !== item.category;
    });

    if (stats.equippedItemIds.includes(itemId)) {
      newEquipped = stats.equippedItemIds.filter(id => id !== itemId);
    } else {
      newEquipped.push(itemId);
    }

    onUpdateStats({ ...stats, equippedItemIds: newEquipped });
  };

  return (
    <div className="relative p-7 rounded-[3.5rem] bg-[#0d0d0f]/98 border border-white/10 overflow-hidden group select-none shadow-[0_40px_80px_-15px_rgba(0,0,0,1)]">
      {/* High-Fidelity Cyber Anime Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `radial-gradient(circle, ${personalityColor} 0.5px, transparent 0.5px)`, backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] animate-pulse" style={{ backgroundColor: `${personalityColor}10` }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Profile Header */}
      <div className="flex justify-between items-start mb-10 relative z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.6em] drop-shadow-sm" style={{ color: personalityColor }}>
            {lang === 'cn' ? '2026·火星萌力核心' : 'MARTIAN MOE CORE'}
          </h3>
          <div className="flex items-center gap-2.5">
            <span className="text-[24px] font-black text-white tracking-tighter italic">
              {stats.gender === 'male' ? 'LUNA-KUN' : 'STELLA-CHAN'}
            </span>
            <div className="h-4 w-[2px] bg-pink-500/40 rounded-full" style={{ backgroundColor: `${personalityColor}40` }}></div>
            <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-[0.2em] uppercase" style={{ color: personalityColor }}>
              {stats.personality}
            </span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end translate-y-2">
          <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{t.ranking}</div>
          <div className="px-3 py-1.5 rounded-2xl bg-pink-500/10 backdrop-blur-md border border-pink-500/20 shadow-[0_0_15px_rgba(255,0,255,0.2)]" style={{ borderColor: `${personalityColor}40`, boxShadow: `0 0 15px ${personalityColor}30` }}>
            <span className="text-[16px] font-black text-white mono tracking-tighter italic">TOP {stats.rank || 582}</span>
          </div>
        </div>
      </div>

      <div 
        className="flex justify-center items-center h-80 relative z-10 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Sidebar Status */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-10 pointer-events-auto">
           <div className="flex flex-col items-center gap-3">
             <div className="relative">
               <div className={`w-6 h-6 rounded-full border-2 transition-all duration-1000 ${stats.dailyEarned ? 'bg-pink-500 border-pink-300 shadow-[0_0_30px_#ff00ff]' : 'bg-transparent border-white/10'}`} style={stats.dailyEarned ? { backgroundColor: personalityColor, borderColor: 'white' } : {}}></div>
               <div className="absolute inset-0 animate-ping opacity-30 bg-pink-400 rounded-full scale-150"></div>
             </div>
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.goalEarn}</span>
           </div>
           <div className="flex flex-col items-center gap-3">
             <div className="relative">
               <div className={`w-6 h-6 rounded-full border-2 transition-all duration-1000 ${stats.dailySaved ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_30px_#00f2ff]' : 'bg-transparent border-white/10'}`}></div>
             </div>
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.goalSave}</span>
           </div>
        </div>

        {/* ANIME MARTIAN CHARACTER CONTAINER */}
        <div className="relative w-80 h-80" style={{ perspective: '3000px', transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: `${personalityColor}20` }}></div>
            <div className="w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
          </div>

          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full drop-shadow-[0_0_80px_rgba(255,0,255,0.3)]"
            style={{ 
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 2s cubic-bezier(0.15, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 40px ${personalityColor}40)`
            }}
          >
            <defs>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff5ee" />
                <stop offset="100%" stopColor="#ffd1b3" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={personalityColor} />
                <stop offset="100%" stopColor="#1a1a1c" />
              </linearGradient>
              <radialGradient id="eyeShine" cx="50%" cy="35%" r="50%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor={personalityColor} />
              </radialGradient>
            </defs>

            <g className="anime-character">
              {/* BODY - Form-fitting Tech Suit */}
              <path 
                d="M10 12 Q8 12, 7.5 14 L8 23 L16 23 L16.5 14 Q16 12, 14 12 Z" 
                fill="#121214" 
                stroke={personalityColor} 
                strokeWidth="0.1"
              />
              <path d="M10.5 14 L13.5 14 M12 14 L12 23" stroke={personalityColor} strokeWidth="0.05" opacity="0.4" />
              
              {/* HEAD - Anime Shape */}
              <path 
                d="M12 4 C9 4, 7.5 6, 7.5 9 C7.5 12, 9.5 13.5, 12 13.5 C14.5 13.5, 16.5 12, 16.5 9 C16.5 6, 15 4, 12 4 Z" 
                fill="url(#skinGrad)" 
              />

              {/* FLOATING ANIME HAIR - Adjusting based on gender */}
              {stats.gender === 'female' ? (
                <>
                  <path 
                    d="M12 3 C7 3, 5 7, 6 12 Q5 14, 4 10 Q5 5, 12 3 Z" 
                    fill="url(#hairGrad)" 
                    className="animate-float-hair"
                  />
                  <path 
                    d="M12 3 C17 3, 19 7, 18 12 Q19 14, 20 10 Q19 5, 12 3 Z" 
                    fill="url(#hairGrad)" 
                    className="animate-float-hair-delayed"
                  />
                </>
              ) : (
                <path 
                  d="M12 3 C10 3, 8 4, 7 6 L6 9 Q8 7, 12 5 Q16 7, 18 9 L17 6 C16 4, 14 3, 12 3 Z" 
                  fill="url(#hairGrad)"
                />
              )}
              
              {/* Bangs */}
              <path d="M7.5 7 L10 5 L12 6 L14 5 L16.5 7" fill="url(#hairGrad)" stroke="black" strokeWidth="0.02" />

              {/* EXPRESSIVE EYES */}
              <g style={{ opacity: Math.cos(rotation * Math.PI / 180) > 0.3 ? 1 : 0, transition: 'opacity 0.3s' }}>
                {/* Left Eye */}
                <ellipse cx="10" cy="9.5" rx="1.2" ry="1.8" fill="#111" />
                <ellipse cx="10.2" cy="8.8" rx="0.5" ry="0.7" fill="url(#eyeShine)" />
                <circle cx="9.8" cy="10.2" r="0.2" fill="white" opacity="0.8" />
                
                {/* Right Eye */}
                <ellipse cx="14" cy="9.5" rx="1.2" ry="1.8" fill="#111" />
                <ellipse cx="14.2" cy="8.8" rx="0.5" ry="0.7" fill="url(#eyeShine)" />
                <circle cx="13.8" cy="10.2" r="0.2" fill="white" opacity="0.8" />
                
                {/* Small Blush */}
                <circle cx="8.5" cy="11" r="0.4" fill="pink" opacity="0.3" />
                <circle cx="15.5" cy="11" r="0.4" fill="pink" opacity="0.3" />
                
                {/* Tiny Smile */}
                <path d="M11.5 12 Q12 12.5 12.5 12" fill="none" stroke="#633" strokeWidth="0.1" strokeLinecap="round" />
              </g>

              {/* High-tech Sensors / Hairpins */}
              <path d="M7 5 L5 2" stroke={personalityColor} strokeWidth="0.3" strokeLinecap="round" />
              <path d="M17 5 L19 2" stroke={personalityColor} strokeWidth="0.3" strokeLinecap="round" />
              <circle cx="5" cy="2" r="0.2" fill="white" className="animate-ping" />
              <circle cx="19" cy="2" r="0.2" fill="white" className="animate-ping" />
            </g>

            {/* Wearables Layer */}
            {(['legs', 'body', 'accessory', 'head'] as const).map(cat => (
              stats.equippedItemIds.map(id => {
                const item = WARDROBE_ITEMS.find(i => i.id === id);
                if (item?.category !== cat) return null;
                return (
                  <g key={id} style={{ transform: `translateZ(4px)` }} dangerouslySetInnerHTML={{ __html: item.svgSnippet }} />
                );
              })
            ))}
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-0 right-0 flex flex-col gap-6 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowWardrobe(true); }} 
              className="w-16 h-16 rounded-[2rem] bg-pink-500/10 border border-pink-500/20 flex items-center justify-center hover:bg-pink-500/20 transition-all active:scale-90 shadow-2xl backdrop-blur-3xl group/btn"
              style={{ borderColor: `${personalityColor}40`, backgroundColor: `${personalityColor}10` }}
            >
              <svg className="w-8 h-8 text-pink-400 group-hover/btn:text-pink-300" style={{ color: personalityColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMilestone(true); }} 
              className={`w-16 h-16 rounded-[2rem] border flex items-center justify-center transition-all active:scale-90 shadow-2xl backdrop-blur-3xl ${isTeeUnlocked ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-gray-600'}`}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {canClaimDaily && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleClaimMysteryBox(); }}
                className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-pink-500 to-red-500 border border-white/20 flex items-center justify-center animate-bounce shadow-[0_0_40px_rgba(255,0,255,0.6)] text-white"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${personalityColor}, #ef4444)` }}
              >
                <span className="text-xl font-black">★</span>
              </button>
            )}
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between border-t border-white/5 pt-8 relative z-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{t.tokens}</span>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse shadow-[0_0_15px_#ff00ff]" style={{ backgroundColor: personalityColor, boxShadow: `0 0 15px ${personalityColor}` }}></div>
            <span className="text-[28px] font-black text-white mono leading-none tracking-tighter">{stats.tokens.toLocaleString()} <span className="text-[10px] text-pink-400 ml-1" style={{ color: personalityColor }}>MC</span></span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{lang === 'cn' ? '情绪·同步协议' : 'MOE_SYNC'}</span>
          <div className="flex gap-4">
             <div className={`h-2 rounded-full transition-all duration-1000 ${stats.dailyEarned ? 'w-16 bg-pink-500' : 'w-6 bg-white/10'}`} style={stats.dailyEarned ? { backgroundColor: personalityColor } : {}}></div>
             <div className={`h-2 rounded-full transition-all duration-1000 ${stats.dailySaved ? 'w-16 bg-cyan-500' : 'w-6 bg-white/10'}`}></div>
          </div>
        </div>
      </div>

      {showWardrobe && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 overflow-hidden" onClick={() => setShowWardrobe(false)}>
          <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_200px_rgba(255,0,255,0.1)] animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-pink-500/10 to-transparent shrink-0" style={{ backgroundImage: `linear-gradient(to bottom, ${personalityColor}20, transparent)` }}>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{lang === 'cn' ? '星际精品店' : 'Galactic Boutique'}</h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" style={{ backgroundColor: personalityColor }}></div>
                  <span className="text-[16px] text-pink-400 font-bold uppercase mono tracking-widest" style={{ color: personalityColor }}>{stats.tokens.toLocaleString()} MC</span>
                </div>
              </div>
              <button onClick={() => setShowWardrobe(false)} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6 overflow-y-auto custom-scrollbar flex-1">
              {WARDROBE_ITEMS.filter(i => !i.isSpecial || stats.ownedItemIds.includes(i.id)).map(item => {
                const isOwned = stats.ownedItemIds.includes(item.id);
                const isEquipped = stats.equippedItemIds.includes(item.id);
                return (
                  <div key={item.id} className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative group/item ${isEquipped ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_25px_rgba(255,0,255,0.1)]' : 'border-white/5 bg-white/5 hover:bg-white/10'}`} style={isEquipped ? { borderColor: personalityColor, backgroundColor: `${personalityColor}10` } : {}}>
                    <div className="h-20 flex items-center justify-center mb-6">
                      <svg viewBox="0 0 24 24" className="w-24 h-24 drop-shadow-2xl" dangerouslySetInnerHTML={{ __html: item.svgSnippet }} />
                    </div>
                    <div className="text-[14px] font-black mb-5 text-center text-gray-200 tracking-tight">{lang === 'cn' ? item.name.cn : item.name.en}</div>
                    {isOwned ? (
                      <button onClick={() => handleEquip(item.id)} className={`w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${isEquipped ? 'bg-pink-600 text-white' : 'bg-white/10 text-gray-400'}`} style={isEquipped ? { backgroundColor: personalityColor } : {}}>
                        {isEquipped ? t.equipped : t.equip}
                      </button>
                    ) : (
                      <button onClick={() => handleBuy(item)} disabled={stats.tokens < item.price} className="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-pink-600 text-white disabled:opacity-20 active:scale-95 transition-all" style={stats.tokens >= item.price ? { backgroundColor: personalityColor } : {}}>
                        {item.price.toLocaleString()} MC
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-10 border-t border-white/5 bg-black/80 shrink-0">
              <button onClick={() => setShowWardrobe(false)} className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-6 rounded-[2rem] text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${personalityColor}, #4f46e5)` }}>
                {lang === 'cn' ? '完成换装' : 'SYNC OUTFIT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestone && (
        <div className="fixed inset-0 z-[110] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setShowMilestone(false)}>
          <div className="w-full max-sm bg-[#0a0a0c] border border-white/10 rounded-[4.5rem] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
             <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-500/10 blur-[90px] rounded-full" style={{ backgroundColor: `${personalityColor}10` }}></div>
             <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-pink-500/30 relative animate-pulse" style={{ borderColor: personalityColor }}>
               <span className="text-4xl" style={{ color: personalityColor }}>★</span>
               {isTeeUnlocked && <div className="absolute -top-2 -right-2 w-12 h-12 bg-pink-500 rounded-full border-4 border-[#0a0a0c] flex items-center justify-center text-white text-sm font-black" style={{ backgroundColor: personalityColor }}>✓</div>}
             </div>
             <div className="space-y-4">
               <h2 className="text-3xl font-black uppercase tracking-tight text-white">{t.milestone}</h2>
               <p className="text-[12px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">{t.milestoneDesc}</p>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="p-7 rounded-[3rem] bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] text-gray-600 font-black uppercase mb-3 tracking-widest">Credits</div>
                  <div className={`text-2xl font-black mono ${stats.tokens >= 10000 ? 'text-pink-400' : 'text-white'}`} style={stats.tokens >= 10000 ? { color: personalityColor } : {}}>{stats.tokens >= 1000 ? (stats.tokens/1000).toFixed(1)+'K' : stats.tokens}</div>
                </div>
                <div className="p-7 rounded-[3rem] bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] text-gray-600 font-black uppercase mb-3 tracking-widest">Rank</div>
                  <div className={`text-2xl font-black mono ${(stats.rank || 582) <= 100 ? 'text-cyan-400' : 'text-white'}`}>#{stats.rank || 582}</div>
                </div>
             </div>
             {isTeeUnlocked ? (
               <button className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${personalityColor}, #4f46e5)` }}>
                 {t.claimTee}
               </button>
             ) : (
               <button onClick={() => setShowMilestone(false)} className="w-full bg-white/5 text-gray-500 py-6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all">
                 {lang === 'cn' ? '继续努力' : 'KEEP GOING'}
               </button>
             )}
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @keyframes float-hair {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-0.5px) rotate(1deg); }
        }
        .animate-float-hair { animation: float-hair 4s ease-in-out infinite; }
        .animate-float-hair-delayed { animation: float-hair 4s ease-in-out infinite -2s; }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MartianCompanion;
