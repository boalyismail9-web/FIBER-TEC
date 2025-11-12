import React, { useRef, useEffect, useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import FlipCameraIcon from './icons/FlipCameraIcon';

interface CameraScanProps {
  onBack: () => void;
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

const CameraScan: React.FC<CameraScanProps> = ({ onBack, onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [countdown, setCountdown] = useState(5);
  const captureTriggeredRef = useRef(false);

  useEffect(() => {
    // When the camera view is active, prevent the body from scrolling.
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the component unmounts.
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    let activeStream: MediaStream;
    const startCamera = async () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      try {
        setError(null);
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 3) {
        return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
        onCapture(imageData);
    }
  };

  useEffect(() => {
    if (isProcessing || captureTriggeredRef.current) {
      return;
    }

    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      captureTriggeredRef.current = true;
      captureFrame();
    }
  }, [countdown, isProcessing]);


  const handleFlipCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Video & Canvas in the background */}
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Viewfinder overlay and content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center">
        <div
          className="relative w-11/12 max-w-sm aspect-[4/3] overflow-hidden"
          style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)' }}
        >
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
          
          {countdown > 0 && (
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-white text-8xl font-bold drop-shadow-lg" style={{ WebkitTextStroke: '2px black' }}>
                 {countdown}
               </span>
             </div>
          )}

          {/* Scanning Line */}
          {countdown > 0 && (
            <div className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_3px_#3B82F6] animate-scan-line"></div>
          )}
        </div>

        <p className="text-white text-lg font-semibold mt-6 drop-shadow-lg px-4">
          {countdown > 0 ? 'ثبّت الكاميرا... سيتم المسح تلقائيًا' : 'جاري المسح...'}
        </p>
      </div>

      {/* Controls on top */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
        {/* Top bar */}
        <div className="w-full flex justify-between items-center">
          <button onClick={handleFlipCamera} className="p-3 bg-black/40 text-white rounded-full backdrop-blur-sm transition-opacity hover:opacity-80" aria-label="تبديل الكاميرا">
            <FlipCameraIcon className="w-6 h-6" />
          </button>
          <button onClick={onBack} className="p-3 bg-black/40 text-white rounded-full backdrop-blur-sm transition-opacity hover:opacity-80" aria-label="الرجوع">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom bar - Capture button removed for automatic scanning */}
        <div className="w-full h-24 flex justify-center pb-4">
          {/* Placeholder for potential future controls */}
        </div>
      </div>
      
      {/* Error message */}
      {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-lg z-30">{error}</div>}

      <style>{`
        @keyframes scan-line-anim-simple {
            0% { top: 0; }
            100% { top: calc(100% - 4px); }
        }
        
        .animate-scan-line {
            animation: scan-line-anim-simple 2.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default CameraScan;