import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { myReceiveDetail } from '../services/api/bloodFormService';
import Navbar from './Navbar';
import { BannerMyActivity } from '../pages/MyActivity';
import { ChevronLeft } from 'lucide-react';
import ReceiveStepFlow from './ReceiveStepFlow';

export default function ReceiveDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await myReceiveDetail(id);
      let count = 0;
      for (const item of res.steps) {
        if (item.status === 'DONE') {
          count += 1;
        }
      }
      setStep(count);
      setDetail(res);
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
        <ReceiveStepFlow completedStepIndex={step} />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Detail Dornation Form</h2>
          <p>
            <strong>ID:</strong> {detail.id}
          </p>
          <p>
            <strong>Blood type:</strong> {detail.bloodType}
          </p>
          <p>
            <strong>Unit</strong> {detail.unit} đơn vị
          </p>
          <p>
            <strong>Date</strong> {detail.date}
          </p>
          <p>
            <strong>status:</strong> {detail.status}
          </p>
        </div>
      </div>
    </>
  );
}
