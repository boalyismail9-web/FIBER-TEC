import React, { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import CheckCircleIcon from './icons/CheckCircleIcon';

// This data was in WeeklyConsumptionPage
interface ConsumptionRecord {
  day: string;
  date: string;
  sip: string;
  cableLength: string;
}
const consumptionData: ConsumptionRecord[] = [
  { day: 'الاثنين', date: '2025/11/10', sip: '0521221055', cableLength: '20M' },
  { day: 'الاثنين', date: '2025/11/10', sip: '0521215516', cableLength: '17M' },
  { day: 'الاثنين', date: '2025/11/10', sip: '0521222478', cableLength: '00M' },
  { day: 'الاثنين', date: '2025/11/10', sip: '0521214158', cableLength: '19M' },
  { day: 'الثلاثاء', date: '2025/11/11', sip: '0521220900', cableLength: '28M' },
  { day: 'الخميس', date: '2025/11/13', sip: '0521231091', cableLength: '00M' },
  { day: 'الخميس', date: '2025/11/13', sip: '0521228270', cableLength: '19M' },
  { day: 'الخميس', date: '2025/11/13', sip: '0521229760', cableLength: '18M' },
  { day: 'الجمعة', date: '2025/11/14', sip: '0521230246', cableLength: '18M' },
  { day: 'الجمعة', date: '2025/11/14', sip: '0521230252', cableLength: '25M' },
  { day: 'الجمعة', date: '2025/11/14', sip: '0521230245', cableLength: '18M' },
  { day: 'الجمعة', date: '2025/11/14', sip: '0521230243', cableLength: '20M' },
];

interface EtatMaterielRecord {
    designation: string;
    quantite: string;
    remarques: string;
}

const initialEtatMaterielData: EtatMaterielRecord[] = [
    { designation: 'CABLE', quantite: '', remarques: '' },
    { designation: 'JARRETIÈRE', quantite: '', remarques: '' },
    { designation: 'BRISE PTO', quantite: '', remarques: '' },
    { designation: 'F6600', quantite: '', remarques: '' },
    { designation: 'F680', quantite: '', remarques: '' },
];


interface LogisticsPageProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const LogisticsPage: React.FC<LogisticsPageProps> = ({ onBack, showToast }) => {
    const [activeTab, setActiveTab] = useState('etat_materiel');

    // --- State and Logic from InventoryPage ---
    const routerStorageKey = 'routerInventory';
    const [currentQuantity, setCurrentQuantity] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    
    const cableStorageKey = 'cableInventory';
    const [currentCableLength, setCurrentCableLength] = useState('');
    const [totalCableLength, setTotalCableLength] = useState('');
    
    // --- State and Logic for ETAT MATÉRIEL ---
    const etatMaterielStorageKey = 'etatMaterielData';
    const [etatMaterielData, setEtatMaterielData] = useState<EtatMaterielRecord[]>(initialEtatMaterielData);

    useEffect(() => {
        try {
            const savedRouterData = localStorage.getItem(routerStorageKey);
            if (savedRouterData) {
                const { current, max } = JSON.parse(savedRouterData);
                if (typeof current === 'number' && typeof max === 'number') {
                    setCurrentQuantity(String(current));
                    setMaxCapacity(String(max));
                }
            }
        } catch (error) { console.error('Failed to load router inventory data', error); }

        try {
            const savedCableData = localStorage.getItem(cableStorageKey);
            if (savedCableData) {
                const { current, total } = JSON.parse(savedCableData);
                 if (typeof current === 'number' && typeof total === 'number') {
                    setCurrentCableLength(String(current));
                    setTotalCableLength(String(total));
                }
            }
        } catch (error) { console.error('Failed to load cable inventory data', error); }
        
        try {
            const savedData = localStorage.getItem(etatMaterielStorageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (Array.isArray(parsedData) && parsedData.length === initialEtatMaterielData.length) {
                    setEtatMaterielData(parsedData);
                }
            }
        } catch (error) { console.error('Failed to load ETAT MATERIEL data from localStorage', error); }

    }, []);

    const handleRouterSave = () => {
        try {
            localStorage.setItem(routerStorageKey, JSON.stringify({ current: Number(currentQuantity) || 0, max: Number(maxCapacity) || 0 }));
            showToast('تم حفظ مخزون الروتر!', 'success');
        } catch (error) { showToast('فشل حفظ بيانات الروتر.', 'error'); }
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
        } catch (error) { showToast('فشل حفظ بيانات الكابل.', 'error'); }
    };

    const handleCableReset = () => {
        setCurrentCableLength('');
        setTotalCableLength('');
        showToast('تم مسح حقول الكابل.', 'success');
    };
    
    const handleEtatMaterielChange = (index: number, field: 'quantite' | 'remarques', value: string) => {
        const newData = [...etatMaterielData];
        newData[index][field] = value;
        setEtatMaterielData(newData);
    };

    const handleEtatMaterielSave = () => {
        try {
            localStorage.setItem(etatMaterielStorageKey, JSON.stringify(etatMaterielData));
            showToast('تم حفظ بيانات ETAT MATÉRIEL!', 'success');
        } catch (error) {
            console.error('Failed to save ETAT MATERIEL data to localStorage', error);
            showToast('فشل حفظ بيانات ETAT MATÉRIEL.', 'error');
        }
    };
    
    const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex-grow sm:flex-grow-0 text-center px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-800 shadow-md hover:bg-gray-100 hover:shadow-lg'
            }`}
        >
            {label}
        </button>
    );

    const renderInventoryContent = () => (
        <div className="space-y-6 max-w-md mx-auto animate-fade-in">
            {/* Card for Router Inventory */}
            <div className="bg-white p-4 rounded-xl shadow-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-3 text-right">المخزون الروتر</h2>
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">الكمية والسعة</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="current-quantity" className="block text-right text-xs font-medium text-gray-600 mb-1">الكمية الحالية</label>
                            <input type="number" id="current-quantity" value={currentQuantity} onChange={(e) => setCurrentQuantity(e.target.value)} className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition" placeholder="أدخل الكمية"/>
                        </div>
                        <div>
                            <label htmlFor="max-capacity" className="block text-right text-xs font-medium text-gray-600 mb-1">السعة القصوى</label>
                            <input type="number" id="max-capacity" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition" placeholder="أدخل السعة"/>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button onClick={handleRouterReset} className="bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">إعادة تعيين</button>
                        <button onClick={handleRouterSave} className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"><span>حفظ</span><CheckCircleIcon className="w-5 h-5" /></button>
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
                            <label htmlFor="current-cable-length" className="block text-right text-xs font-medium text-gray-600 mb-1">الكمية الحالية</label>
                            <input type="number" id="current-cable-length" value={currentCableLength} onChange={(e) => setCurrentCableLength(e.target.value)} className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition" placeholder="أدخل الكمية الحالية"/>
                        </div>
                        <div>
                            <label htmlFor="total-cable-length" className="block text-right text-xs font-medium text-gray-600 mb-1">الكمية الإجمالية</label>
                            <input type="number" id="total-cable-length" value={totalCableLength} onChange={(e) => setTotalCableLength(e.target.value)} className="block w-full border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base text-center p-2 transition" placeholder="أدخل الكمية الإجمالية"/>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button onClick={handleCableReset} className="bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">إعادة تعيين</button>
                        <button onClick={handleCableSave} className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"><span>حفظ</span><CheckCircleIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderConsumptionContent = () => (
        <div className="max-w-lg mx-auto animate-fade-in">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 text-center">جدول استهلاك الأسبوع</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">اليوم</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">التاريخ</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">رقم SIP</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">مطراح الكابل</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {consumptionData.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{record.day}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.sip}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{record.cableLength}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderEtatMaterielContent = () => (
        <div className="max-w-lg mx-auto animate-fade-in">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 text-center">ETAT MATÉRIEL</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">DÉSIGNATION</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">QUANTITÉ</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">REMARQUES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {etatMaterielData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{item.designation}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <input 
                                            type="text" 
                                            value={item.quantite}
                                            onChange={(e) => handleEtatMaterielChange(index, 'quantite', e.target.value)}
                                            className="w-full p-1 border border-gray-200 bg-gray-50 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="--"
                                        />
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <input 
                                            type="text" 
                                            value={item.remarques}
                                            onChange={(e) => handleEtatMaterielChange(index, 'remarques', e.target.value)}
                                            className="w-full p-1 border border-gray-200 bg-gray-50 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="--"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 bg-gray-50 flex justify-end">
                     <button onClick={handleEtatMaterielSave} className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        <span>حفظ</span>
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <PageWrapper title="المخزون والاستهلاك" onBack={onBack}>
            <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-4 mb-8">
                <TabButton label="ETAT MATÉRIEL" isActive={activeTab === 'etat_materiel'} onClick={() => setActiveTab('etat_materiel')} />
                <TabButton label="إدارة المخزون" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                <TabButton label="الاستهلاك الأسبوعي" isActive={activeTab === 'consumption'} onClick={() => setActiveTab('consumption')} />
            </div>
            {activeTab === 'inventory' && renderInventoryContent()}
            {activeTab === 'consumption' && renderConsumptionContent()}
            {activeTab === 'etat_materiel' && renderEtatMaterielContent()}
        </PageWrapper>
    );
};

export default LogisticsPage;
