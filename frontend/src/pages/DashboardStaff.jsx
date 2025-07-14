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
  recentDonors,
  recentSeekers,
} from '../services/api/dashboardService';
import SeekerComponentChart from '../components/SeekercomponentChart';
import StaticsFormChart from '../components/StaticsFormChart';
import StatusWholeChart from '../components/StatusWholeChart';
import StatusComponentChart from '../components/StatusComponentChart';
import RecentList from '../components/RecentDonors';
import WholeChart from '../components/WholeChart';

export default function DashboardStaff() {
  const [data, setData] = useState([]);
  const [totalDonors, setTotalDonors] = useState();
  const [totalSeekers, setTotalSeekers] = useState();
  const [totalDonorsToday, setTotalDonorsToday] = useState();
  const [totalSeekersToday, setTotalSeekersToday] = useState();
  const [totalWhole, setTotalWhole] = useState();
  const [totalBlogs, setTotalBlogs] = useState();
  const [recentDataDonors, setRecentDataDonors] = useState([]);
  const [recentDataSeekers, setRecentDataSeekrs] = useState([]);

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
          recentDonorsRes,
          recentSeekersRes,
        ] = await Promise.all([
          countAllDonors(),
          countAllReceive(),
          countWholeBloodUnit(),
          countAllBlog(),
          countDonorsToday(),
          countSeekersToday(),
          countDonorsByBloodType(),
          recentDonors(),
          recentSeekers(),
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
        const formattedRecentDonors = Object.entries(recentDonorsRes).map(
          ([name, info]) => ({
            name, // key
            bloodType: info.bloodType,
            requestDate: info.requestDate,
          })
        );
        setRecentDataDonors(formattedRecentDonors);
        const formattedRecentSeekers = Object.entries(recentSeekersRes).map(
          ([name, info]) => ({
            name, // key
            bloodType: info.bloodType,
            requestDate: info.requestDate,
          })
        );
        setRecentDataSeekrs(formattedRecentSeekers);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchAllDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-3 bg-gray-100">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <TotalCard
            title="Total Blood Donors"
            total={totalDonors}
            totalToday={`Today: ${totalDonorsToday}`}
            data={data}
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
        <div className="grid grid-cols-4 gap-6 mb-5">
          <div className="col-span-1">
            <RecentList
              list={recentDataDonors}
              title="Recent Blood Donors"
              color="bg-rose-100"
            />
          </div>
          <div className="col-span-1">
            <RecentList
              list={recentDataSeekers}
              title="Recent Blood Seekers"
              color="bg-blue-100"
            />
          </div>
          <div className="col-span-2">
            <WholeChart />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <StatusWholeChart />
          <StatusComponentChart />
        </div>
        <div className="my-5">
          <ComponentChart />
        </div>
      </div>
    </div>
  );
}
