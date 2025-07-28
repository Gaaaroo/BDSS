import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myReceiveDetail } from '../services/api/bloodFormService';
import Navbar from './Navbar';
import { BannerMyActivity } from '../pages/MyActivity';
import { ChevronLeft } from 'lucide-react';
import ReceiveStepFlow from './ReceiveStepFlow';
import TextInput from './TextInput';
import StaffNote from './StaffNote';
import Footer from './Footer';
import LoadingPage from './LoadingPage';

export default function ReceiveDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState([]);
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
      setNotes(res.steps.filter((x) => x.status == 'DONE'));
      setStep(count);
      setDetail(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const d = new Date(dateTimeStr);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!detail || detail.length === 0)
    return (
      <div className="p-4 text-red-600">No blood form requests found.</div>
    );

  return (
    <>
      <Navbar mode="" />
      <BannerMyActivity />
      <div
        className="flex p-5 pb-0 pl-20 text-gray-600 font-bold cursor-pointer hover:underline"
        onClick={() => {
          navigate('/my-activity', { state: { status: detail.status } });
        }}
      >
        <ChevronLeft />
        BACK
      </div>
      <div className="flex-1 justify-start h-12">
        <section className="bg-white relative">
          <img
            src="https://www.shutterstock.com/image-vector/red-blood-drop-cartoon-character-600nw-2521441917.jpg"
            alt=""
            className="absolute left-0 top-1/2 -translate-y-1/2 w-75 object-contain opacity-30 pointer-events-none select-none hidden md:block"
            style={{ zIndex: 0 }}
          />
          <img
            src="https://www.shutterstock.com/image-vector/cute-happy-smiling-blood-drop-600nw-1448123303.jpg"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-83 object-contain opacity-30 pointer-events-none select-none hidden md:block"
            style={{ zIndex: 0 }}
          />
          <ReceiveStepFlow completedStepIndex={step} />
        </section>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-400 my-5 text-center tracking-tight">
          Details Reception Blood #ID: {detail.receiveId}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-[150px]">
          {/* Left Column */}
          <div className="space-y-4">
            <TextInput
              label="Full Name"
              readOnly
              value={detail.user.fullName}
            />
            <TextInput label="Date of Birth" readOnly value={detail.user.dob} />
            <TextInput label="Phone" readOnly value={detail.user.phone} />
            <TextInput
              label="Blood Type request"
              readOnly
              value={detail.bloodType}
            />
            <TextInput label="Volume (ml)" readOnly value={detail.volume} />
            <TextInput label="Priority" readOnly value={detail.priority} />
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <TextInput label="Gender" readOnly value={detail.user.gender} />
            <TextInput label="Email" readOnly value={detail.user.email} />
            <TextInput
              label="Hospital Address"
              readOnly
              value={detail.hospitalAddress}
            />
            <TextInput
              label="Component Type request"
              value={detail.componentType}
              readOnly
            />
            <TextInput label="Quantity" value={detail.quantity} readOnly />
            <TextInput
              label="Required date"
              value={formatDateTime(detail.requiredDate)}
              readOnly
            />
          </div>
        </div>
        <StaffNote notes={notes} />
        <Footer />
      </div>
    </>
  );
}
