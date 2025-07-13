import React, { useEffect, useState } from 'react';
import TotalCard from '../components/TotalCard';
import ComponentChart from '../components/ComponentChart';
import {
  countAllBlog,
  countAllDonors,
  countAllReceive,
  countDonorsByBloodType,
  countDonorsToday,
  countSeekersToday,
  countWholeBloodUnit,
} from '../services/api/dashboardService';
import SeekerComponentChart from '../components/SeekercomponentChart';
import StaticsFormChart from '../components/StaticsFormChart';
import StatusWholeChart from '../components/StatusWholeChart';
import StatusComponentChart from '../components/StatusComponentChart';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [totalDonors, setTotalDonors] = useState();
  const [totalSeekers, setTotalSeekers] = useState();
  const [totalDonorsToday, setTotalDonorsToday] = useState();
  const [totalSeekersToday, setTotalSeekersToday] = useState();
  const [totalWhole, setTotalWhole] = useState();
  const [totalBlogs, setTotalBlogs] = useState();

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const [
          totalDonorsRes,
          totalSeekersRes,
          totalWholesRes,
          totalBlogsRes,
          donorsTodayRes,
          seekersTodayRes,
          bloodCountsRes,
        ] = await Promise.all([
          countAllDonors(),
          countAllReceive(),
          countWholeBloodUnit(),
          countAllBlog(),
          countDonorsToday(),
          countSeekersToday(),
          countDonorsByBloodType(),
        ]);

        setTotalDonors(totalDonorsRes);
        setTotalSeekers(totalSeekersRes);
        setTotalDonorsToday(donorsTodayRes);
        setTotalSeekersToday(seekersTodayRes);
        setTotalWhole(totalWholesRes);
        setTotalBlogs(totalBlogsRes);

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
            title="Total Blood Donors"
            total={totalDonors}
            totalToday={`Today: ${totalDonorsToday}`}
            data={donorsByBloodType}
            color="bg-blue-100"
          />
          <TotalCard
            title="Total Blood Seekers"
            total={totalSeekers}
            totalToday={`Today: ${totalSeekersToday}`}
            data={[]}
            color="bg-pink-100"
          />
          <TotalCard
            title="Total Whole Blood"
            total={totalWhole}
            data={[]}
            color="bg-green-100"
          />
          <TotalCard
            title="Total Blogs"
            total={totalBlogs}
            data={[]}
            color="bg-amber-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <StaticsFormChart />
          <SeekerComponentChart />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatusWholeChart />
          <StatusComponentChart />
          {/* <WholeChart /> */}
        </div>
        {/* <div className="grid grid-cols-2 gap-6">
          <RecentDonors donors={donors} />
        </div> */}
        <div className="my-5">
          <ComponentChart />
        </div>
      </div>
    </div>
  );
}
