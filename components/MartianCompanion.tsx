
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserStats, WardrobeItem, Language, MBTI } from '../types';
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

  // Personality-based base color
  const personalityColor = useMemo(() => {
    const analytic = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
    const sentinel = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
    const diplomat = ['INFJ', 'INFP', 'ENFJ', 'ENFP'];
    if (analytic.includes(stats.personality)) return '#7d33ff'; // Purple
    if (sentinel.includes(stats.personality)) return '#00df9a'; // Green
    if (diplomat.includes(stats.personality)) return '#0062ff'; // Blue
    return '#f3ba2f'; // Yellow for Explorers
  }, [stats.personality]);

  const isTeeUnlocked = (stats.tokens >= 10000 && (stats.rank || 999) <= 100);

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

  const sortedItems = useMemo(() => {
    return [...WARDROBE_ITEMS].sort((a, b) => {
      const order = { head: 4, accessory: 3, body: 2, legs: 1 };
      return order[b.category] - order[a.category];
    });
  }, []);

  return (
    <div className="relative p-6 rounded-[2.5rem] bg-[#1a1a1c]/40 border border-white/5 backdrop-blur-xl overflow-hidden group select-none">
      {/* Background Aura */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: personalityColor }}
      ></div>

      <div className="flex justify-between items-start mb-4 relative z-10 pointer-events-none">
        <div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{t.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-black text-white">{stats.gender === 'male' ? 'Nova (♀)' : 'Atlas (♂)'}</span>
            <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-blue-400 font-bold">{stats.personality}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-black text-gray-500 uppercase mb-0.5">{t.ranking}</div>
          <div className="text-[12px] font-black text-blue-500 mono">#{(stats.rank || 158).toLocaleString()}</div>
        </div>
      </div>

      <div 
        className="flex justify-center items-center h-64 relative z-10 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Rotation Hint */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40 group-hover:opacity-80 transition-opacity">
           <svg className="w-3 h-3 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-1 14.5c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L4.24 8.24C3.46 9.73 3 11.31 3 13c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Drag to Rotate 360°</span>
        </div>

        {/* Holographic Platform */}
        <div className="absolute bottom-8 w-32 h-10 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-12 w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

        {/* Martian Avatar Container with 3D Perspective */}
        <div 
          className="relative w-48 h-48 transition-transform duration-100 ease-out"
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full drop-shadow-[0_0_20px_rgba(0,100,255,0.3)]"
            style={{ 
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            <defs>
              <radialGradient id="martianGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="100%" stopColor={personalityColor} />
              </radialGradient>
            </defs>
            
            {/* Base Alien Body */}
            <g className="martian-body">
              {/* Core Sphere */}
              <circle cx="12" cy="12" r="5" fill="url(#martianGrad)" className="animate-pulse" />
              
              {/* Features (only visible on front side) */}
              <g style={{ opacity: Math.cos(rotation * Math.PI / 180) > 0 ? 1 : 0, transition: 'opacity 0.1s' }}>
                <path d="M10 11 Q11 10 12 11" stroke="rgba(0,0,0,0.6)" strokeWidth="0.3" fill="none" />
                <path d="M14 11 Q15 10 16 11" stroke="rgba(0,0,0,0.6)" strokeWidth="0.3" fill="none" />
                <path d="M11 15 Q12 16 13 15" stroke="rgba(0,0,0,0.4)" strokeWidth="0.2" fill="none" />
              </g>

              {/* Back markings (visible when facing away) */}
              <g style={{ opacity: Math.cos(rotation * Math.PI / 180) < 0 ? 0.4 : 0, transition: 'opacity 0.1s' }}>
                 <circle cx="12" cy="12" r="2" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="1 1" />
              </g>
            </g>
            
            {/* Layered Clothing */}
            {(['legs', 'body', 'accessory', 'head'] as const).map(cat => (
              stats.equippedItemIds.map(id => {
                const item = WARDROBE_ITEMS.find(i => i.id === id);
                if (item?.category !== cat) return null;
                
                // Slightly offset layers for a tiny parallax depth effect
                const depth = cat === 'head' ? 1 : cat === 'accessory' ? 1.5 : 0.5;
                const visibility = Math.cos(rotation * Math.PI / 180) > -0.2 ? 1 : 0.3;

                return (
                  <g 
                    key={id} 
                    style={{ 
                      opacity: visibility,
                      transform: `translateZ(${depth}px)`,
                      transition: 'opacity 0.2s'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.svgSnippet }} 
                  />
                );
              })
            ))}
          </svg>
        </div>

        <div className="absolute top-0 right-0 flex flex-col gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowWardrobe(true); }}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-lg backdrop-blur-md"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMilestone(true); }}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-90 shadow-lg backdrop-blur-md ${isTeeUnlocked ? 'bg-[#00df9a]/20 border-[#00df9a] text-[#00df9a]' : 'bg-white/5 border-white/10 text-gray-600'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.37 8.91l-1.17-1.17a3 3 0 00-4.24 0l-1.17 1.17a3 3 0 000 4.24l1.17 1.17a3 3 0 004.24 0l1.17-1.17a3 3 0 000-4.24zM8 12a4 4 0 100-8 4 4 0 000 8zm0 10a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-500 uppercase">{t.tokens}</span>
          <span className="text-[14px] font-black text-[#00df9a] mono">{stats.tokens.toLocaleString()} MC</span>
        </div>
        {isTeeUnlocked && (
          <div className="flex items-center gap-2 bg-[#00df9a]/10 px-3 py-1.5 rounded-xl border border-[#00df9a]/30 animate-pulse">
            <span className="text-[10px] font-black text-[#00df9a] uppercase tracking-tighter">{t.teeUnlocked}</span>
          </div>
        )}
      </div>

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/[0.03] to-transparent">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">{t.wardrobe}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-[#00df9a] font-bold uppercase mono">{stats.tokens.toLocaleString()} MC</span>
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stats.ownedItemIds.length} Items Collected</span>
                </div>
              </div>
              <button onClick={() => setShowWardrobe(false)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {sortedItems.map(item => {
                const isOwned = stats.ownedItemIds.includes(item.id);
                const isEquipped = stats.equippedItemIds.includes(item.id);
                return (
                  <div key={item.id} className={`p-5 rounded-3xl border transition-all duration-300 relative group/item ${isEquipped ? 'border-[#0062ff] bg-[#0062ff]/10' : 'border-white/5 bg-white/5 hover:bg-white/[0.08]'}`}>
                    <div className="absolute top-2 right-3 text-[8px] text-gray-500 font-black uppercase opacity-60">{item.category}</div>
                    <div className="h-20 flex items-center justify-center mb-4">
                      <svg viewBox="0 0 24 24" className="w-16 h-16 drop-shadow-lg" dangerouslySetInnerHTML={{ __html: item.svgSnippet }} />
                    </div>
                    <div className="text-[12px] font-black mb-3 tracking-tight">{lang === 'cn' ? item.name.cn : item.name.en}</div>
                    {isOwned ? (
                      <button 
                        onClick={() => handleEquip(item.id)}
                        className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isEquipped ? 'bg-[#0062ff] text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                      >
                        {isEquipped ? t.equipped : t.equip}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBuy(item)}
                        disabled={stats.tokens < item.price}
                        className="w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-gradient-to-r from-blue-600 to-cyan-500 text-white disabled:opacity-20 active:scale-95 transition-all shadow-md"
                      >
                        {item.price.toLocaleString()} MC
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestone && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#161618] border border-white/10 rounded-[3rem] p-8 text-center space-y-6 shadow-2xl">
             <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 relative">
               <svg className={`w-12 h-12 ${isTeeUnlocked ? 'text-[#00df9a]' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M20.37 8.91l-1.17-1.17a3 3 0 00-4.24 0l-1.17 1.17a3 3 0 000 4.24l1.17 1.17a3 3 0 004.24 0l1.17-1.17a3 3 0 000-4.24zM8 12a4 4 0 100-8 4 4 0 000 8zm0 10a8 8 0 100-16 8 8 0 000 16z" />
               </svg>
               {isTeeUnlocked && <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00df9a] rounded-full flex items-center justify-center text-black text-[10px] font-black animate-bounce">✓</div>}
             </div>
             
             <div className="space-y-2">
               <h2 className="text-xl font-black uppercase tracking-tighter">{t.milestone}</h2>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">{t.milestoneDesc}</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status</div>
                  <div className={`text-lg font-black mono ${stats.tokens >= 10000 ? 'text-[#00df9a]' : 'text-white'}`}>
                    {stats.tokens.toLocaleString()} / 10k
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Rank</div>
                  <div className={`text-lg font-black mono ${(stats.rank || 158) <= 100 ? 'text-[#00df9a]' : 'text-white'}`}>
                    #{(stats.rank || 158).toLocaleString()}
                  </div>
                </div>
             </div>

             {isTeeUnlocked ? (
               <button className="w-full bg-[#00df9a] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-[#00df9a]/20">
                 {t.claimTee}
               </button>
             ) : (
               <button onClick={() => setShowMilestone(false)} className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-all">
                 Keep Accumulating
               </button>
             )}
          </div>
        </div>
      )}

      <style>{`
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MartianCompanion;
