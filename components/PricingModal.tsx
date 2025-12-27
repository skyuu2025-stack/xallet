
import React from 'react';
import { Language, SubscriptionType } from '../types';
import { TRANSLATIONS } from '../constants';

interface PricingModalProps {
  lang: Language;
  currentPlan: SubscriptionType;
  onClose: () => void;
  onUpgrade: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ lang, currentPlan, onClose, onUpgrade }) => {
  const t = TRANSLATIONS[lang].pricing;

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,98,255,0.15)] animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-white/5 relative overflow-hidden shrink-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{t.title}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`p-8 rounded-[2.5rem] border transition-all ${currentPlan === SubscriptionType.FREE ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t.free}</div>
              <div className="text-2xl font-black text-white mb-6">$0 <span className="text-[10px] text-gray-600">/ mo</span></div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                   <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                   Basic Asset Tracking
                 </div>
                 <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                   <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                   10 Free Scans/Day
                 </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all shadow-2xl ${currentPlan === SubscriptionType.PREMIUM ? 'bg-blue-500/10 border-blue-500' : 'bg-[#111] border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]'}`}>
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">Elite</div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t.premium}</div>
              <div className="text-2xl font-black text-white mb-2">{t.price}</div>
              <div className="text-[9px] text-blue-500 font-black mb-6 uppercase tracking-widest">{t.credits}</div>
              
              <div className="space-y-4">
                {t.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-gray-200 font-bold">
                    <svg className="w-3 h-3 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-white/5 bg-black/60 shrink-0">
          {currentPlan === SubscriptionType.PREMIUM ? (
            <div className="w-full bg-white/5 border border-white/10 text-gray-400 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] text-center">
              {t.current}
            </div>
          ) : (
            <button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all animate-pulse-slow"
            >
              {t.upgrade}
            </button>
          )}
          <p className="mt-4 text-[9px] text-gray-600 text-center uppercase font-bold tracking-widest">
            1 USD = 1,000 Martian Credits conversion included.
          </p>
        </div>
      </div>
      <style>{`
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.02); } }
      `}</style>
    </div>
  );
};

export default PricingModal;
