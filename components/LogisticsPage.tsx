import React, { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ShareIcon from './icons/ShareIcon';
import ArchiveBoxIcon from './icons/ArchiveBoxIcon';

interface ConsumptionLogEntry {
  date: string;
  clientName: string;
  sip: string;
  cableConsumed: number;
  routerConsumed: number;
}

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
  showToast: (message: string, type: 'success' | 'error') => void;
}

const LogisticsPage: React.FC<LogisticsPageProps> = ({ showToast }) => {
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

    // --- State and Logic for Reports ---
    const [consumptionLog, setConsumptionLog] = useState<ConsumptionLogEntry[]>([]);

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

        try {
            const savedLog = localStorage.getItem('consumptionLog');
            if (savedLog) {
                setConsumptionLog(JSON.parse(savedLog));
            }
        } catch (error) { console.error('Failed to load consumption log', error); }

    }, []);

    useEffect(() => {
        // Link inventory data to ETAT MATÉRIEL table
        setEtatState(prevState => {
            const newItems = prevState.items.map(item => {
                if (item.designation === 'Routeur Complet 6600') {
                    return { ...item, quantite: currentQuantity };
                }
                if (item.designation === 'Câble Outdoor') {
                    return { ...item, quantite: currentCableLength };
                }
                return item;
            });

            return {
                ...prevState,
                items: newItems
            };
        });
    }, [currentQuantity, currentCableLength]);

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
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">الكمية والسعة</h3>
                    <div className="text-center my-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm font-medium text-gray-600">السعة القصوى / الكمية الحالية</span>
                        <p className="text-3xl font-bold text-blue-700 tracking-wider mt-1">
                            {Number(maxCapacity) || 0} / {Number(currentQuantity) || 0}
                        </p>
                    </div>
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
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">الكمية بالمتر</h3>
                     <div className="text-center my-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-gray-600">الكمية الإجمالية / الحالية (متر)</span>
                        <p className="text-3xl font-bold text-green-700 tracking-wider mt-1">
                            {Number(totalCableLength) || 0} / {Number(currentCableLength) || 0}
                        </p>
                    </div>
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

    const renderReportsContent = () => {
        // Helper function to get the start of the week (assuming Monday is the first day)
        const getWeekStart = (date: Date): Date => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const startOfWeek = new Date(d.setDate(diff));
            startOfWeek.setHours(0, 0, 0, 0);
            return startOfWeek;
        };

        const startOfWeek = getWeekStart(new Date());

        const weeklyLog = consumptionLog.filter(entry => new Date(entry.date) >= startOfWeek);
        
        const totalRoutersThisWeek = weeklyLog.reduce((sum, entry) => sum + entry.routerConsumed, 0);
        const totalCableThisWeek = weeklyLog.reduce((sum, entry) => sum + entry.cableConsumed, 0);

        const ReportCard: React.FC<{title: string, value: string, icon: React.ReactNode}> = ({title, value, icon}) => (
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        );

        return (
            <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 text-right">ملخص الأسبوع الحالي</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReportCard 
                            title="الروترات المستخدمة" 
                            value={String(totalRoutersThisWeek)} 
                            icon={<ArchiveBoxIcon className="w-6 h-6"/>}
                        />
                         <ReportCard 
                            title="الكابل المستخدم (متر)" 
                            value={String(totalCableThisWeek)}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.62-3.385m-5.044-.025a15.998 15.998 0 01-3.388-1.621m7.5 4.242a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385" /></svg>}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 text-center">سجل الأنشطة الأخير</h2>
                    </div>
                    {consumptionLog.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">التاريخ</th>
                                        <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">العميل</th>
                                        <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">SIP</th>
                                        <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 text-center">المواد</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {consumptionLog.map((log, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.date).toLocaleDateString('ar-EG')}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-medium">{log.clientName}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500 font-mono hidden sm:table-cell">{log.sip}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-center">
                                                {log.routerConsumed > 0 && <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">روتر: {log.routerConsumed}</span>}
                                                {log.cableConsumed > 0 && <span className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">كابل: {log.cableConsumed}م</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         <p className="text-center text-gray-500 py-10 px-4">لا توجد سجلات استهلاك حتى الآن. أضف سجل عميل جديد لتظهر البيانات هنا.</p>
                    )}
                </div>
            </div>
        )
    };

    return (
        <PageWrapper title="المخزون والاستهلاك">
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-2 sm:gap-4 mb-8">
                <TabButton label="ETAT MATÉRIEL" isActive={activeTab === 'etat_materiel'} onClick={() => setActiveTab('etat_materiel')} />
                <TabButton label="إدارة المخزون" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                <TabButton label="التقارير والسجلات" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
            </div>
            {activeTab === 'etat_materiel' && renderEtatMaterielContent()}
            {activeTab === 'inventory' && renderInventoryContent()}
            {activeTab === 'reports' && renderReportsContent()}
        </PageWrapper>
    );
};

export default LogisticsPage;
