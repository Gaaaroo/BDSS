import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { statusWhole } from '../services/api/dashboardService';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusWholeChart() {
  const [statusData, setStatusData] = useState({});

  const fetchStatusWholeData = async () => {
    const res = await statusWhole();
    console.log('Whole chart API result:', res);
    setStatusData(res);
    try {
    } catch (error) {
      console.log(' err wwhen fetchWholetData', error);
    }
  };

  const status = ['Used', 'Stored', 'Expired', 'Separated'];

  const data = {
    labels: ['Used', 'Stored', 'Expired', 'Separated'],
    datasets: [
      {
        label: 'Whole',
        data: status.map((type) => statusData?.[type] ?? 0),
        backgroundColor: ['#EF4444', '#10B981', '#6B7280', '#FACC15'],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    fetchStatusWholeData();
  }, []);
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="w-1/2 mx-auto">
        <h2 className="text-center font-semibold mb-4">
          Blood Whole Inventory Status
        </h2>
        <Doughnut data={data} />
      </div>
    </div>
  );
}
