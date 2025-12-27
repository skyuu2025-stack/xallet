
import React from 'react';
import { Asset, Currency } from '../types';
import { EXCHANGE_RATE_USD_TO_CNY } from '../constants';

interface AssetListProps {
  assets: Asset[];
  currency: Currency;
}

const AssetList: React.FC<AssetListProps> = ({ assets, currency }) => {
  const currencySymbol = currency === 'USD' ? '$' : '¥';
  const rate = currency === 'CNY' ? EXCHANGE_RATE_USD_TO_CNY : 1;

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <div 
          key={asset.id} 
          className="flex items-center justify-between p-1 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#111] flex items-center justify-center text-lg font-bold border border-[#222]">
              {asset.icon}
            </div>
            <div>
              <div className="font-bold text-[15px]">{asset.name}</div>
              <div className="text-[12px] text-gray-500 uppercase">{asset.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[15px] mono">
              {currencySymbol}{(asset.price * asset.amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-[12px] font-medium ${asset.change24h >= 0 ? 'text-[#00c076]' : 'text-[#ff4d4f]'}`}>
              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetList;
