import React, { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ShareIcon from './icons/ShareIcon';

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

interface EtatMaterielItem {
    designation: string;
    quantite: string;
    unit?: string;
}

interface EtatMaterielState {
    technicianName: string;
    items: EtatMaterielItem[];
}

const initialEtatState: EtatMaterielState = {
    technicianName: 'ISMAIL ABM',
    items: [
        { designation: 'Routeur Complet 680', quantite: '00' },
        { designation: 'Routeur Complet 6600', quantite: '28' },
        { designation: 'Câble Outdoor', quantite: '00', unit: 'm' },
        { designation: 'Câble indoor', quantite: '00', unit: 'm' },
        { designation: 'Les fix', quantite: '0' },
    ],
};


interface LogisticsPageProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const LogisticsPage: React.FC<LogisticsPageProps> = ({ onBack, showToast }) => {
    const [activeTab, setActiveTab] = useState('etat_materiel');
    const [isSharing, setIsSharing] = useState(false);

    // --- State and Logic from InventoryPage ---
    const routerStorageKey = 'routerInventory';
    const [currentQuantity, setCurrentQuantity] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    
    const cableStorageKey = 'cableInventory';
    const [currentCableLength, setCurrentCableLength] = useState('');
    const [totalCableLength, setTotalCableLength] = useState('');
    
    // --- State and Logic for ETAT MATÉRIEL ---
    const etatStorageKey = 'etatMaterielState';
    const [etatState, setEtatState] = useState<EtatMaterielState>(initialEtatState);

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
            const savedData = localStorage.getItem(etatStorageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData && typeof parsedData.technicianName === 'string' && Array.isArray(parsedData.items)) {
                    setEtatState(parsedData);
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
    
    const handleTechnicianNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEtatState(prevState => ({
            ...prevState,
            technicianName: e.target.value,
        }));
    };

    const handleItemQuantityChange = (index: number, value: string) => {
        const newItems = [...etatState.items];
        newItems[index] = { ...newItems[index], quantite: value };
        setEtatState(prevState => ({
            ...prevState,
            items: newItems,
        }));
    };

    const handleEtatMaterielSave = () => {
        try {
            localStorage.setItem(etatStorageKey, JSON.stringify(etatState));
            showToast('تم حفظ بيانات ETAT MATÉRIEL!', 'success');
        } catch (error) {
            console.error('Failed to save ETAT MATERIEL data to localStorage', error);
            showToast('فشل حفظ بيانات ETAT MATÉRIEL.', 'error');
        }
    };

    const handleEtatMaterielShare = async () => {
        if (isSharing) return;
    
        setIsSharing(true);
    
        try {
            let shareText = `*Bonsoir*\n\n`;
            shareText += `*ETAT MATÉRIEL ${etatState.technicianName.toUpperCase()}*\n\n`;
            
            const itemLines = etatState.items.map(item => `*${item.designation}: ${item.quantite}${item.unit || ''}*`);
            
            // Recreate the specific spacing from the user's request
            if(itemLines.length > 0) shareText += `${itemLines[0]}\n`;
            if(itemLines.length > 1) shareText += `${itemLines[1]}\n\n`;
            if(itemLines.length > 2) shareText += `${itemLines[2]}\n`;
            if(itemLines.length > 3) shareText += `${itemLines[3]}\n\n`;
            if(itemLines.length > 4) shareText += `${itemLines[4]}`;


    
            if (navigator.share) {
                await navigator.share({
                    title: `ETAT MATÉRIEL: ${etatState.technicianName}`,
                    text: shareText,
                });
            } else {
                navigator.clipboard.writeText(shareText);
                showToast('تم نسخ البيانات إلى الحافظة.', 'success');
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Error sharing data:', error);
                showToast('حدث خطأ أثناء المشاركة.', 'error');
            }
        } finally {
            setIsSharing(false);
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
                     <input 
                        type="text"
                        value={etatState.technicianName}
                        onChange={handleTechnicianNameChange}
                        className="w-full text-center text-lg font-semibold text-blue-600 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition mt-2 p-1"
                        placeholder="اسم الفني"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">DÉSIGNATION</th>
                                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 text-center">QUANTITÉ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {etatState.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{item.designation}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={item.quantite}
                                                onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                                                className={`w-full p-1 border border-gray-200 bg-gray-50 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${item.unit ? 'pr-6' : ''}`}
                                                placeholder="--"
                                            />
                                            {item.unit && (
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{item.unit}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={handleEtatMaterielShare} 
                        disabled={isSharing} 
                        className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                        aria-label="مشاركة"
                    >
                        <span>مشاركة</span>
                        <ShareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleEtatMaterielSave} className="flex items-center justify-center gap-2 bg-[#3b82f6] text-white font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        <span>حفظ</span>
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderReportsContent = () => (
        <div className="max-w-lg mx-auto animate-fade-in">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">التقارير والسجلات</h2>
                <p className="text-gray-600">
                    هذا القسم مخصص لعرض التقارير التفصيلية وسجلات الأنشطة.
                    <br />
                    <span className="font-semibold text-blue-600">قيد الإنشاء حاليًا.</span>
                </p>
            </div>
        </div>
    );

    return (
        <PageWrapper title="المخزون والاستهلاك" onBack={onBack}>
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-2 sm:gap-4 mb-8">
                <TabButton label="ETAT MATÉRIEL" isActive={activeTab === 'etat_materiel'} onClick={() => setActiveTab('etat_materiel')} />
                <TabButton label="إدارة المخزون" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                <TabButton label="التقارير والسجلات" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                <TabButton label="الاستهلاك الأسبوعي" isActive={activeTab === 'consumption'} onClick={() => setActiveTab('consumption')} />
            </div>
            {activeTab === 'etat_materiel' && renderEtatMaterielContent()}
            {activeTab === 'inventory' && renderInventoryContent()}
            {activeTab === 'consumption' && renderConsumptionContent()}
            {activeTab === 'reports' && renderReportsContent()}
        </PageWrapper>
    );
};

export default LogisticsPage;