import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { myDonateDetail } from '../services/api/bloodFormService';
import Navbar from './Navbar';
import { BannerMyActivity } from '../pages/MyActivity';
import DonationStepFlow from './DonationStepFlow';
import { ChevronLeft } from 'lucide-react';
import TextInput from './TextInput';
import StaffNote from './StaffNote';

export default function DonationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await myDonateDetail(id);
      console.log('Donor myForm:', res.steps);
      let count = 0;
      for (const item of res.steps) {
        if (item.status === 'DONE') {
          count += 1;
        }
      }
      console.log(count);
      setStep(count);
      setDetail(res);
      console.log('Detail form:', res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (!detail || detail.length === 0)
    return (
      <div className="p-4 text-red-600">No blood form requests found.</div>
    );

  return (
    <>
      <Navbar mode="" />
      <BannerMyActivity />
      <div
        className="flex p-5 pb-0 pl-20 text-gray-600 font-bold cursor-pointer"
        onClick={() => navigate(-1, { state: { refresh: true } })}
      >
        <ChevronLeft />
        BACK
      </div>
      <div className="flex-1 justify-start h-12">
        <DonationStepFlow completedStepIndex={step} />
        <StaffNote />
      </div>
    </>
  );
}
