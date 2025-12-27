
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { Message, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';

interface AIAssistantProps {
  lang: Language;
  currency: Currency;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ lang, currency }) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: lang === 'cn' ? `你好。我是 Xallet 2026 财务策略师。白银正在上涨，全球秩序正在重组。当前基准币种设为 ${currency}。我能如何帮您优化资产配置？` : `Hello. I am your Xallet 2026 Strategist. Silver is rallying and the order is shifting. Your current display currency is ${currency}. How can I optimize your portfolio?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const response = await geminiService.analyzeFinance(input, lang, currency);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || '', timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-[14px] leading-relaxed backdrop-blur-md ${
              m.role === 'user' 
                ? 'bg-[#0062ff]/90 text-white rounded-tr-none border border-blue-400/20 shadow-[0_5px_15px_rgba(0,98,255,0.2)]' 
                : 'bg-white/[0.03] text-gray-100 rounded-tl-none border border-white/5'
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] backdrop-blur-sm p-3 rounded-2xl flex gap-1 border border-white/5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0d0d0f]/60 backdrop-blur-md fixed bottom-16 left-0 right-0 border-t border-white/5 z-20">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder={t.aiPrompt}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm focus:border-blue-500 outline-none text-white transition-all shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="bg-[#0062ff] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 active:scale-90 transition-transform shadow-lg shadow-blue-500/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
