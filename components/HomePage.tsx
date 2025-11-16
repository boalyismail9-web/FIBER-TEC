import React, { useState } from 'react';
import { FormData } from '../types';
import SearchIcon from './icons/SearchIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import ShareIcon from './icons/ShareIcon';
import ConfirmationModal from './ConfirmationModal';

interface HomePageProps {
  records: FormData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ records, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [modalState, setModalState] = useState<{isOpen: boolean; index: number | null}>({ isOpen: false, index: null });

  const handleShare = async (record: FormData) => {
    if (isSharing) {
      return;
    }

    const formatSpeed = (speed: string) => {
        if (!speed) return '';
        return speed.replace('MIGA', 'M/s').replace('GO', 'G/s');
    };

    const shareText = `CLIENT         : *${record.clientName.toUpperCase()}*
SIP                : *${record.sip}*
CÂBLE          : *${record.cableLength}m*
SOUSCRIT    : *${formatSpeed(record.subscriptionSpeed)}*
MAC              : *${record.macAddress}*
GPON-SN     : *${record.gponSn}*
D-SN             : *${record.dSn}*
Carte CIN     : *${record.cin}*
Jarretière     : *${record.jarretiereCount}*
Brise PTO    : *${record.brisePtoCount}*
Téléphone fix : *${record.landline}*
*Equipement*  : *${record.equipmentType}*
*${record.interventionType}*`;
    
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: `بيانات العميل: ${record.clientName}`,
          text: shareText,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error('خطأ في مشاركة البيانات:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      alert('تم نسخ بيانات العميل إلى الحافظة.');
    }
  };

  const filteredRecords = records
    .map((record, index) => ({ record, originalIndex: index }))
    .filter(({ record }) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;
        return (
            record.sip.toLowerCase().includes(term) ||
            record.clientName.toLowerCase().includes(term) ||
            record.cin.toLowerCase().includes(term)
        );
    });

  const handleDeleteRequest = (index: number) => {
    setModalState({ isOpen: true, index: index });
  };

  const handleConfirmDelete = () => {
    if (modalState.index !== null) {
      onDelete(modalState.index);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, index: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">مرحباً في Fiber Tec</h1>
          <p className="text-lg text-gray-500">قاعدة بيانات العملاء.</p>
        </header>

        <main className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم، SIP، أو CIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-4 pl-10 text-lg bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SearchIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">
              إجمالي العملاء المسجلين: {records.length}
            </p>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map(({ record, originalIndex }) => (
                <div key={originalIndex} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center animate-fade-in">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{record.clientName}</h3>
                    <p className="text-gray-500">{record.sip}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(originalIndex)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label="تعديل">
                      <PencilIcon className="w-6 h-6" />
                    </button>
                     <button 
                      onClick={() => handleShare(record)} 
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                      aria-label="مشاركة"
                      disabled={isSharing}
                    >
                      <ShareIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleDeleteRequest(originalIndex)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="حذف">
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-md">
              <p className="text-center text-gray-500 py-10">
                لا توجد سجلات مطابقة لبحثك أو لم يتم إضافة أي سجلات بعد.
              </p>
            </div>
          )}
        </main>
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
};

export default HomePage;
