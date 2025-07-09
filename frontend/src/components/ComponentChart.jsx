import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ComponentChart() {
  const labels = [
    'Dec 01',
    'Dec 02',
    'Dec 03',
    'Dec 04',
    'Dec 05',
    'Dec 06',
    'Dec 07',
  ];

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Requested',
        data: [12, 19, 14, 10, 17, 13, 15],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        type: 'line',
        label: 'Plasma',
        data: [20, 25, 22, 24, 28, 26, 23],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
      {
        type: 'line',
        label: 'RBCs',
        data: [30, 35, 40, 38, 33, 36, 34],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
      {
        type: 'line',
        label: 'WBCs',
        data: [18, 20, 19, 22, 21, 23, 20],
        borderColor: '#8b5cf6',
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 2,
      },
      {
        type: 'line',
        label: 'Platelets',
        data: [25, 27, 26, 30, 29, 28, 26],
        borderColor: '#f59e0b',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Blood Component Levels & Requests',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-[1200px] mx-auto">
      <div className="relative h-[500px]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
