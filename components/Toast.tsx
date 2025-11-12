import React, { useEffect } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 z-[100] animate-toast-in">
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md">
        {type === 'success' ? (
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
        ) : (
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        )}
        <p className="text-lg font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default Toast;