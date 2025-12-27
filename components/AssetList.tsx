
import React from 'react';
import { Asset, Currency, Language } from '../types';
import { EXCHANGE_RATE_USD_TO_CNY, TRANSLATIONS } from '../constants';

interface AssetListProps {
  assets: Asset[];
  currency: Currency;
  lang?: Language;
}

const AssetList: React.FC<AssetListProps> = ({ assets, currency, lang = 'cn' }) => {
  const currencySymbol = currency === 'USD' ? '$' : '¥';
  const rate = currency === 'CNY' ? EXCHANGE_RATE_USD_TO_CNY : 1;
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative p-7 rounded-[3rem] bg-[#0c0c0e]/80 border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl group">
      {/* Sci-fi Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 asset-grid-pattern"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,180,216,0.1)_0%,transparent_60%)]"></div>
      </div>

      {/* Viewfinder Tech Corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-xl"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl"></div>

      <div className="relative z-10 space-y-2">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5 group/item cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Decorative Rotating Ring on Hover */}
                <div className="absolute inset-0 border border-cyan-500/0 rounded-full group-hover/item:border-cyan-500/40 group-hover/item:animate-spin-slow transition-all"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#1a1a1c] to-[#08080a] flex items-center justify-center text-lg font-black border border-white/10 shadow-lg group-hover/item:shadow-cyan-500/10">
                  <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{asset.icon}</span>
                </div>
                {/* Small Status Dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c0c0e] shadow-[0_0_10px_#22c55e] animate-pulse"></div>
              </div>
              
              <div className="flex flex-col">
                <div className="font-black text-[16px] tracking-tight text-white group-hover/item:text-cyan-400 transition-colors">
                  {asset.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{asset.symbol}</span>
                  <div className="w-1 h-[1px] bg-white/20"></div>
                  <span className="text-[8px] text-blue-500/60 font-bold uppercase">{t.linkedAsset}</span>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="font-black text-[18px] mono text-white tracking-tighter group-hover/item:scale-105 transition-transform origin-right">
                <span className="text-[12px] opacity-40 mr-1">{currencySymbol}</span>
                {(asset.price * asset.amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] font-black tracking-widest px-2 py-0.5 rounded-md ${asset.change24h >= 0 ? 'bg-green-500/10 text-[#00df9a]' : 'bg-red-500/10 text-[#ff4b5c]'}`}>
                <span className="text-[8px]">{asset.change24h >= 0 ? '▲' : '▼'}</span>
                {Math.abs(asset.change24h)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry Footer inside List */}
      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
           <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">{t.syncStatus}: {t.encrypted}</span>
        </div>
        <div className="text-[8px] font-black text-blue-400/50 uppercase tracking-[0.2em] italic">XALLET_OS_v2.026</div>
      </div>

      <style>{`
        .asset-grid-pattern {
          background-size: 30px 30px;
          background-image:
            linear-gradient(to right, rgba(34, 211, 238, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.08) 1px, transparent 1px);
          animation: asset-grid-pulse 12s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes asset-grid-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.03); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AssetList;
