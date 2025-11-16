import React from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import SettingsIcon from './icons/SettingsIcon';
import ArchiveBoxIcon from './icons/ArchiveBoxIcon';
import PlusIcon from './icons/PlusIcon';
import CalendarDaysIcon from './icons/CalendarDaysIcon';

interface BottomNavBarProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-blue-600';
  const inactiveClasses = 'text-gray-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses} hover:text-blue-600 focus:outline-none`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, navigateTo }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center border-t border-gray-200 z-20">
      <NavItem
        icon={<HomeIcon className="w-6 h-6 mb-1" />}
        label="الرئيسية"
        isActive={currentPage === Page.Home}
        onClick={() => navigateTo(Page.Home)}
      />
      <NavItem
        icon={<ArchiveBoxIcon className="w-6 h-6 mb-1" />}
        label="المخزون"
        isActive={currentPage === Page.Inventory}
        onClick={() => navigateTo(Page.Inventory)}
      />
      <NavItem
        icon={<CalendarDaysIcon className="w-6 h-6 mb-1" />}
        label="الاستهلاك"
        isActive={currentPage === Page.WeeklyConsumption}
        onClick={() => navigateTo(Page.WeeklyConsumption)}
      />
      <NavItem
        icon={<PlusIcon className="w-6 h-6 mb-1" />}
        label="إضافة"
        isActive={currentPage === Page.NewData}
        onClick={() => navigateTo(Page.NewData)}
      />
      <NavItem
        icon={<SettingsIcon className="w-6 h-6 mb-1" />}
        label="الإعدادات"
        isActive={currentPage === Page.Settings}
        onClick={() => navigateTo(Page.Settings)}
      />
    </nav>
  );
};

export default BottomNavBar;