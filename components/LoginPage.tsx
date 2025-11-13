import React from 'react';
import FiberIcon from './icons/FiberIcon';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center">
        <FiberIcon className="w-32 h-32 text-blue-600 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          Fiber Tec
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          مرحبا بك في تطبيق إدارة العملاء
        </p>
        <button
          onClick={onLogin}
          className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
