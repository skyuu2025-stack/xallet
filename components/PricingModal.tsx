
import React, { useState, useEffect } from 'react';
import { Language, SubscriptionType } from '../types';
import { TRANSLATIONS } from '../constants';

interface PricingModalProps {
  lang: Language;
  currentPlan: SubscriptionType;
  onClose: () => void;
  onUpgrade: () => void;
}

type ModalStep = 'plans' | 'checkout' | 'processing' | 'success';

const PricingModal: React.FC<PricingModalProps> = ({ lang, currentPlan, onClose, onUpgrade }) => {
  const t = TRANSLATIONS[lang].pricing;
  const [step, setStep] = useState<ModalStep>('plans');
  const [txId] = useState(`AWX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'alipay' | 'wechat'>('card');

  const handleStartCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep('checkout');
  };

  const handleConfirmPayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep('processing');
    // Simulate Airwallex Transaction Gateway
    setTimeout(() => {
      onUpgrade();
      setStep('success');
    }, 2800);
  };

  return (
    <div 
      className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 overflow-y-auto pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(0,98,255,0.2)] animate-in zoom-in-95 duration-500 flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 relative overflow-hidden shrink-0">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">
              {step === 'plans' ? t.title : step === 'checkout' ? 'Airwallex Checkout' : step === 'processing' ? 'Processing...' : 'Elite Activated'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {step === 'plans' ? t.subtitle : step === 'checkout' ? 'Authorized Payment Gateway' : step === 'processing' ? 'Encrypting Financial Node...' : 'Access Granted to 2026 Core'}
            </p>
          </div>
          {step !== 'processing' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors z-[600] pointer-events-auto"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar pointer-events-auto">
          
          {step === 'plans' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden shadow-2xl ${currentPlan === SubscriptionType.PREMIUM ? 'bg-blue-500/10 border-blue-500 shadow-blue-500/10' : 'bg-[#111] border-white/10'}`}>
                <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Elite</div>
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{t.premium}</div>
                <div className="text-2xl font-black text-white mb-2">{t.price} <span className="text-xs text-gray-500">/ mo</span></div>
                <div className="text-[8px] text-blue-500/80 font-black mb-4 uppercase tracking-widest">{t.credits}</div>
                
                <div className="space-y-3">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-gray-200 font-bold">
                      <svg className="w-3 h-3 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] opacity-60">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{t.free}</div>
                <div className="text-xl font-black text-white mb-1">$0 <span className="text-[10px] text-gray-600">/ mo</span></div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Basic Neural Features Only</p>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Subscription</span>
                  <span className="text-white">XALLET ELITE v2.6</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Billing Cycle</span>
                  <span className="text-white">Monthly Renewal</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Total to Pay</span>
                  <span className="text-2xl font-black text-white">$19.00 USD</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-2">Select Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['card', 'wechat', 'alipay'] as const).map(m => (
                    <button 
                      key={m} 
                      onClick={() => setSelectedMethod(m)}
                      className={`py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedMethod === m ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center p-1.5">
                        {m === 'card' && <svg className="w-full h-full text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>}
                        {m === 'wechat' && <svg className="w-full h-full text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4.5 1s-1.5-3-6-3-6 3-6 3l1 1h10l1-1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>}
                        {m === 'alipay' && <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 4.5l7.5 12h-15L12 6.5z"/></svg>}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Gateway Verified</div>
                    <div className="text-[10px] text-white font-bold">Secure Airwallex Environment</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin shadow-[0_0_20px_rgba(0,98,255,0.3)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Verification</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] italic">Routing through Airwallex Node...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center py-10 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-[40px] rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] relative z-10 border-4 border-white/20">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Authorized</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-[9px] font-black uppercase tracking-widest space-y-3 text-left w-64 mx-auto">
                   <div className="flex justify-between items-center"><span className="text-gray-500">Transaction ID</span><span className="text-blue-400">{txId}</span></div>
                   <div className="flex justify-between items-center border-t border-white/10 pt-3"><span className="text-gray-500">Post-Order</span><span className="text-green-400 font-black">SYNCHRONIZED</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/40 shrink-0 pointer-events-auto">
          {step === 'plans' && (
            <button 
              onClick={handleStartCheckout}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.5em] shadow-[0_15px_40px_rgba(0,98,255,0.3)] hover:bg-blue-500 active:scale-95 transition-all pointer-events-auto"
            >
              {t.upgrade}
            </button>
          )}

          {step === 'checkout' && (
            <button 
              onClick={handleConfirmPayment}
              className="w-full bg-white text-black py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] active:scale-95 transition-all pointer-events-auto relative overflow-hidden group/pay"
            >
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover/pay:opacity-5 transition-opacity"></div>
              Authorize Payment
            </button>
          )}

          {step === 'success' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-full bg-[#00df9a] text-black py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.5em] shadow-[0_10px_30px_rgba(0,223,154,0.3)] active:scale-95 transition-all pointer-events-auto"
            >
              ENTER ELITE v2.6
            </button>
          )}

          {step !== 'success' && step !== 'processing' && (
            <div className="mt-6 flex flex-col items-center gap-3 opacity-40">
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Airwallex Secured</span>
                <div className="w-px h-2 bg-gray-700"></div>
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">PCI DSS Level 1</span>
              </div>
              <div className="flex gap-2">
                 <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PricingModal;
