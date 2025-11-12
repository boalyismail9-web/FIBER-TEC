import React from 'react';
import { Page } from '../types';
import Card from './Card';
import DatabaseIcon from './icons/DatabaseIcon';
import PlusIcon from './icons/PlusIcon';
import SearchIcon from './icons/SearchIcon';
import SettingsIcon from './icons/SettingsIcon';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">مرحباً في Fiber Tec</h1>
          <p className="text-lg text-gray-500">لوحة التحكم الرئيسية لإدارة بياناتك.</p>
        </header>

        <div className="relative mb-12">
          <input
            type="text"
            placeholder="ابحث عن عميل..."
            className="w-full py-3 pr-12 pl-4 text-lg bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<PlusIcon className="w-8 h-8" />}
            title="إدخال بيانات جديدة"
            description="إضافة عميل جديد للنظام"
            onClick={() => navigateTo(Page.NewData)}
          />
          <Card
            icon={<DatabaseIcon className="w-8 h-8" />}
            title="قاعدة البيانات"
            description="عرض والبحث في السجلات"
            onClick={() => navigateTo(Page.Database)}
          />
          <Card
            icon={<SettingsIcon className="w-8 h-8" />}
            title="الإعدادات"
            description="إعدادات التطبيق والخصائص"
            onClick={() => navigateTo(Page.Settings)}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
