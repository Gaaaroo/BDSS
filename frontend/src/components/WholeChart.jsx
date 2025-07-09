import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WholeChart() {
  const data = {
    labels: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    datasets: [
      {
        label: 'Whole Blood Units',
        data: [10, 25, 15, 20, 5, 18, 3, 4],
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <Bar data={data} options={options} />
    </div>
  );
}
