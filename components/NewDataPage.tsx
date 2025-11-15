import React, { useState, useEffect, useRef } from 'react';
import PageWrapper from './PageWrapper';
import CheckCircleIcon from './icons/CheckCircleIcon';
import TrashIcon from './icons/TrashIcon';
import { FormData, Page } from '../types';
import ScanOptionsModal from './ScanOptionsModal';
import CameraIcon from './icons/CameraIcon';


interface EditState {
  index: number;
  data: FormData;
}

interface NewDataPageProps {
  onBack: () => void;
  onSave: (data: FormData) => boolean;
  onUpdate: (index: number, data: FormData) => void;
  recordToEdit: EditState | null;
  showToast: (message: string, type: 'success' | 'error') => void;
  navigateTo: (page: Page) => void;
  scannedData: Partial<FormData> | null;
  clearScannedData: () => void;
  apiKey: string;
}

interface InputFieldProps {
    id: keyof FormData;
    label: string;
    isRtl?: boolean;
    unit?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, isRtl = true, unit, value, onChange, type = 'text' }) => (
    <div className="py-2">
        <label
            htmlFor={id}
            className={`block ${isRtl ? 'text-right' : 'text-left'} text-sm font-medium text-gray-700 mb-2`}
        >
            {label} {id !== 'macAddress' && id !== 'gponSn' && id !== 'dSn' && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className={`block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg ${isRtl ? 'text-right' : 'text-left'} p-3 ${unit ? 'pl-9' : ''}`}
            />
            {unit && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 text-lg">{unit}</span>
                </div>
            )}
        </div>
    </div>
);

const SelectField = ({ id, label, options, value, onChange }) => (
    <div className="py-2">
        <label
            htmlFor={id}
            className="block text-right text-sm font-medium text-gray-700 mb-2"
        >
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <select
                id={id}
                name={id}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg text-right appearance-none p-3"
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-700">
                 <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
);

const initialFormData: FormData = {
    clientName: '',
    cin: '',
    sip: '',
    macAddress: '',
    gponSn: '',
    dSn: '',
    cableLength: '',
    subscriptionSpeed: '20MIGA',
    jarretiereCount: '0',
    brisePtoCount: '0',
    equipmentType: 'F6600',
    landline: '0',
    interventionType: 'Déménagement',
  };

const formatMacAddress = (mac: string): string => {
    if (!mac) return '';
    return mac
        .replace(/[^0-9a-fA-F]/gi, '')
        .toUpperCase()
        .substring(0, 12)
        .match(/.{1,2}/g)
        ?.join(':') || '';
};

