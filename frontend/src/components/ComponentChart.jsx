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
import { useEffect, useState } from 'react';
import { wholeComponentChart } from '../services/api/dashboardService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ComponentChart() {
  const [chartData, setChartData] = useState(null);

  const colors = {
    Whole: ['#fecaca', '#f87171', '#b91c1c'],
    Plasma: ['#bae6fd', '#60a5fa', '#1d4ed8'],
    RBCs: ['#bbf7d0', '#34d399', '#065f46'],
    WBCs: ['#ddd6fe', '#8b5cf6', '#4c1d95'],
    Platelets: ['#fef9c3', '#facc15', '#ca8a04'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await wholeComponentChart();
        const raw = res ?? [];

        const bloodTypes = raw.map((item) => item.bloodType);
        const datasets = [];

        raw.forEach((item, idx) => {
          const bloodTypeIndex = idx;

          for (const component in item) {
            if (component === 'bloodType') continue;

            const volumes = item[component];
            const colorSet = colors[component] || ['#ccc'];

            Object.entries(volumes).forEach(([volume, value], i) => {
              const label = `${component} ${volume}`;
              const color = colorSet[i] || colorSet[colorSet.length - 1];

              let dataset = datasets.find((ds) => ds.label === label);
              if (!dataset) {
                dataset = {
                  label,
                  data: Array(bloodTypes.length).fill(0),
                  backgroundColor: color,
                  stack: component,
                };
                datasets.push(dataset);
              }

              dataset.data[bloodTypeIndex] = value;
            });
          }
        });

        setChartData({
          labels: bloodTypes,
          datasets,
        });
      } catch (err) {
        console.error('Error loading component chart:', err);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 12,
        },
      },
      title: {
        display: true,
        text: 'Blood Inventory by Type, Component, and Volume',
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: 'Units' },
      },
    },
  };

  if (!chartData) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full mx-auto">
      <div className="h-[600px] flex justify-center items-center">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
