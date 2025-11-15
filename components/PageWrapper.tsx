import React from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface PageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, onBack, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50/95 p-4 backdrop-blur-sm sm:p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={onBack}
          className="p-2 rounded-full text-gray-600 bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="الرجوع"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-24">{children}</main>
    </div>
  );
};

export default PageWrapper;