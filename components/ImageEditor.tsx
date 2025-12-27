
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
      alert(lang === 'cn' ? '无法访问摄像头。' : 'Cannot access camera.');
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
          // If user provided a reference photo, use edit (img-to-img)
          const base64Data = selectedImage.split(',')[1];
          generated = await geminiService.editImage(base64Data, mimeType, prompt);
        } else {
          // Pure text generation
          generated = await geminiService.generateImage(prompt, imageSize, aspectRatio);
        }
        
        if (generated) setResultImage(generated);
      } else if (mode === 'scan') {
        const base64Data = selectedImage!.split(',')[1];
        const data = await geminiService.analyzeReceipt(base64Data, mimeType);
        if (data && onExpenseAdded) {
          onExpenseAdded({
            id: Date.now().toString(),
            merchant: data.merchant || 'Unknown Merchant',
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
            source: data.source || 'Unknown Source',
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
        alert(lang === 'cn' ? '处理失败，请重试。' : 'Processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold tracking-tight">{t.title}</h2>
        <div className="text-[10px] bg-[#0062ff]/10 text-[#0062ff] px-2 py-0.5 rounded-full border border-[#0062ff]/20 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,98,255,0.1)]">
          {mode === 'gen' ? 'Pro High-Res' : 'Neural OCR'}
        </div>
      </div>

      <div className="flex bg-[#1a1a1c]/80 p-1 rounded-2xl border border-[#2a2a2c] backdrop-blur-md overflow-x-auto">
        {(['gen', 'scan', 'income'] as const).map((m) => (
          <button 
            key={m}
            onClick={() => { setMode(m); setResultImage(null); setScanSuccess(false); setSelectedImage(null); }}
            className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-xl transition-all ${mode === m ? 'bg-[#0062ff] text-white shadow-lg' : 'text-gray-500'}`}
          >
            {m === 'gen' ? t.modeGen : m === 'scan' ? t.modeScan : t.modeIncome}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div 
          className={`aspect-square w-full rounded-3xl border-2 border-dashed border-[#2a2a2c] bg-[#1a1a1c]/60 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden transition-all relative shadow-2xl ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {isCameraOpen ? (
            <div className="absolute inset-0 z-20 bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {/* Sci-fi Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20 m-4 rounded-xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-12">
                <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-90 transition-transform">
                  <div className="w-14 h-14 rounded-full border-2 border-black"></div>
                </button>
                <div className="w-12"></div> {/* Spacer */}
              </div>
            </div>
          ) : resultImage ? (
            <img src={resultImage} alt="Result" className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700 bg-black/20" />
          ) : selectedImage ? (
            <div className="relative w-full h-full">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={startCamera}
                  className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shadow-lg hover:bg-blue-500/20 transition-all group"
                >
                  <svg className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/10 transition-all group"
                >
                  <svg className="w-8 h-8 text-gray-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-400 font-bold tracking-tight uppercase">
                {mode === 'gen' ? (lang === 'cn' ? '高清拍摄或上传参考图' : 'Snap or Upload Reference') : (mode === 'income' ? t.uploadIncome : t.upload)}
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />

          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(0,82,255,0.3)]"></div>
              <p className="text-sm font-black text-white animate-pulse tracking-widest uppercase">{t.scanning}</p>
            </div>
          )}

          {scanSuccess && !isProcessing && (
            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-md flex flex-col items-center justify-center z-10 p-6 text-center animate-in fade-in duration-500">
               <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg">
                 <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
               </div>
               <p className="text-sm font-black text-white tracking-tight">{mode === 'income' ? t.incomeSuccess : t.scanSuccess}</p>
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="space-y-4">
          {(mode === 'gen') && (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.promptGen}
              disabled={isProcessing}
              className="w-full bg-[#1c1c1e]/80 border border-[#2a2a2c] rounded-2xl p-4 text-sm focus:border-blue-500 outline-none resize-none h-24 transition-all backdrop-blur-md shadow-inner text-gray-100"
            />
          )}

          {mode === 'gen' && !selectedImage && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">{t.size}</label>
                <div className="flex bg-[#1a1a1c] border border-[#2a2a2c] rounded-xl p-1">
                  {(["1K", "2K", "4K"] as const).map(sz => (
                    <button key={sz} onClick={() => setImageSize(sz)} className={`flex-1 py-1 text-[10px] font-bold rounded-lg ${imageSize === sz ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}>{sz}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">{t.aspect}</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-xl p-1.5 text-[10px] font-bold text-gray-400 outline-none">
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Cinematic</option>
                  <option value="9:16">9:16 Vertical</option>
                </select>
              </div>
            </div>
          )}
          
          <button
            onClick={handleProcess}
            disabled={((mode === 'scan' || mode === 'income') && !selectedImage) || (mode === 'gen' && !prompt.trim()) || isProcessing}
            className={`w-full text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-30 active:scale-[0.97] transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs ${mode === 'gen' ? 'bg-gradient-to-r from-[#0062ff] to-[#00df9a]' : 'bg-[#0062ff]'}`}
          >
            {mode === 'income' ? t.scanIncomeAction : mode === 'scan' ? t.scanAction : (selectedImage ? (lang === 'cn' ? '图像引导生成' : 'Image-Guided Gen') : t.generate)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
