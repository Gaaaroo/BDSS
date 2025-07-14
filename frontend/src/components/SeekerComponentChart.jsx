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
import { listReceiveByBloodTypeAndComponentType } from '../services/api/dashboardService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SeekerComponentChart() {
  const [chartData, setChartData] = useState(null);

  const COLORS = {
    Whole: 'rgba(59, 130, 246, 0.7)',
    Plasma: 'rgba(16, 185, 129, 0.7)',
    Platelets: 'rgba(255, 189, 0, 0.67)',
    RBC: 'rgba(255, 220, 238, 0.8)',
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await listReceiveByBloodTypeAndComponentType();

      const bloodTypes = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

      const datasets = Object.keys(res).map((component) => ({
        label: component,
        data: bloodTypes.map((type) => res[component][type] || 0),
        backgroundColor: COLORS[component],
        stack: 'seekers', //chồng lên nhau
      }));

      setChartData({
        labels: bloodTypes,
        datasets,
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#1f2937',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Seekers by Component & Blood Type
      </h2>
      {chartData && (
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
