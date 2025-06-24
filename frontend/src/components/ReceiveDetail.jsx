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

export default function ReceiveDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [note, setNote] = useState();
  const [nameStaff, setNameStaff] = useState();
  const [date, setDate] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await myReceiveDetail(id);
      let count = 0;
      let currentNote = '';
      let nameStaff = '';
      let date = '';
      for (const item of res.steps) {
        if (item.status === 'DONE') {
          count += 1;
          if (item.note && item.updatedBy && item.updatedAt) {
            currentNote = item.note || '';
            nameStaff = item.updatedBy;
            date = item.updatedAt;
          }
        }
      }
      setStep(count);
      setNote(currentNote);
      setNameStaff(nameStaff);
      setDate(date);
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
              onChange={() => {}}
              value={detail.user.fullName}
            />
            <TextInput
              label="Date of Birth"
              onChange={() => {}}
              value={detail.user.dob}
            />
            <TextInput
              label="Phone"
              onChange={() => {}}
              value={detail.user.phone}
            />
            <TextInput
              label="Blood Type request"
              onChange={() => {}}
              value={detail.bloodType}
            />
            <TextInput
              label="Volume (ml)"
              onChange={() => {}}
              value={detail.volume}
            />
            <TextInput
              label="Priority"
              onChange={() => {}}
              value={detail.priority}
            />
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <TextInput
              label="Gender"
              onChange={() => {}}
              value={detail.user.gender}
            />
            <TextInput
              label="Email"
              onChange={() => {}}
              value={detail.user.email}
            />
            <TextInput
              label="Hospital Address"
              onChange={() => {}}
              value={detail.hospitalAddress}
            />
            <TextInput
              label="Component Type request"
              value={detail.componentType}
              onChange={() => {}}
            />
            <TextInput
              label="Quantity"
              value={detail.quantity}
              onChange={() => {}}
            />
          </div>
        </div>
        <StaffNote
          noteStaff={note}
          dateUpdate={date.slice(0, 10)}
          nameStaff={nameStaff}
        />
        <Footer />
      </div>
    </>
  );
}
