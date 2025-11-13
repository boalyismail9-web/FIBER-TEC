import React, { useState, useRef, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import { FormData } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import ConfirmationModal from './ConfirmationModal';
import KeyIcon from './icons/KeyIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface SettingsPageProps {
  onBack: () => void;
  records: FormData[];
  onRestore: (data: FormData[]) => void;
  onClearAll: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    onBack, 
    records, 
    onRestore, 
    onClearAll, 
    showToast,
    apiKey,
    onSaveApiKey,
    onClearApiKey,
}) => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [restoreFileData, setRestoreFileData] = useState<FormData[] | null>(null);
  const [inputApiKey, setInputApiKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputApiKey(apiKey);
  }, [apiKey]);

  const handleBackup = () => {
    if (records.length === 0) {
      showToast('لا توجد بيانات لإنشاء نسخة احتياطية.', 'error');
      return;
    }
    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `fiber_tec_backup_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('تم بدء تنزيل النسخة الاحتياطية!', 'success');
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSaveApiKey = () => {
    if (inputApiKey.trim() === '') {
        showToast('يرجى إدخال مفتاح API صالح.', 'error');
        return;
    }
    onSaveApiKey(inputApiKey.trim());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not text.");
        const data = JSON.parse(text);
        
        if (Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null && 'clientName' in item && 'sip' in item)) {
          setRestoreFileData(data);
        } else {
          showToast('ملف النسخ الاحتياطي غير صالح أو تالف.', 'error');
          setRestoreFileData(null);
        }

      } catch (error) {
        console.error('Error parsing restore file:', error);
        showToast('فشل في قراءة ملف النسخ الاحتياطي.', 'error');
        setRestoreFileData(null);
      }
    };
    reader.readAsText(file);

    if (event.target) {
        event.target.value = '';
    }
  };

  const confirmRestore = () => {
    if (restoreFileData) {
      onRestore(restoreFileData);
    }
    setRestoreFileData(null);
  };

  const confirmClear = () => {
    onClearAll();
    setIsClearModalOpen(false);
  };
  
  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    colorClass?: 'blue' | 'red' | 'gray';
    disabled?: boolean;
  }> = ({ onClick, icon, text, colorClass = 'blue', disabled = false }) => {
      const colors = {
          blue: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
          red: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
          gray: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      };
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`flex items-center justify-center gap-3 w-full sm:w-auto font-bold py-3 px-6 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors[colorClass]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {icon}
          <span>{text}</span>
        </button>
      );
  };

  return (
    <PageWrapper title="الإعدادات" onBack={onBack}>
        <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
        />

        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-right">مفتاح Gemini API</h2>
                <p className="text-gray-500 mb-4 text-right">
                    أدخل مفتاح Gemini API الخاص بك لتمكين ميزات المسح الضوئي للصور.
                </p>
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="الصق مفتاح API هنا..."
                            value={inputApiKey}
                            onChange={(e) => setInputApiKey(e.target.value)}
                            className="w-full py-3 pr-4 pl-10 text-lg bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left"
                            dir="ltr"
                        />
                         <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <KeyIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                    {apiKey && (
                        <p className="text-sm text-green-700 text-right">
                            المفتاح محفوظ حاليًا وينتهي بـ: ****{apiKey.slice(-4)}
                        </p>
                    )}
                     <p className="text-xs text-gray-500 text-right">
                       يتم تخزين مفتاحك محليًا في متصفحك. تعامل معه بحذر.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-start gap-4">
                        <ActionButton
                            onClick={handleSaveApiKey}
                            icon={<CheckCircleIcon className="w-6 h-6" />}
                            text="حفظ المفتاح"
                            colorClass="blue"
                        />
                        {apiKey && (
                             <ActionButton
                                onClick={onClearApiKey}
                                icon={<TrashIcon className="w-6 h-6" />}
                                text="مسح المفتاح"
                                colorClass="gray"
                            />
                        )}
                    </div>
                </div>
            </div>


            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-right">النسخ الاحتياطي والاستعادة</h2>
                <p className="text-gray-500 mb-6 text-right">
                    احفظ بياناتك في ملف خارجي أو استعدها من نسخة سابقة. هذا مفيد لنقل البيانات بين الأجهزة.
                </p>
                <div className="flex flex-col sm:flex-row justify-start gap-4">
                    <ActionButton
                        onClick={handleBackup}
                        icon={<DownloadIcon className="w-6 h-6" />}
                        text="إنشاء نسخة احتياطية"
                        colorClass="blue"
                    />
                    <ActionButton
                        onClick={handleRestoreClick}
                        icon={<UploadIcon className="w-6 h-6" />}
                        text="استعادة البيانات"
                        colorClass="blue"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-700 mb-2 text-right">منطقة الخطر</h2>
                <p className="text-gray-500 mb-6 text-right">
                    الإجراء التالي سيؤدي إلى حذف جميع بيانات العملاء من هذا الجهاز بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="text-right">
                     <ActionButton
                        onClick={() => setIsClearModalOpen(true)}
                        icon={<TrashIcon className="w-6 h-6" />}
                        text="مسح جميع البيانات"
                        colorClass="red"
                    />
                </div>
            </div>
        </div>

        <ConfirmationModal
            isOpen={isClearModalOpen}
            onClose={() => setIsClearModalOpen(false)}
            onConfirm={confirmClear}
            title="تأكيد مسح البيانات"
            message="هل أنت متأكد أنك تريد حذف جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء."
        />
        
        <ConfirmationModal
            isOpen={!!restoreFileData}
            onClose={() => setRestoreFileData(null)}
            onConfirm={confirmRestore}
            title="تأكيد استعادة البيانات"
            message={`سيتم استبدال جميع البيانات الحالية (${records.length} سجل) ببيانات النسخة الاحتياطية (${restoreFileData?.length || 0} سجل). هل تريد المتابعة؟`}
            confirmButtonText="استعادة"
            confirmButtonVariant="primary"
        />
    </PageWrapper>
  );
};

export default SettingsPage;