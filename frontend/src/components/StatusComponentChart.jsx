import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { statusComponent } from '../services/api/dashboardService';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusComponentChart() {
  const [statusData, setStatusData] = useState({});

  const fetchStatusComponentData = async () => {
    const res = await statusComponent();
    setStatusData(res);
    try {
    } catch (error) {
      console.log(' err wwhen fetchStatusComponentData', error);
    }
  };

  const status = ['Used', 'Stored', 'Expired'];
  const data = {
    labels: ['Used', 'Stored', 'Expired'],
    datasets: [
      {
        label: 'Component',
        data: status.map((type) => statusData?.[type] ?? 0),
        backgroundColor: ['#EF4444', '#10B981', '#6B7280'],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    fetchStatusComponentData();
  }, []);
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="w-1/2 mx-auto">
        <h2 className="text-center font-semibold mb-4">
          Blood Component Inventory Status
        </h2>
        <Doughnut data={data} />
      </div>
    </div>
  );
}
