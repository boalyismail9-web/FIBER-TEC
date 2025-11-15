import React, { useRef, useEffect, useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import FlipCameraIcon from './icons/FlipCameraIcon';
import ScanIcon from './icons/ScanIcon';
import { FormData } from '../types';

interface CameraScanProps {
  onBack: () => void;
  onScanSuccess: (data: Partial<FormData>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const CameraScan: React.FC<CameraScanProps> = ({ onBack, onScanSuccess, showToast }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        activeStream = newStream;
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        showToast("لا يمكن الوصول إلى الكاميرا.", 'error');
        onBack();
      }
    };

    startCamera();

    return () => {
      document.body.style.overflow = 'auto';
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, onBack, showToast]);

  const handleCaptureClick = async () => {
    if (isProcessing || !videoRef.current || !canvasRef.current) return;
    
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      showToast('يرجى تعيين مفتاح Gemini API في الإعدادات أولاً.', 'error');
      onBack(); // Go back so the user can set the key
      return;
    }
    
    setIsProcessing(true);
    showToast('جاري معالجة الصورة...', 'success');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
        setIsProcessing(false);
        showToast('فشل في التقاط الصورة.', 'error');
        return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    
    try {
       const response = await fetch('/.netlify/functions/process-image', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ image: base64Image, apiKey: apiKey }),
       });
       
       if (!response.ok) {
           let errorMsg = 'فشل الاتصال بالخادم';
           try {
               const errorData = await response.json();
               errorMsg = errorData.error || `خطأ من الخادم: ${response.status}`;
           } catch (e) {
               errorMsg = `حدث خطأ غير متوقع. (رمز الحالة: ${response.status})`;
           }
           throw new Error(errorMsg);
       }

       const extractedData = await response.json();
       onScanSuccess(extractedData);

    } catch (error) {
        console.error('Error processing image via Netlify function:', error);
        const errorMessage = (error as Error).message || 'فشل في معالجة الصورة. تأكد من صحة مفتاح API.';
        showToast(errorMessage, 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col h-screen">
       <style>{`
          @keyframes scan {
            0% { transform: translateY(0%); }
            100% { transform: translateY(calc(100% - 3px)); }
          }
          .animate-scan {
            animation: scan 2.5s ease-in-out infinite alternate;
          }
       `}</style>
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <header className="flex-shrink-0 p-4 sm:p-6 flex justify-between items-center z-10">
        <button
          onClick={handleFlipCamera}
          className="p-3 text-white bg-black/50 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="عكس الكاميرا"
        >
          <FlipCameraIcon className="w-7 h-7" />
        </button>
        <button
          onClick={onBack}
          className="p-3 text-white bg-black/50 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="الرجوع"
        >
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      </header>
      
      {/* Main Content Area (Camera View) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 space-y-4 overflow-hidden">
        <p className="text-white text-lg flex-shrink-0" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
            ضع الرمز داخل الإطار
        </p>
        <div className="relative w-11/12 max-w-sm aspect-[3/4] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">
           <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' }}
          />
          <div className="absolute inset-0 pointer-events-none">
             {/* Viewfinder borders based on user image */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-[12px] border-l-[12px] border-white rounded-tl-xl"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-[12px] border-r-[12px] border-white rounded-tr-xl"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-[12px] border-l-[12px] border-white rounded-bl-xl"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-[12px] border-r-[12px] border-white rounded-br-xl"></div>
            
            {/* Scanning line */}
            <div className="absolute top-0 left-4 right-4 h-1 bg-red-500/80 shadow-[0_0_10px_red] animate-scan"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 w-full p-6 flex justify-center items-center h-32 z-10">
        <button
          onClick={handleCaptureClick}
          disabled={isProcessing}
          className="flex items-center justify-center gap-3 w-48 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-xl transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 ring-blue-500/50"
          aria-label="فحص الصورة"
        >
          {isProcessing ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>...جاري الفحص</span>
            </>
          ) : (
            <>
              <ScanIcon className="w-7 h-7" />
              <span>فحص</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default CameraScan;
