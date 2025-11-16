import React, { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface InventoryPageProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ onBack, showToast }) => {
    // --- Router Inventory State and Logic ---
    const routerStorageKey = 'routerInventory';
    const [currentQuantity, setCurrentQuantity] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    
    // --- Cable Inventory State and Logic ---
    const cableStorageKey = 'cableInventory';
    const [currentCableLength, setCurrentCableLength] = useState('');
    const [totalCableLength, setTotalCableLength] = useState('');

    useEffect(() => {
        // Load router data
        try {
            const savedRouterData = localStorage.getItem(routerStorageKey);
            if (savedRouterData) {
                const { current, max } = JSON.parse(savedRouterData);
                if (typeof current === 'number' && typeof max === 'number') {
                    setCurrentQuantity(String(current));
                    setMaxCapacity(String(max));
                }
            }
        } catch (error) {
            console.error('Failed to load router inventory data from localStorage', error);
        }

        // Load cable data
        try {
            const savedCableData = localStorage.getItem(cableStorageKey);
            if (savedCableData) {
                const { current, total } = JSON.parse(savedCableData);
                 if (typeof current === 'number' && typeof total === 'number') {
                    setCurrentCableLength(String(current));
                    setTotalCableLength(String(total));
                }
            }
        } catch (error) {
            console.error('Failed to load cable inventory data from localStorage', error);
        }
    }, []);

    const handleRouterSave = () => {
        try {
            localStorage.setItem(routerStorageKey, JSON.stringify({ current: Number(currentQuantity) || 0, max: Number(maxCapacity) || 0 }));
            showToast('تم حفظ مخزون الروتر!', 'success');
        } catch (error) {
            console.error('Failed to save router inventory data to localStorage', error);
            showToast('فشل حفظ بيانات الروتر.', 'error');
        }
    };

    const handleRouterReset = () => {
        setCurrentQuantity('');
        setMaxCapacity('');
        showToast('تم مسح حقول الروتر.', 'success');
    };

    const handleCableSave = () => {
        try {
            localStorage.setItem(cableStorageKey, JSON.stringify({ current: Number(currentCableLength) || 0, total: Number(totalCableLength) || 0 }));
            showToast('تم حفظ بيانات الكابل!', 'success');
        } catch (error) {
            console.error('Failed to save cable inventory data to localStorage', error);
            showToast('فشل حفظ بيانات الكابل.', 'error');
        }
    };

    const handleCableReset = () => {
        setCurrentCableLength('');
        setTotalCableLength('');
        showToast('تم مسح حقول الكابل.', 'success');
    };

  return (
    <PageWrapper title="إدارة المخزون" onBack={onBack}>
      <div className="space-y-6 max-w-md mx-auto">
        {/* Card for Router Inventory */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-right">المخزون الروتر</h2>
            
            <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">الكمية والسعة</h3>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="current-quantity" className="block text-right text-xs font-medium text-gray-600 mb-1">
                            الكمية الحالية
                        </label>
                        <input
                            type="number"
                            id="current-quantity"
                            value={currentQuantity}
                            onChange={(e) => setCurrentQuantity(e.target.value)}
                            className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition"
                            placeholder="أدخل الكمية"
                        />
                    </div>
                    <div>
                        <label htmlFor="max-capacity" className="block text-right text-xs font-medium text-gray-600 mb-1">
                            السعة القصوى
                        </label>
                        <input
                            type="number"
                            id="max-capacity"
                            value={maxCapacity}
                            onChange={(e) => setMaxCapacity(e.target.value)}
                            className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition"
                            placeholder="أدخل السعة"
                        />
                    </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={handleRouterReset}
                        className="bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        onClick={handleRouterSave}
                        className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <span>حفظ</span>
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
        
        {/* Card for Cable Meterage */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-right">ميتراج الكابل (بالمتر)</h2>
            
            <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">الكمية بالمتر</h3>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="current-cable-length" className="block text-right text-xs font-medium text-gray-600 mb-1">
                            الكمية الحالية
                        </label>
                        <input
                            type="number"
                            id="current-cable-length"
                            value={currentCableLength}
                            onChange={(e) => setCurrentCableLength(e.target.value)}
                            className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition"
                            placeholder="أدخل الكمية الحالية"
                        />
                    </div>
                    <div>
                        <label htmlFor="total-cable-length" className="block text-right text-xs font-medium text-gray-600 mb-1">
                           الكمية الإجمالية
                        </label>
                        <input
                            type="number"
                            id="total-cable-length"
                            value={totalCableLength}
                            onChange={(e) => setTotalCableLength(e.target.value)}
                            className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition"
                            placeholder="أدخل الكمية الإجمالية"
                        />
                    </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={handleCableReset}
                        className="bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        onClick={handleCableSave}
                        className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <span>حفظ</span>
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default InventoryPage;