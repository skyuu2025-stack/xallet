
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
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  
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
        setLastScanResult(null);
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
        setLastScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if ((mode === 'scan' || mode === 'income') && !selectedImage) return;
    if (mode === 'gen' && !prompt.trim()) return;

    setIsProcessing(true);
    setScanSuccess(false);
    setLastScanResult(null);
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
        if (data) {
          setLastScanResult(data);
          if (onExpenseAdded) {
            onExpenseAdded({
              id: Date.now().toString(),
              merchant: data.merchant || 'X-Registry Merchant',
              amount: parseFloat(data.amount) || 0,
              date: data.date || new Date().toISOString().split('T')[0],
              category: data.category || 'Operations'
            });
          }
          setScanSuccess(true);
        }
      } else if (mode === 'income') {
        const base64Data = selectedImage!.split(',')[1];
        const data = await geminiService.analyzeIncome(base64Data, mimeType);
        if (data) {
          setLastScanResult(data);
          if (onIncomeAdded) {
            onIncomeAdded({
              id: Date.now().toString(),
              source: data.source || 'Capital Payer',
              amount: parseFloat(data.amount) || 0,
              date: data.date || new Date().toISOString().split('T')[0],
              category: data.category || 'Revenue'
            });
          }
          setScanSuccess(true);
        }
      }
    } catch (error: any) {
      if (error.message === "KEY_RESET") {
        alert(lang === 'cn' ? '检测到 API 密钥失效或无权限，请重新选择有效的付费项目密钥。' : 'API Key invalid or no permission. Please re-select a valid paid project key.');
        await (window as any).aistudio.openSelectKey();
      } else {
        const errMsg = error?.message || String(error);
        alert(lang === 'cn' ? `神经网络处理失败: ${errMsg}` : `Neural processing failed: ${errMsg}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700 pb-24 relative overflow-hidden">
      <div className="flex items-center justify-between px-2 relative z-10">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">{t.title}</h2>
          <span className="text-[8px] text-blue-400 font-black uppercase tracking-[0.4em] opacity-80">ACTIVATED MODE: ELITE</span>
        </div>
        <div className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,98,255,0.2)] animate-pulse">
          {mode === 'gen' ? 'PRO HIGH-RES' : 'NEURAL OCR'}
        </div>
      </div>

      <div className="flex bg-[#121214]/60 p-1.5 rounded-[1.75rem] border border-white/5 backdrop-blur-2xl shadow-2xl relative z-10">
        {(['gen', 'scan', 'income'] as const).map((m) => (
          <button 
            key={m}
            onClick={() => { setMode(m); setResultImage(null); setScanSuccess(false); setSelectedImage(null); setLastScanResult(null); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden ${mode === m ? 'bg-blue-600/20 border border-blue-500/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {mode === m && <div className="absolute inset-0 bg-blue-400/5 animate-pulse"></div>}
            <span className="relative z-10">{m === 'gen' ? t.modeGen : m === 'scan' ? t.modeScan : t.modeIncome}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5 relative z-10">
        <div 
          className={`aspect-square w-full rounded-[3rem] border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden transition-all relative group shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${isProcessing ? 'cursor-wait' : ''}`}
        >
          {/* Sci-fi Grid Background Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute inset-0 studio-grid-pattern"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.1)_0%,transparent_70%)]"></div>
          </div>

          {/* Viewfinder Corners (UI Decor) */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-blue-500/60 rounded-tl-2xl z-20"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-blue-500/60 rounded-tr-2xl z-20"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-blue-500/60 rounded-bl-2xl z-20"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-blue-500/60 rounded-br-2xl z-20"></div>

          {/* Neural Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30 studio-scanline"></div>
          
          {isCameraOpen ? (
            <div className="absolute inset-0 z-20 bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {/* Sci-fi Crosshair */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20 m-8 rounded-[2.5rem]">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500 rounded-tl-3xl shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500 rounded-tr-3xl shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500 rounded-bl-3xl shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500 rounded-br-3xl shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-16">
                <button onClick={stopCamera} className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-all">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-90 transition-transform relative">
                  <div className="w-18 h-18 rounded-full border-4 border-black/10"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
                </button>
                <div className="w-14"></div>
              </div>
            </div>
          ) : resultImage ? (
            <div className="relative w-full h-full p-12">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 relative bg-black/40">
                <img src={resultImage} alt="Neural Result" className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700" />
              </div>
              <div className="absolute bottom-16 left-12 right-12 flex justify-between items-center pointer-events-none">
                 <span className="px-3 py-1 bg-cyan-600/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,255,0.2)] border border-white/10">PRO OUTPUT SYNC</span>
              </div>
              <button 
                onClick={() => setResultImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 pointer-events-auto active:scale-90 shadow-2xl hover:bg-red-500/20 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : selectedImage ? (
            <div className="relative w-full h-full p-12">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 relative">
                <img src={selectedImage} alt="Input Source" className="w-full h-full object-contain" />
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90 shadow-2xl hover:bg-red-500/20 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <div className="flex gap-10 mb-10 relative">
                <div className="absolute inset-0 bg-cyan-500/5 blur-[50px] rounded-full"></div>
                <button 
                  onClick={startCamera}
                  className="w-24 h-24 rounded-[2rem] bg-cyan-600/5 flex items-center justify-center border border-cyan-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:bg-cyan-600/10 transition-all group/cam relative z-10"
                >
                  <svg className="w-12 h-12 text-cyan-400 group-hover/cam:scale-110 group-hover/cam:text-cyan-300 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <div className="absolute -inset-2 border border-cyan-500/10 rounded-[2.5rem] animate-pulse"></div>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-[2rem] bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:bg-white/[0.08] transition-all group/file relative z-10"
                >
                  <svg className="w-12 h-12 text-gray-500 group-hover/file:scale-110 group-hover/file:text-white transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-black tracking-[0.4em] uppercase leading-relaxed max-w-[240px]">
                {mode === 'gen' ? (lang === 'cn' ? '高清拍摄或上传参考图' : 'CAPTURE OR UPLOAD ASSET DATA') : (mode === 'income' ? t.uploadIncome : t.upload)}
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />

          {isProcessing && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center z-30 p-10 text-center animate-in fade-in duration-300">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_25px_rgba(0,180,216,0.6)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <p className="text-[13px] font-black text-white animate-pulse tracking-[0.6em] uppercase">{t.scanning}</p>
              <div className="mt-6 flex flex-col items-center gap-1.5">
                <p className="text-[8px] text-cyan-500/60 font-black uppercase tracking-[0.3em]">Downloading Neural Weights...</p>
                <div className="w-32 h-[1px] bg-cyan-500/20 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-500 w-1/2 animate-shimmer"></div>
                </div>
              </div>
            </div>
          )}

          {scanSuccess && !isProcessing && (
            <div className="absolute inset-0 bg-[#08080a]/95 backdrop-blur-3xl flex flex-col items-center justify-center z-30 p-6 text-center animate-in fade-in zoom-in-95 duration-700">
               {mode !== 'gen' ? (
                 <>
                   <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,180,216,0.4)]">
                     <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                   </div>
                   <p className="text-[15px] font-black text-white tracking-widest uppercase mb-4">{mode === 'income' ? t.incomeSuccess : t.scanSuccess}</p>
                   
                   {lastScanResult && (
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 w-full max-w-xs text-left animate-in slide-in-from-bottom-2 duration-500">
                       <div className="flex justify-between items-center">
                         <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{mode === 'income' ? 'Source' : 'Merchant'}</span>
                         <span className="text-[11px] text-white font-black">{lastScanResult.merchant || lastScanResult.source}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Amount</span>
                         <span className="text-[14px] text-cyan-400 font-black mono">${lastScanResult.amount}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Date</span>
                         <span className="text-[11px] text-gray-300 font-black">{lastScanResult.date}</span>
                       </div>
                     </div>
                   )}
                   
                   <button onClick={() => {setScanSuccess(false); setLastScanResult(null); setSelectedImage(null);}} className="mt-8 px-10 py-3 bg-cyan-600 text-white rounded-full text-[10px] font-black hover:bg-cyan-500 transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,180,216,0.4)]">Acknowledge</button>
                 </>
               ) : (
                 <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <p className="text-[15px] font-black text-white tracking-widest uppercase">Creative Generation Synced</p>
                    <button onClick={() => setScanSuccess(false)} className="mt-8 px-10 py-3 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Close</button>
                 </div>
               )}
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="space-y-5 relative z-10">
          {(mode === 'gen') && (
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptGen}
                disabled={isProcessing}
                className="w-full bg-[#121214]/60 border border-white/10 rounded-[2.25rem] p-6 text-sm focus:border-cyan-500/40 outline-none resize-none h-32 transition-all backdrop-blur-3xl shadow-2xl text-white placeholder:text-gray-700 font-medium"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">NEURAL OPTIMIZED</span>
              </div>
            </div>
          )}

          {mode === 'gen' && !selectedImage && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] pl-2">{t.size}</label>
                <div className="flex bg-[#08080a]/80 border border-white/5 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
                  {(["1K", "2K", "4K"] as const).map(sz => (
                    <button key={sz} onClick={() => setImageSize(sz)} className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${imageSize === sz ? 'bg-cyan-600/20 text-cyan-400 shadow-[0_0_15px_rgba(0,180,216,0.2)]' : 'text-gray-600 hover:text-gray-300'}`}>{sz}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] pl-2">{t.aspect}</label>
                <div className="relative">
                  <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full bg-[#08080a]/80 border border-white/5 rounded-2xl p-3 text-[10px] font-black text-gray-300 outline-none appearance-none cursor-pointer shadow-2xl backdrop-blur-xl">
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Cinematic</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleProcess}
            disabled={((mode === 'scan' || mode === 'income') && !selectedImage) || (mode === 'gen' && !prompt.trim()) || isProcessing}
            className={`w-full text-white py-6 rounded-[2.25rem] font-black flex items-center justify-center gap-4 disabled:opacity-20 active:scale-[0.97] transition-all shadow-[0_15px_45px_rgba(0,0,0,0.4)] uppercase tracking-[0.6em] text-[12px] relative overflow-hidden group/process ${mode === 'gen' ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600' : 'bg-[#1a1a1c] border border-white/10 hover:border-cyan-500/30 text-gray-200'}`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/process:opacity-100 transition-opacity"></div>
                {mode === 'income' ? t.scanIncomeAction : mode === 'scan' ? t.scanAction : (selectedImage ? (lang === 'cn' ? '图像引导生成' : 'IMAGE-GUIDED GEN') : t.generate)}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .studio-grid-pattern {
          background-size: 30px 30px;
          background-image:
            linear-gradient(to right, rgba(0, 180, 216, 0.15) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(0, 180, 216, 0.15) 1.5px, transparent 1.5px);
          animation: studio-grid-pulse 8s ease-in-out infinite;
        }

        .studio-scanline {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 255, 0.05) 50%,
            transparent 51%
          );
          background-size: 100% 6px;
          animation: studio-scan 5s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.5s linear infinite;
        }

        @keyframes studio-grid-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.04); }
        }

        @keyframes studio-scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ImageEditor;