const NewDataPage: React.FC<NewDataPageProps> = ({ 
    onBack, 
    onSave, 
    onUpdate, 
    recordToEdit, 
    showToast,
    navigateTo,
    scannedData,
    clearScannedData,
    apiKey
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = recordToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData(recordToEdit.data);
    } else {
      setFormData(initialFormData);
    }
  }, [recordToEdit, isEditMode]);

  useEffect(() => {
    if (scannedData) {
        setFormData(prev => ({
            ...prev,
            macAddress: formatMacAddress(scannedData.macAddress || prev.macAddress),
            gponSn: scannedData.gponSn || prev.gponSn,
            dSn: scannedData.dSn || prev.dSn,
        }));
        showToast('تم تحديث البيانات الممسوحة ضوئيًا!', 'success');
        clearScannedData();
    }
  }, [scannedData, clearScannedData, showToast]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'macAddress') {
        setFormData(prevState => ({
          ...prevState,
          macAddress: formatMacAddress(value),
        }));
    } else {
        setFormData(prevState => ({
          ...prevState,
          [id]: value,
        }));
    }
  };

  const handleClear = () => {
      setFormData(initialFormData);
      showToast("تم مسح البيانات بنجاح!", 'success');
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (formData.clientName.trim() === '' || formData.sip.trim() === '') {
          showToast('يجب إدخال اسم العميل ورقم SIP', 'error');
          return;
      }

      if (isEditMode) {
          onUpdate(recordToEdit.index, formData);
      } else {
          const wasSaved = onSave(formData);
          if (wasSaved) {
            setFormData(initialFormData);
          }
      }
  };
  
  const handleCameraSelect = () => {
    if (!apiKey) {
      showToast('يجب عليك إضافة مفتاح API أولاً.', 'error');
      setIsScanModalOpen(false);
      return;
    }
    setIsScanModalOpen(false);
    navigateTo(Page.CameraScan);
  };

  const handleFileSelect = () => {
    if (isProcessing) return;
    if (!apiKey) {
      showToast('يجب عليك إضافة مفتاح API أولاً.', 'error');
      // ScanOptionsModal will call onClose, so we don't need to close it here.
      return;
    }
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // Reset file input to allow selecting the same file again
    if (event.target) {
        event.target.value = '';
    }

    if (isProcessing || !file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showToast('يرجى تحديد ملف صورة (JPEG, PNG, WEBP).', 'error');
        return;
    }

    setIsProcessing(true);
    showToast('جاري معالجة الصورة...', 'success');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        try {
            const base64Image = (reader.result as string).split(',')[1];
            
            const response = await fetch('/api/process-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image, apiKey: apiKey }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'فشل الاتصال بالخادم');
            }

            const extractedData = await response.json();
            
            setFormData(prev => ({
                ...prev,
                macAddress: formatMacAddress(extractedData.macAddress || prev.macAddress),
                gponSn: extractedData.gponSn || prev.gponSn,
                dSn: extractedData.dSn || prev.dSn,
            }));
            showToast('تم تحديث البيانات الممسوحة ضوئيًا!', 'success');
            
        } catch (error) {
            console.error('Error processing image:', error);
            const errorMessage = (error as Error).message || 'فشل في معالجة الصورة. تأكد من صحة مفتاح API.';
            showToast(errorMessage, 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        showToast('فشل في قراءة الملف.', 'error');
        setIsProcessing(false);
    };
  };

  return (
    <PageWrapper title={isEditMode ? "تعديل البيانات" : "إدخال بيانات"} onBack={onBack}>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <form className="max-w-2xl mx-auto space-y-6 pb-20">
        {/* Client Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#3A5DAE' }}>
              معلومات العميل
            </h2>
            <div
              className="mt-2 h-0.5 w-24 mx-auto"
              style={{ backgroundColor: '#BDD1F8' }}
            ></div>
          </div>
          <div className="space-y-4">
            <InputField id="clientName" label="اسم العميل" value={formData.clientName} onChange={handleChange} />
            <InputField id="cin" label="رقم CIN" value={formData.cin} onChange={handleChange} />
            <InputField id="sip" label="رقم SIP" value={formData.sip} onChange={handleChange} />
          </div>
        </div>

        {/* Equipment Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h2 className="text-2xl font-bold" style={{ color: '#3A5DAE' }}>
                معلومات المعدات
              </h2>
              <div
                className="mt-2 h-0.5 w-24"
                style={{ backgroundColor: '#BDD1F8' }}
              ></div>
            </div>
            {!isEditMode && (
              <button
                type="button"
                onClick={() => setIsScanModalOpen(true)}
                className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="فحص بيانات المعدات"
              >
                <CameraIcon className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            <InputField id="macAddress" label="MAC Address" isRtl={false} value={formData.macAddress} onChange={handleChange} />
            <InputField id="gponSn" label="GPON-SN" isRtl={false} value={formData.gponSn} onChange={handleChange} />
            <InputField id="dSn" label="D-SN" isRtl={false} value={formData.dSn} onChange={handleChange} />
          </div>
        </div>
        
        {/* Installation Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
           <div className="text-center mb-6">
             <h2 className="text-2xl font-bold" style={{ color: '#3A5DAE' }}>
                معلومات التثبيت
            </h2>
             <div
              className="mt-2 h-0.5 w-24 mx-auto"
              style={{ backgroundColor: '#BDD1F8' }}
            ></div>
          </div>
            <div className="space-y-4">
                <InputField 
                    id="cableLength" 
                    label="طول الكابل" 
                    type="number" 
                    unit="م"
                    value={formData.cableLength}
                    onChange={handleChange}
                />
                <SelectField 
                    id="subscriptionSpeed" 
                    label="السرعة المشتركة" 
                    options={['20MIGA', '50MIGA', '100MIGA', '200MIGA', '500MIGA', '1GO']}
                    value={formData.subscriptionSpeed}
                    onChange={handleChange}
                />
                <SelectField 
                    id="jarretiereCount" 
                    label="عدد Jarretière" 
                    options={['0', '1', '2', '3', '4']}
                    value={formData.jarretiereCount}
                    onChange={handleChange}
                />
                <SelectField 
                    id="brisePtoCount" 
                    label="عدد Brise PTO" 
                    options={['0', '1', '2', '3', '4']}
                    value={formData.brisePtoCount}
                    onChange={handleChange}
                />
                <SelectField 
                    id="equipmentType" 
                    label="نوع المعدات" 
                    options={['F6600', 'F680']}
                    value={formData.equipmentType}
                    onChange={handleChange}
                />
                <SelectField 
                    id="landline" 
                    label="هاتف ثابت" 
                    options={['0', '1', '2']}
                    value={formData.landline}
                    onChange={handleChange}
                />
                 <SelectField 
                    id="interventionType" 
                    label="نوع التدخل" 
                    options={['Déménagement', 'INSTALLATION', 'INSTALLATION EXISTANT']}
                    value={formData.interventionType}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div className="pt-6 flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center justify-center gap-3 w-40 bg-[#3b82f6] text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                <span>{isEditMode ? "تحديث" : "حفظ"}</span>
                <CheckCircleIcon className="w-6 h-6" />
            </button>
            {!isEditMode && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center gap-3 w-40 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg text-lg transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                    <span>مسح</span>
                    <TrashIcon className="w-6 h-6" />
                </button>
            )}
        </div>
      </form>
      
       <ScanOptionsModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onCameraSelect={handleCameraSelect}
        onFileSelect={handleFileSelect}
      />
    </PageWrapper>
  );
};

export default NewDataPage;