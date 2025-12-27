
import React from 'react';
import { Language } from '../types';

interface LegalModalProps {
  lang: Language;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ lang, type, onClose }) => {
  const isCN = lang === 'cn';

  const content = {
    terms: {
      title: isCN ? "2026 神经服务条款" : "2026 Terms of Neural Service",
      subtitle: isCN ? "火星-地球金融秩序重组修正案 v4.0" : "Mars-Earth Financial Reorder Amendment v4.0",
      clauses: isCN ? [
        { h: "1. 神经连接授权", p: "用户激活 Xallet Neural OS 即表示授权系统访问其财务神经元。所有财务预测均为概率性推导，受 2026 全球市场剧变影响。用户需对依据 AI 策略执行的投资行为承担最终责任。" },
        { h: "2. 流动性节点协议", p: "资产分配引擎旨在优化火星殖民地与地球遗留系统之间的跨星际流动性。任何由白银（Ag）剧烈波动导致的资产缩水，均在火星新秩序免责条款范围内。" },
        { h: "3. 跨星际管辖权", p: "本协议争议解决受 Mars-G 轨道法庭及 Earth-A 幸存者金融署共同管辖。若发生星际同步中断，仲裁将以最后一次全息备份为准。" }
      ] : [
        { h: "1. Neural Link Authorization", p: "Activating Xallet Neural OS authorizes system access to financial neurons. All projections are probabilistic derivations affected by 2026 global shifts. Users bear ultimate responsibility for actions executed based on AI strategies." },
        { h: "2. Liquidity Node Protocol", p: "The allocation engine optimizes inter-planetary liquidity between Martian colonies and Earth legacy systems. Asset depreciation due to Silver (Ag) volatility is covered under New Order indemnity clauses." },
        { h: "3. Galactic Jurisdiction", p: "Disputes are governed by Mars-G Orbital Courts and Earth-A Financial Remnants. In case of sync failure, arbitration relies on the last valid holographic backup." }
      ]
    },
    privacy: {
      title: isCN ? "全息加密隐私协议" : "Holographic Privacy Protocol",
      subtitle: isCN ? "零知识证明与神经哈希标准" : "Zero-Knowledge Proof & Neural Hash Standards",
      clauses: isCN ? [
        { h: "1. 零知识存储", p: "Xallet 绝不存储用户的原始生物识别或财务私钥。所有数据均通过 Zero-Knowledge Proof (ZKP) 技术在本地加密，并仅将摘要上传至火星分布式存储集群。" },
        { h: "2. 生物特征哈希", p: "用户的神经信号被实时转换为不可逆的加密哈希。即使系统遭到物理攻破，黑客亦无法还原真实的意识流财务指令。" },
        { h: "3. 无日志同步", p: "星际网络同步采用‘阅后即焚’协议。系统不保留任何关于用户投资偏好或记账图片的元数据副本，确保您的财务足迹在 2026 黑暗森林中不可追踪。" }
      ] : [
        { h: "1. Zero-Knowledge Storage", p: "Xallet never stores raw biometrics or private keys. All data is encrypted locally via ZKP, with only summarized hashes uploaded to Martian distributed clusters." },
        { h: "2. Biometric Hashing", p: "Neural signals are converted into irreversible cryptographic hashes. Real consciousness-stream financial commands cannot be reconstructed even upon physical system breach." },
        { h: "3. No-Log Galactic Sync", p: "Syncing follows a 'Burn-After-Read' protocol. No metadata regarding investment bias or scanned images is retained, ensuring your footprint is untraceable in the 2026 Dark Forest." }
      ]
    }
  };

  const active = content[type];

  return (
    <div 
      className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-[3rem] p-10 flex flex-col max-h-[85vh] shadow-[0_0_100px_rgba(0,180,216,0.1)] relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{active.title}</h2>
            <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.4em] mt-2">{active.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar relative z-10">
          {active.clauses.map((c, i) => (
            <div key={i} className="space-y-3 group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:animate-ping"></div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{c.h}</h3>
              </div>
              <p className="text-[13px] text-gray-400 font-medium leading-relaxed italic pl-4 border-l border-white/5 group-hover:border-blue-500/30 transition-colors">
                {c.p}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center relative z-10">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white hover:border-white/30 transition-all uppercase tracking-[0.3em]"
          >
            Acknowledge & Sync
          </button>
          <p className="text-[7px] text-gray-700 mt-4 uppercase tracking-[0.1em]">Neural Core: Verified · Timestamp: 2026.04.12.02.59</p>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 180, 216, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LegalModal;
