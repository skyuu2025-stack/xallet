
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { Language, Expense, IncomeRecord } from '../types';
import { TRANSLATIONS } from '../constants';

interface ImageEditorProps {
  lang: Language;
  onExpenseAdded?: (expense: Expense) => void;
  onIncomeAdded?: (income: IncomeRecord) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ lang, onExpenseAdded, onIncomeAdded }) => {
  const t = TRANSLATIONS[lang].imageEditor;
  const [mode, setMode] = useState<'gen' | 'scan' | 'income'>('gen');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // High-res config
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3" | "3:4">("1:1");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCameraOpen(false);
      alert(lang === 'cn' ? '无法访问摄像头。请检查权限。' : 'Cannot access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataUrl);
        setMimeType('image/jpeg');
        setResultImage(null);
        setScanSuccess(false);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setScanSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if ((mode === 'scan' || mode === 'income') && !selectedImage) return;
    if (mode === 'gen' && !prompt.trim()) return;

    setIsProcessing(true);
    setScanSuccess(false);
    try {
      if (mode === 'gen') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) await (window as any).aistudio.openSelectKey();
        
        let generated: string | null = null;
        if (selectedImage) {
          const base64Data = selectedImage.split(',')[1];
          generated = await geminiService.editImage(base64Data, mimeType, prompt);
        } else {
          generated = await geminiService.generateImage(prompt, imageSize, aspectRatio);
        }
        
        if (generated) {
          setResultImage(generated);
          setScanSuccess(true);
        }
      } else if (mode === 'scan') {
        const base64Data = selectedImage!.split(',')[1];
        const data = await geminiService.analyzeReceipt(base64Data, mimeType);
        if (data && onExpenseAdded) {
          onExpenseAdded({
            id: Date.now().toString(),
            merchant: data.merchant || 'X-Registry Merchant',
            amount: parseFloat(data.amount) || 0,
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Operations'
          });
          setScanSuccess(true);
        }
      } else if (mode === 'income') {
        const base64Data = selectedImage!.split(',')[1];
        const data = await geminiService.analyzeIncome(base64Data, mimeType);
        if (data && onIncomeAdded) {
          onIncomeAdded({
            id: Date.now().toString(),
            source: data.source || 'Capital Payer',
            amount: parseFloat(data.amount) || 0,
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Revenue'
          });
          setScanSuccess(true);
        }
      }
    } catch (error: any) {
      if (error.message === "KEY_RESET") {
        await (window as any).aistudio.openSelectKey();
      } else {
        alert(lang === 'cn' ? '神经网络连接中断，请重试。' : 'Neural connection interrupted. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{t.title}</h2>
          <span className="text-[8px] text-blue-400 font-black uppercase tracking-[0.4em] opacity-80">Activated Mode: ELITE</span>
        </div>
        <div className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,98,255,0.2)] animate-pulse">
          {mode === 'gen' ? 'PRO HIGH-RES' : 'NEURAL OCR'}
        </div>
      </div>

      <div className="flex bg-[#1a1a1c]/90 p-1.5 rounded-[1.5rem] border border-white/10 backdrop-blur-xl shadow-2xl">
        {(['gen', 'scan', 'income'] as const).map((m) => (
          <button 
            key={m}
            onClick={() => { setMode(m); setResultImage(null); setScanSuccess(false); setSelectedImage(null); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${mode === m ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(0,98,255,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {m === 'gen' ? t.modeGen : m === 'scan' ? t.modeScan : t.modeIncome}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <div 
          className={`aspect-square w-full rounded-[2.5rem] border-2 border-dashed border-white/5 bg-[#1a1a1c]/80 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden transition-all relative group shadow-inner ${isProcessing ? 'cursor-wait' : ''}`}
        >
          {/* Neural Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
          
          {isCameraOpen ? (
            <div className="absolute inset-0 z-20 bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {/* Sci-fi Crosshair */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/30 m-6 rounded-[2rem]">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500 rounded-br-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-16">
                <button onClick={stopCamera} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-90 transition-transform">
                  <div className="w-18 h-18 rounded-full border-4 border-black/10"></div>
                </button>
                <div className="w-14"></div>
              </div>
            </div>
          ) : resultImage ? (
            <div className="relative w-full h-full bg-black/40">
              <img src={resultImage} alt="Neural Result" className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                 <span className="px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">PRO OUTPUT</span>
              </div>
              <button 
                onClick={() => setResultImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 pointer-events-auto active:scale-90"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : selectedImage ? (
            <div className="relative w-full h-full bg-black/20">
              <img src={selectedImage} alt="Input Source" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <div className="flex gap-6 mb-8 relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full"></div>
                <button 
                  onClick={startCamera}
                  className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/40 shadow-2xl hover:bg-blue-600/20 transition-all group/cam relative z-10"
                >
                  <svg className="w-10 h-10 text-blue-400 group-hover/cam:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl hover:bg-white/10 transition-all group/file relative z-10"
                >
                  <svg className="w-10 h-10 text-gray-400 group-hover/file:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 font-black tracking-[0.2em] uppercase leading-relaxed max-w-[200px]">
                {mode === 'gen' ? (lang === 'cn' ? '高清拍摄或上传参考图' : 'Capture or Upload Asset Reference') : (mode === 'income' ? t.uploadIncome : t.upload)}
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />

          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center z-30 p-10 text-center animate-in fade-in duration-300">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin shadow-[0_0_20px_rgba(0,98,255,0.4)]"></div>
              </div>
              <p className="text-sm font-black text-white animate-pulse tracking-[0.5em] uppercase">{t.scanning}</p>
              <p className="text-[8px] text-blue-400 font-black mt-4 uppercase tracking-widest opacity-60">Initializing Neural Weights...</p>
            </div>
          )}

          {scanSuccess && !isProcessing && mode !== 'gen' && (
            <div className="absolute inset-0 bg-green-500/10 backdrop-blur-2xl flex flex-col items-center justify-center z-30 p-6 text-center animate-in fade-in duration-700">
               <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                 <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
               </div>
               <p className="text-sm font-black text-white tracking-tight uppercase">{mode === 'income' ? t.incomeSuccess : t.scanSuccess}</p>
               <button onClick={() => setScanSuccess(false)} className="mt-6 text-[9px] font-black text-green-400 underline tracking-widest uppercase">Dismiss</button>
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="space-y-5">
          {(mode === 'gen') && (
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptGen}
                disabled={isProcessing}
                className="w-full bg-[#121214]/80 border border-white/5 rounded-[1.75rem] p-5 text-sm focus:border-blue-500/50 outline-none resize-none h-28 transition-all backdrop-blur-3xl shadow-2xl text-white placeholder:text-gray-600 font-medium"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 pointer-events-none opacity-40">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                <span className="text-[8px] font-black uppercase text-white">Neural Optimized</span>
              </div>
            </div>
          )}

          {mode === 'gen' && !selectedImage && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.size}</label>
                <div className="flex bg-[#121214] border border-white/5 rounded-2xl p-1.5 shadow-inner">
                  {(["1K", "2K", "4K"] as const).map(sz => (
                    <button key={sz} onClick={() => setImageSize(sz)} className={`flex-1 py-1.5 text-[9px] font-black rounded-xl transition-all ${imageSize === sz ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{sz}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] pl-1">{t.aspect}</label>
                <div className="relative">
                  <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full bg-[#121214] border border-white/5 rounded-2xl p-2.5 text-[10px] font-black text-gray-300 outline-none appearance-none cursor-pointer">
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Cinematic</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleProcess}
            disabled={((mode === 'scan' || mode === 'income') && !selectedImage) || (mode === 'gen' && !prompt.trim()) || isProcessing}
            className={`w-full text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 disabled:opacity-20 active:scale-[0.98] transition-all shadow-2xl uppercase tracking-[0.4em] text-[11px] ${mode === 'gen' ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-blue-500/20' : 'bg-blue-600 shadow-blue-600/10'}`}
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : mode === 'income' ? t.scanIncomeAction : mode === 'scan' ? t.scanAction : (selectedImage ? (lang === 'cn' ? '图像引导生成' : 'IMAGE-GUIDED GEN') : t.generate)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
