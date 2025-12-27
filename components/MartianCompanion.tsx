
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
  const startX = useRef(0);
  const startRotation = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startRotation.current = rotation;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    setRotation(startRotation.current + delta * 0.8);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const personalityColor = useMemo(() => {
    const analytic = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
    const sentinel = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
    // Elevated Palette: Shifting from flat colors to prismatic glows
    if (analytic.includes(stats.personality)) return '#8b5cf6'; // Electric Violet
    if (sentinel.includes(stats.personality)) return '#ec4899'; // Neon Pink
    return '#06b6d4'; // Cyan Pulse
  }, [stats.personality]);

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
    alert(lang === 'cn' ? `获得新女神装备：${randomItem.name.cn}` : `Acquired Goddess Gear: ${randomItem.name.en}`);
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
    <div className="relative p-7 rounded-[3.5rem] bg-[#08080a]/98 border border-white/10 overflow-hidden group select-none shadow-[0_40px_80px_-15px_rgba(0,0,0,1)]">
      {/* High-Fidelity Goddess Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Micro-Dot Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '14px 14px' }}></div>
        
        {/* Shifting Prismatic Auras */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Elegant HUD Telemetry */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white"></div>
          <span className="text-[7px] font-black tracking-[0.5em] text-white">NEURAL_BEAUTY_STABILIZED</span>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white"></div>
        </div>

        {/* Floating Particle Stream */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 left-1/3 animate-float-particle"></div>
          <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 right-1/4 animate-float-particle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute w-1 h-1 bg-white rounded-full bottom-1/3 left-1/2 animate-float-particle" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex justify-between items-start mb-10 relative z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] drop-shadow-sm">{lang === 'cn' ? '火星·女神核心' : 'GODDESS CORE V.2'}</h3>
          <div className="flex items-center gap-2.5">
            <span className="text-[22px] font-black text-white tracking-tighter">{stats.gender === 'male' ? 'VENUS-X' : 'LUNA-PRIME'}</span>
            <div className="h-4 w-[2px] bg-purple-500/30 rounded-full"></div>
            <span className="text-[9px] text-purple-300 font-mono font-bold tracking-widest uppercase">{stats.personality}</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end translate-y-2">
          <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{t.ranking}</div>
          <div className="px-3 py-1 rounded-full bg-[#0d0d0f]/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="text-[16px] font-black text-white mono tracking-tighter italic">TOP {stats.rank || 158}</span>
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
        {/* Floating Side Telemetry */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-8 pointer-events-auto">
           <div className="flex flex-col items-center gap-3">
             <div className="relative">
               <div className={`w-5 h-5 rounded-sm rotate-45 border-2 transition-all duration-1000 ${stats.dailyEarned ? 'bg-purple-500 border-purple-300 shadow-[0_0_25px_#a855f7]' : 'bg-transparent border-white/10'}`}></div>
               <div className="absolute inset-0 animate-ping opacity-20 bg-purple-400 rounded-full scale-150"></div>
             </div>
             <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{t.goalEarn}</span>
           </div>
           <div className="flex flex-col items-center gap-3">
             <div className="relative">
               <div className={`w-5 h-5 rounded-sm rotate-45 border-2 transition-all duration-1000 ${stats.dailySaved ? 'bg-purple-500 border-purple-300 shadow-[0_0_25px_#a855f7]' : 'bg-transparent border-white/10'}`}></div>
             </div>
             <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{t.goalSave}</span>
           </div>
        </div>

        {/* Enhanced Goddess Avatar Container */}
        <div 
          className="relative w-80 h-80"
          style={{ perspective: '2500px', transformStyle: 'preserve-3d' }}
        >
          {/* Radioactive Aura Glows */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] animate-radioactive-pulse"></div>
            <div className="w-64 h-64 border border-white/5 rounded-full animate-spin-slow"></div>
          </div>

          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full drop-shadow-[0_0_70px_rgba(168,85,247,0.5)]"
            style={{ 
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 1.5s cubic-bezier(0.15, 1, 0.3, 1)'
            }}
          >
            <defs>
              <linearGradient id="goddessSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={personalityColor} />
                <stop offset="100%" stopColor="#0a0a1f" />
              </linearGradient>
              <radialGradient id="goddessSkin" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                <stop offset="100%" stopColor={personalityColor} />
              </radialGradient>
              <filter id="ultra-glow">
                <feGaussianBlur stdDeviation="0.45" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbiting Tech-Halos */}
            <ellipse cx="12" cy="11.5" rx="8.5" ry="10" fill="none" stroke="white" strokeWidth="0.05" strokeOpacity="0.1" />
            <circle cx="12" cy="11.5" r="9.2" fill="none" stroke="purple" strokeWidth="0.1" strokeDasharray="0.5 2" className="animate-spin-slow" />

            <g className="goddess-rendering">
              {/* Elegant Silhouette with Neck and Shoulders */}
              <path 
                d="M10 11 C9 11, 8.5 12, 8.5 13 L9 23 L15 23 L15.5 13 C15.5 12, 15 11, 14 11 Z" 
                fill="url(#goddessSuit)" 
                stroke="white" 
                strokeWidth="0.05" 
                strokeOpacity="0.4"
              />
              {/* Intricate Neural Lines on Suit */}
              <path d="M11 11.5 L11 23 M13 11.5 L13 23 M10.5 14 L13.5 14 M10 18 L14 18" stroke="white" strokeWidth="0.04" strokeOpacity="0.15" fill="none" />
              
              {/* Layered Fiber-Optic Hair */}
              <g className="fiber-hair" opacity="0.8">
                <path d="M7 6 Q4 9 5 18 M17 6 Q20 9 19 18" fill="none" stroke={personalityColor} strokeWidth="0.5" strokeLinecap="round" className="animate-pulse" />
                <path d="M7.5 5 Q5.5 8 6 15 M16.5 5 Q18.5 8 18 15" fill="none" stroke="white" strokeWidth="0.15" strokeLinecap="round" opacity="0.3" />
              </g>

              {/* Refined Goddess Head */}
              <path 
                d="M12 4.5 C10 4.5 9 5.5 9 8.5 C9 11.5 10.5 12.5 12 12.5 C13.5 12.5 15 11.5 15 8.5 C15 5.5 14 4.5 12 4.5 Z" 
                fill="url(#goddessSkin)" 
                stroke="white" 
                strokeWidth="0.1" 
                strokeOpacity="0.4" 
              />

              {/* Exquisite Facial Features (Front Only) */}
              <g style={{ opacity: Math.cos(rotation * Math.PI / 180) > 0 ? 1 : 0, transition: 'opacity 0.2s' }}>
                {/* Glowing Eyes/Visor */}
                <rect x="10.2" y="7.8" width="3.6" height="0.8" rx="0.4" fill="rgba(0,255,255,0.4)" stroke="#00ffff" strokeWidth="0.1" filter="url(#ultra-glow)" />
                {/* Delicate Lashes */}
                <path d="M10 7.8 L9.6 7.5 M14 7.8 L14.4 7.5" stroke="cyan" strokeWidth="0.1" opacity="0.6" />
                {/* Subtle Blush and Lips */}
                <circle cx="10" cy="9.2" r="0.4" fill="pink" opacity="0.1" />
                <circle cx="14" cy="9.2" r="0.4" fill="pink" opacity="0.1" />
                <path d="M11.8 9.5 Q12 9.8 12.2 9.5" stroke="#ff007a" strokeWidth="0.1" fill="none" strokeLinecap="round" opacity="0.5" />
              </g>

              {/* Shimmering Goddess Headpiece */}
              <path 
                d="M9 4.5 L12 1.5 L15 4.5" 
                fill="none" 
                stroke="#ffdd00" 
                strokeWidth="0.7" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                filter="url(#ultra-glow)"
                className="animate-float-vertical"
              />
            </g>

            {/* Goddess Wearables Layer */}
            {(['legs', 'body', 'accessory', 'head'] as const).map(cat => (
              stats.equippedItemIds.map(id => {
                const item = WARDROBE_ITEMS.find(i => i.id === id);
                if (item?.category !== cat) return null;
                const depth = cat === 'head' ? 2 : cat === 'accessory' ? 3 : 1.5;
                const visibility = Math.cos(rotation * Math.PI / 180) > -0.3 ? 1 : 0.2;
                return (
                  <g key={id} style={{ opacity: visibility, transform: `translateZ(${depth}px)`, transition: 'opacity 0.6s' }} dangerouslySetInnerHTML={{ __html: item.svgSnippet }} />
                );
              })
            ))}
          </svg>
        </div>

        {/* Action HUD Buttons (Right) */}
        <div className="absolute top-0 right-0 flex flex-col gap-5 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowWardrobe(true); }} 
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-2xl backdrop-blur-3xl group/btn"
            >
              <svg className="w-7 h-7 text-gray-400 group-hover/btn:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMilestone(true); }} 
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all active:scale-90 shadow-2xl backdrop-blur-3xl ${isTeeUnlocked ? 'bg-purple-600/30 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-gray-600'}`}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M21 12c0-1.66-4-3-9-3s-9 1.34-9 3"/><path d="M21 12v6c0 1.66-4 3-9 3s-9-1.34-9-3v-6"/></svg>
            </button>
            {canClaimDaily && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleClaimMysteryBox(); }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20 flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(236,72,153,0.5)] text-white"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
            )}
        </div>
      </div>

      {/* Modern Status Footer */}
      <div className="mt-12 flex items-end justify-between border-t border-white/5 pt-6 relative z-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.tokens}</span>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]"></div>
            <span className="text-[26px] font-black text-white mono leading-none tracking-tight">{stats.tokens.toLocaleString()} <span className="text-[10px] text-purple-400 ml-1">MC</span></span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{lang === 'cn' ? '女神·协同系统' : 'BEAUTY_SYNC'}</span>
          <div className="flex gap-3">
             <div className={`h-1.5 rounded-full transition-all duration-1000 ${stats.dailyEarned ? 'w-12 bg-purple-500' : 'w-4 bg-white/10'}`}></div>
             <div className={`h-1.5 rounded-full transition-all duration-1000 ${stats.dailySaved ? 'w-12 bg-purple-500' : 'w-4 bg-white/10'}`}></div>
          </div>
        </div>
      </div>

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 overflow-hidden" onClick={() => setShowWardrobe(false)}>
          <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_200px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-purple-500/10 to-transparent shrink-0">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{lang === 'cn' ? '女神殿·高级衣橱' : 'Goddess Sanctuary'}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-[14px] text-purple-400 font-bold uppercase mono tracking-widest">{stats.tokens.toLocaleString()} MC</span>
                </div>
              </div>
              <button onClick={() => setShowWardrobe(false)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-5 overflow-y-auto custom-scrollbar flex-1">
              {WARDROBE_ITEMS.filter(i => !i.isSpecial || stats.ownedItemIds.includes(i.id)).map(item => {
                const isOwned = stats.ownedItemIds.includes(item.id);
                const isEquipped = stats.equippedItemIds.includes(item.id);
                return (
                  <div key={item.id} className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative group/item ${isEquipped ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                    <div className="h-20 flex items-center justify-center mb-5">
                      <svg viewBox="0 0 24 24" className="w-20 h-20 drop-shadow-2xl" dangerouslySetInnerHTML={{ __html: item.svgSnippet }} />
                    </div>
                    <div className="text-[13px] font-black mb-4 text-center text-gray-200 tracking-tight">{lang === 'cn' ? item.name.cn : item.name.en}</div>
                    {isOwned ? (
                      <button onClick={() => handleEquip(item.id)} className={`w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isEquipped ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {isEquipped ? t.equipped : t.equip}
                      </button>
                    ) : (
                      <button onClick={() => handleBuy(item)} disabled={stats.tokens < item.price} className="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-purple-600 text-white disabled:opacity-20 active:scale-95 transition-all">
                        {item.price.toLocaleString()} MC
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-8 border-t border-white/5 bg-black/60 shrink-0">
              <button onClick={() => setShowWardrobe(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-[1.75rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">
                {lang === 'cn' ? '完成进化' : 'EVOLVE COMPLETE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestone && (
        <div className="fixed inset-0 z-[110] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setShowMilestone(false)}>
          <div className="w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-[4rem] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
             <div className="absolute -top-20 -left-20 w-50 h-50 bg-purple-500/10 blur-[80px] rounded-full"></div>
             
             <div className="w-28 h-28 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/30 relative animate-pulse">
               <svg className={`w-14 h-14 ${isTeeUnlocked ? 'text-purple-400' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
               {isTeeUnlocked && <div className="absolute -top-1 -right-1 w-10 h-10 bg-purple-500 rounded-full border-4 border-[#0a0a0c] flex items-center justify-center text-white text-xs font-black">✓</div>}
             </div>
             
             <div className="space-y-3">
               <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{t.milestone}</h2>
               <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider">{t.milestoneDesc}</p>
             </div>

             <div className="grid grid-cols-2 gap-5">
                <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] text-gray-600 font-black uppercase mb-2 tracking-widest">Tokens</div>
                  <div className={`text-xl font-black mono ${stats.tokens >= 10000 ? 'text-purple-400' : 'text-white'}`}>{stats.tokens >= 1000 ? (stats.tokens/1000).toFixed(1)+'K' : stats.tokens} / 10K</div>
                </div>
                <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] text-gray-600 font-black uppercase mb-2 tracking-widest">Rank</div>
                  <div className={`text-xl font-black mono ${(stats.rank || 158) <= 100 ? 'text-purple-400' : 'text-white'}`}>#{stats.rank || 158} / 100</div>
                </div>
             </div>
             
             {isTeeUnlocked ? (
               <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-[2.25rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">
                 {t.claimTee}
               </button>
             ) : (
               <button onClick={() => setShowMilestone(false)} className="w-full bg-white/5 text-gray-500 py-5 rounded-[2.25rem] text-xs font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                 {lang === 'cn' ? '返回女神殿' : 'BACK TO TEMPLE'}
               </button>
             )}
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-radioactive-pulse { animation: radioactive-pulse 6s ease-in-out infinite; }
        @keyframes radioactive-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }

        .animate-float-particle { animation: float-particle 10s ease-in-out infinite; }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }

        .animate-float-vertical { animation: float-v 4s ease-in-out infinite; }
        @keyframes float-v { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MartianCompanion;
