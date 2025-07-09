import React from 'react';
import TotalCard from '../components/TotalCard';
import RecentDonors from '../components/RecentDonors';
import WholeChart from '../components/WholeChart';
import StatusChart from '../components/StatusChart';
import ComponentChart from '../components/ComponentChart';

export default function Dashboard() {
  const requested = [
    { label: 'O-', count: 8 },
    { label: 'O+', count: 2 },
    { label: 'A-', count: 1 },
  ];

  const donors = [
    {
      name: 'Basil Mathews',
      date: '17 May 2020',
      bloodType: 'O+',
      image:
        'https://down-vn.img.susercontent.com/file/4ecc0b21d86d2ff90688c0c28cc6ad0a',
    },
    {
      name: 'Elizabeth Olsen',
      date: '17 May 2020',
      bloodType: 'B-',
      image:
        'https://i.pinimg.com/736x/60/4b/fd/604bfd3d032a0b0b4be92c859a982129.jpg',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-3 bg-gray-100">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <TotalCard
            title="Requested"
            total={20}
            date="18 May 2020"
            data={requested}
            color="bg-blue-100"
          />
          <TotalCard
            title="Received"
            total={12}
            date="18 May 2020"
            data={requested}
            color="bg-pink-100"
          />
          <TotalCard
            title="In Stock"
            total={130}
            date="18 May 2020"
            data={requested}
            color="bg-green-100"
          />
          <TotalCard
            title="Blogs"
            total={10}
            date="18 May 2020"
            data={requested}
            color="bg-amber-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StatusChart />
          <WholeChart />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <RecentDonors donors={donors} />
          <ComponentChart />
          {/* <MapSection /> */}
        </div>

        <div className="mt-6">{/* <ChartSection /> */}</div>
      </div>
    </div>
  );
}
