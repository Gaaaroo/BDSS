import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { statusBloodUnit } from '../services/api/dashboardService';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusChart() {
  const [statusData, setStatusData] = useState({});

  const fetchStatusChartData = async () => {
    const res = await statusBloodUnit();
    console.log('Whole chart API result:', res);
    setStatusData(res);
    try {
    } catch (error) {
      console.log(' err wwhen fetchWholeChartData', error);
    }
  };

  const status = ['Used', 'Stored', 'Expired', 'Separated'];

  const data = {
    labels: ['Used', 'Stored', 'Expired', 'Separated'],
    datasets: [
      {
        label: 'My First Dataset',
        data: status.map((type) => statusData?.[type] ?? 0),
        backgroundColor: ['#EF4444', '#10B981', '#6B7280', '#FACC15'],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    fetchStatusChartData();
  }, []);
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="w-1/2 mx-auto">
        <h2 className="text-center font-semibold mb-4">
          Blood Inventory Status
        </h2>
        <Doughnut data={data} />
      </div>
    </div>
  );
}
