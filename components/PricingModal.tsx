
import React, { useState } from 'react';
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

  const handleStartCheckout = () => {
    setStep('checkout');
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    setTimeout(() => {
      onUpgrade();
      setStep('success');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,98,255,0.15)] animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header - Stays fairly consistent */}
        <div className="p-10 border-b border-white/5 relative overflow-hidden shrink-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
              {step === 'plans' ? t.title : step === 'checkout' ? 'Airwallex Checkout' : step === 'processing' ? 'Encrypting...' : 'Access Granted'}
            </h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              {step === 'plans' ? t.subtitle : step === 'checkout' ? 'Secure Gateway Connection' : step === 'processing' ? 'Xallet ↔ Airwallex Neural Link' : 'Subscription Synchronized'}
            </p>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors z-20">✕</button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {step === 'plans' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex items-center justify-center gap-4 opacity-40">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Partner:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black tracking-tight text-white">AIRWALLEX</span>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </>
          )}

          {step === 'checkout' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Product</span>
                  <span className="text-[10px] font-black text-white uppercase">Xallet Pro Elite</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Billing Cycle</span>
                  <span className="text-[10px] font-black text-white uppercase">Monthly</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-gray-300 uppercase">Total Amount</span>
                  <span className="text-xl font-black text-white mono">$19.00 USD</span>
                </div>
              </div>
              
              <div className="p-6 bg-[#0062ff]/5 border border-[#0062ff]/20 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl p-2 shrink-0">
                   {/* Mock Airwallex Logo Icon */}
                   <svg viewBox="0 0 24 24" className="w-full h-full text-blue-600" fill="currentColor">
                     <path d="M12 2L1 21h22L12 2zm0 4.5l7.5 12h-15L12 6.5z"/>
                   </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Payment Method</span>
                  <span className="text-xs text-white font-bold">Airwallex Secure Global Wallet</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2">
                <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">PCI-DSS Compliant & AES-256 Encrypted</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-white uppercase tracking-[0.3em]">Processing Secure Payment</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Communicating with Airwallex nodes...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center py-10 space-y-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div className="text-center space-y-4 w-full">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Transaction Success</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                   <div className="flex justify-between">
                     <span className="text-[8px] font-black text-gray-500 uppercase">Receipt No</span>
                     <span className="text-[8px] font-black text-white mono">{txId}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-[8px] font-black text-gray-500 uppercase">Provider</span>
                     <span className="text-[8px] font-black text-blue-400">Airwallex Ltd.</span>
                   </div>
                   <div className="flex justify-between pt-2 border-t border-white/5">
                     <span className="text-[8px] font-black text-gray-500 uppercase">Credits Added</span>
                     <span className="text-[10px] font-black text-green-400">+19,000 MC</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-white/5 bg-black/60 shrink-0">
          {step === 'plans' && (
            <>
              {currentPlan === SubscriptionType.PREMIUM ? (
                <div className="w-full bg-white/5 border border-white/10 text-gray-400 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] text-center">
                  {t.current}
                </div>
              ) : (
                <button 
                  onClick={handleStartCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all animate-pulse-slow"
                >
                  {t.upgrade}
                </button>
              )}
            </>
          )}

          {step === 'checkout' && (
            <button 
              onClick={handleConfirmPayment}
              className="w-full bg-white text-black py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Confirm Payment
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}

          {step === 'success' && (
            <button 
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] active:scale-95 transition-all"
            >
              Start Your Elite Era
            </button>
          )}

          {step !== 'success' && step !== 'processing' && (
            <p className="mt-4 text-[9px] text-gray-600 text-center uppercase font-bold tracking-widest">
              Secured by Airwallex Global Financial Infrastructure.
            </p>
          )}
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
