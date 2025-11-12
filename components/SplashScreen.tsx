import React from 'react';
import FiberIcon from './icons/FiberIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-50">
      <FiberIcon className="w-48 h-48 text-blue-600 animate-pulse" />
      <h1 className="text-gray-800 text-6xl font-bold mt-8">
        Fiber Tec
      </h1>
    </div>
  );
};

export default SplashScreen;
