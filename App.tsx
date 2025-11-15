import React, { useState, useEffect } from 'react';
import { Page, FormData } from './types';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import NewDataPage from './components/NewDataPage';
import DatabasePage from './components/DatabasePage';
import SettingsPage from './components/SettingsPage';
import Toast from './components/Toast';
import CameraScan from './components/CameraScan';
import LoginPage from './components/LoginPage';
import BottomNavBar from './components/BottomNavBar';

// For storing editing state
interface EditState {
  index: number;
  data: FormData;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [records, setRecords] = useState<FormData[]>([]);
  const [recordToEdit, setRecordToEdit] = useState<EditState | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);
  const [scannedData, setScannedData] = useState<Partial<FormData> | null>(null);
  const [apiKey, setApiKey] = useState<string>('');


  useEffect(() => {
    // Show splash screen for a minimum duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Load data from localStorage on initial load
    try {
      const savedRecords = localStorage.getItem('fiberTecRecords');
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }
      const savedApiKey = localStorage.getItem('geminiApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }

    return () => clearTimeout(timer);
  }, []);

  // Save data to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem('fiberTecRecords', JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save records to localStorage", error);
    }
  }, [records]);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Hide after 3 seconds
  };
  
  const saveApiKey = (key: string) => {
    localStorage.setItem('geminiApiKey', key);
    setApiKey(key);
    showToast('تم حفظ مفتاح API بنجاح!', 'success');
  };

  const clearApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    showToast('تم مسح مفتاح API.', 'success');
  };

  const navigateTo = (page: Page) => {
    // When navigating to NewData from anywhere else but the database "edit" button, clear the edit state.
    if (page === Page.NewData && currentPage !== Page.Database && currentPage !== Page.CameraScan) {
        setRecordToEdit(null);
    }
    setCurrentPage(page);
  };
  
  const goHome = () => {
    setCurrentPage(Page.Home);
  };

  const handleSaveRecord = (newRecord: FormData): boolean => {
    const isDuplicate = records.some(
      (record) => record.sip.trim() === newRecord.sip.trim() && record.sip.trim() !== ''
    );
    if (isDuplicate) {
      showToast('رقم SIP هذا موجود بالفعل!', 'error');
      return false;
    }
    setRecords(prevRecords => [...prevRecords, newRecord]);
    showToast('تم حفظ البيانات بنجاح!', 'success');
    return true;
  };

  const handleUpdateRecord = (index: number, updatedData: FormData) => {
    const isDuplicate = records.some(
      (record, i) =>
        record.sip.trim() === updatedData.sip.trim() &&
        updatedData.sip.trim() !== '' &&
        i !== index
    );
    if (isDuplicate) {
      showToast('رقم SIP هذا موجود بالفعل!', 'error');
      return;
    }

    setRecords(prevRecords => {
      const newRecords = [...prevRecords];
      newRecords[index] = updatedData;
      return newRecords;
    });
    showToast('تم تحديث البيانات بنجاح!', 'success');
    setRecordToEdit(null);
    navigateTo(Page.Database);
  };
  
  const handleStartEdit = (index: number) => {
    setRecordToEdit({ index, data: records[index] });
    navigateTo(Page.NewData);
  };

  const handleDeleteRecord = (index: number) => {
    setRecords(prevRecords => prevRecords.filter((_, i) => i !== index));
  };

  const handleBackFromForm = () => {
    if (recordToEdit) {
      setRecordToEdit(null);
      navigateTo(Page.Database);
    } else {
      goHome();
    }
  };

  const handleRestoreData = (restoredRecords: FormData[]) => {
    if (Array.isArray(restoredRecords) && restoredRecords.every(r => typeof r === 'object' && r !== null && 'clientName' in r && 'sip' in r)) {
      setRecords(restoredRecords);
      showToast('تم استعادة البيانات بنجاح!', 'success');
    } else {
      showToast('ملف النسخ الاحتياطي غير صالح.', 'error');
    }
  };

  const handleClearAllData = () => {
    setRecords([]);
    showToast('تم مسح جميع البيانات بنجاح!', 'success');
  };

  const handleScanSuccess = (data: Partial<FormData>) => {
    setScannedData(data);
    navigateTo(Page.NewData);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const pagesWithNavBar = [Page.Home, Page.Database, Page.Settings];

  const renderPage = () => {
    switch (currentPage) {
      case Page.NewData:
        return (
          <NewDataPage 
            onBack={handleBackFromForm} 
            onSave={handleSaveRecord} 
            onUpdate={handleUpdateRecord}
            recordToEdit={recordToEdit}
            showToast={showToast}
            navigateTo={navigateTo}
            scannedData={scannedData}
            clearScannedData={() => setScannedData(null)}
            apiKey={apiKey}
          />
        );
      case Page.Database:
        return (
            <DatabasePage 
                onBack={goHome} 
                records={records} 
                onEdit={handleStartEdit}
                onDelete={handleDeleteRecord}
            />
        );
      case Page.Settings:
        return <SettingsPage 
          onBack={goHome} 
          records={records}
          onRestore={handleRestoreData}
          onClearAll={handleClearAllData}
          showToast={showToast}
          apiKey={apiKey}
          onSaveApiKey={saveApiKey}
          onClearApiKey={clearApiKey}
        />;
      case Page.CameraScan:
        return <CameraScan
          onBack={() => navigateTo(Page.NewData)}
          onScanSuccess={handleScanSuccess}
          showToast={showToast}
        />;
      case Page.Home:
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };
  
  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }
    return (
      <>
        {renderPage()}
        {pagesWithNavBar.includes(currentPage) && (
          <BottomNavBar currentPage={currentPage} navigateTo={navigateTo} />
        )}
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Splash Screen Layer */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <SplashScreen />
      </div>

      {/* Main Content Layer */}
      <div
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {!isLoading && renderContent()}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
          @keyframes toast-in {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          .animate-toast-in {
            animation: toast-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
       `}</style>
    </div>
  );
};

export default App;