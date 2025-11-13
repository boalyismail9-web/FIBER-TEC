import React from 'react';
import UploadIcon from './icons/UploadIcon';
import CameraIcon from './icons/CameraIcon';
import XIcon from './icons/XIcon';

interface ScanOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: () => void;
  onCameraSelect: () => void;
}

const ScanOptionsModal: React.FC<ScanOptionsModalProps> = ({ isOpen, onClose, onFileSelect, onCameraSelect }) => {
  const [isRendered, setIsRendered] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 150); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex justify-center items-center p-4 transition-opacity duration-150 ease-out ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-xs transition-opacity duration-150 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">اختر طريقة الفحص</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { onFileSelect(); onClose(); }}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <UploadIcon className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700 text-center">تحميل الملف</span>
              </button>
              <button
                onClick={() => { onCameraSelect(); onClose(); }}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                <CameraIcon className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700 text-center">استخدام الكاميرا</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScanOptionsModal;