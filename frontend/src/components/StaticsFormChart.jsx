import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getDonorsStatics,
  getReceiveStatics,
} from '../services/api/dashboardService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StaticsFormChart() {
  const [period, setPeriod] = useState('day');
  const [labels, setLabels] = useState([]);
  const [donorCounts, setDonorCounts] = useState([]);
  const [seekerCounts, setSeekerCounts] = useState([]);

  const fetchData = async (mode) => {
    try {
      const [donorRes, seekerRes] = await Promise.all([
        getDonorsStatics(mode),
        getReceiveStatics(mode),
      ]);

      const donorObj = donorRes || {};
      const seekerObj = seekerRes || {};

      // Lấy tất cả label duy nhất từ cả 2
      const allLabels = Array.from(
        new Set([...Object.keys(donorObj), ...Object.keys(seekerObj)])
      ).sort(); // Sắp xếp tăng dần nếu muốn

      const donorValues = allLabels.map((label) => donorObj[label] || 0);
      const seekerValues = allLabels.map((label) => seekerObj[label] || 0);

      setLabels(allLabels);
      setDonorCounts(donorValues);
      setSeekerCounts(seekerValues);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Donors',
        data: donorCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
        barThickness: 30,
      },
      {
        label: 'Seekers',
        data: seekerCounts,
        backgroundColor: 'rgba(244, 63, 94, 0.7)', // rose
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Donors vs Seekers - {period.toUpperCase()}
        </h2>
        <div className="space-x-2">
          {['day', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-sm ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
