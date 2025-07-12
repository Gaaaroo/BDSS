import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { wholeChartData } from '../services/api/dashboardService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WholeChart() {
  const [wholeData, setWholeData] = useState();

  const fetchWholeChartData = async () => {
    const res = await wholeChartData();
    console.log('Whole chart API result:', res);
    setWholeData(res);
    try {
    } catch (error) {
      console.log(' err wwhen fetchWholeChartData', error);
    }
  };

  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const data = {
    labels: bloodTypes,
    datasets: [
      {
        label: 'Whole Blood Units',
        data: bloodTypes.map((type) => wholeData?.[type] ?? 0),
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
          '#EC4899',
          '#6366F1',
          '#14B8A6',
        ],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Whole Blood Distribution by Blood Type',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    fetchWholeChartData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <Bar data={data} options={options} />
    </div>
  );
}
