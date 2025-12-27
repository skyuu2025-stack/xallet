
import React, { useState, useEffect } from 'react';
import { Language, SubscriptionType } from '../types';
import { TRANSLATIONS } from '../constants';

interface PricingModalProps {
  lang: Language;
  currentPlan: SubscriptionType;
  onClose: () => void;
  onUpgrade: () => void;
}

type ModalStep = 'plans' | 'checkout' | 'gateway_loading' | 'qr_code' | 'success';

const PricingModal: React.FC<PricingModalProps> = ({ lang, currentPlan, onClose, onUpgrade }) => {
  const t = TRANSLATIONS[lang].pricing;
  const [step, setStep] = useState<ModalStep>('plans');
  const [txId] = useState(`XAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'alipay' | 'wechat'>('card');
  const [countDown, setCountDown] = useState(3);

  const handleStartCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep('checkout');
  };

  const handleConfirmPayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep('gateway_loading');
    
    // Simulate real backend API call to create payment session
    setTimeout(() => {
      if (selectedMethod === 'card') {
        // For card, simulate quick processing
        setStep('success');
        onUpgrade();
      } else {
        // For QR payments, show the scan step
        setStep('qr_code');
      }
    }, 2000);
  };

  const handleQRComplete = () => {
    setStep('gateway_loading');
    setTimeout(() => {
      onUpgrade();
      setStep('success');
    }, 1500);
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
              {step === 'plans' ? t.title : 
               step === 'checkout' ? 'Authorized Gateway' : 
               step === 'gateway_loading' ? 'Authenticating...' :
               step === 'qr_code' ? (lang === 'cn' ? '扫码支付' : 'Scan to Pay') :
               'Elite Activated'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {step === 'plans' ? t.subtitle : 
               step === 'checkout' ? 'Airwallex Checkout Service' : 
               step === 'gateway_loading' ? 'Secure Node Communication' :
               step === 'qr_code' ? (lang === 'cn' ? '请使用对应的移动应用扫描' : 'Use mobile app to finalize') :
               'Access Granted to 2026 Core'}
            </p>
          </div>
          {(step === 'plans' || step === 'checkout' || step === 'qr_code') && (
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
                  <span className="text-gray-500">Service Node</span>
                  <span className="text-white">XALLET_PAY_REORDER_V2</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Billing Logic</span>
                  <span className="text-white">Subscription Protocol</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Amount Due</span>
                  <span className="text-2xl font-black text-white">$19.00 USD</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-2">Secure Method Selection</label>
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
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{m === 'card' ? 'Visa/Master' : m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-green-500 uppercase tracking-widest">Encrypted Pipeline</div>
                    <div className="text-[10px] text-white font-bold">256-bit AES Auth Active</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          )}

          {step === 'gateway_loading' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in fade-in duration-300">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin shadow-[0_0_20px_rgba(0,98,255,0.3)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Verification</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] italic">Handshaking with Airwallex API...</p>
              </div>
            </div>
          )}

          {step === 'qr_code' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
               <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] relative group">
                  {/* Fake QR Code */}
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div>
                     <div className="relative z-10 p-2 border-4 border-black">
                        <svg className="w-32 h-32 text-black" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 3h2v2h-2v-2zm3-3h3v2h-3v-2zm3 3h2v2h-2v-2z" />
                        </svg>
                     </div>
                  </div>
                  {/* Scan Line Animation */}
                  <div className="absolute left-4 right-4 h-0.5 bg-blue-500 shadow-[0_0_10px_#0062ff] animate-scan-y z-20"></div>
               </div>
               <div className="text-center">
                 <p className="text-[11px] font-black text-white uppercase tracking-widest mb-2">Waiting for confirmation</p>
                 <button onClick={handleQRComplete} className="text-[10px] text-blue-400 font-bold underline uppercase tracking-tighter opacity-50 hover:opacity-100 transition-opacity">
                   {lang === 'cn' ? '模拟已支付' : 'Simulate Paid'}
                 </button>
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
              {lang === 'cn' ? '前往安全支付' : 'Proceed to Secure Payment'}
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

          {(step === 'plans' || step === 'checkout') && (
            <div className="mt-6 flex flex-col items-center gap-3 opacity-40">
              <div className="flex items-center gap-4">
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Airwallex Node v4.1</span>
                <div className="w-px h-2 bg-gray-700"></div>
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Global Payout Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        @keyframes scan-y {
           0%, 100% { top: 16px; opacity: 0; }
           10%, 90% { opacity: 1; }
           50% { top: calc(100% - 16px); }
        }
        .animate-scan-y { animation: scan-y 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PricingModal;
