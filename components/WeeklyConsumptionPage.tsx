import React from 'react';
import PageWrapper from './PageWrapper';

interface WeeklyConsumptionPageProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface ConsumptionRecord {
  day: string;
  date: string;
  sip: string;
  cableLength: string;
}

// Mock data based on the provided image
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

const WeeklyConsumptionPage: React.FC<WeeklyConsumptionPageProps> = ({ onBack, showToast }) => {
  return (
    <PageWrapper title="الاستهلاك الأسبوعي" onBack={onBack}>
      <div className="max-w-lg mx-auto">
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
    </PageWrapper>
  );
};

export default WeeklyConsumptionPage;