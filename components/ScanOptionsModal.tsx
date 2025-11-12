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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease-out' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">اختر طريقة الفحص</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onFileSelect}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
          >
            <UploadIcon className="w-10 h-10 text-blue-600 mb-3" />
            <span className="text-base font-semibold text-gray-700">تحميل الملف</span>
          </button>
          <button
            onClick={onCameraSelect}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
          >
            <CameraIcon className="w-10 h-10 text-green-600 mb-3" />
            <span className="text-base font-semibold text-gray-700">استخدام الكاميرا</span>
          </button>
        </div>
      </div>
      <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
       `}</style>
    </div>
  );
};

export default ScanOptionsModal;