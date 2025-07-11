import React, { useEffect, useState } from 'react';
import TotalCard from '../components/TotalCard';
import RecentDonors from '../components/RecentDonors';
import WholeChart from '../components/WholeChart';
import StatusChart from '../components/StatusChart';
import ComponentChart from '../components/ComponentChart';
import {
  countAllDonors,
  countAllReceive,
  countDonorsByBloodType,
  countDonorsToday,
  countSeekersToday,
} from '../services/api/dashboardService';
import DonorChart from '../components/StaticsFormChart';
import SeekerComponentChart from '../components/SeekercomponentChart';
import StaticsFormChart from '../components/StaticsFormChart';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [totalDonors, setTotalDonors] = useState();
  const [totalSeekers, setTotalSeekers] = useState();
  const [totalDonorsToday, setTotalDonorsToday] = useState();
  const [totalSeekersToday, setTotalSeekersToday] = useState();

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const [
          totalDonorsRes,
          totalSeekersRes,
          donorsTodayRes,
          seekersTodayRes,
          bloodCountsRes,
        ] = await Promise.all([
          countAllDonors(),
          countAllReceive(),
          countDonorsToday(),
          countSeekersToday(),
          countDonorsByBloodType(),
        ]);

        setTotalDonors(totalDonorsRes);
        setTotalSeekers(totalSeekersRes);
        setTotalDonorsToday(donorsTodayRes);
        setTotalSeekersToday(seekersTodayRes);

        const formattedBlood = Object.entries(bloodCountsRes).map(
          ([key, value]) => ({
            label: key,
            count: value,
          })
        );
        setData(formattedBlood);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchAllDashboardData();
  }, []);

  const donorsByBloodType = data;

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
            title="Total Donors"
            total={totalDonors}
            totalToday={totalDonorsToday}
            data={donorsByBloodType}
            color="bg-blue-100"
          />
          <TotalCard
            title="Total Seekers"
            total={totalSeekers}
            totalToday={totalSeekersToday}
            data={[]}
            color="bg-pink-100"
          />
          <TotalCard
            title="In Stock"
            total={130}
            data={[]}
            color="bg-green-100"
          />
          <TotalCard title="Blogs" total={10} data={[]} color="bg-amber-100" />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-5">
          <StaticsFormChart />
          <SeekerComponentChart />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StatusChart />
          <WholeChart />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <RecentDonors donors={donors} />
          <ComponentChart />
        </div>
      </div>
    </div>
  );
}
