import { UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DropdownButton from './DropdownButton';

export default function StaffNote({ dateUpdate, nameStaff, notes }) {
  const [activeNote, setActiveNote] = useState('');
  const [current, setCurrent] = useState();
  useEffect(() => {
    console.log(notes);
  }, [notes]);

  const handleStep = (step) => {
    const activeStep = notes.find((x) => x.stepNumber === step);
    if (activeStep) {
      setActiveNote(activeStep.note);
    }
    setCurrent(step);
  };

  useEffect(() => {
    if (notes.length > 0) {
      const maxStep = Math.max(...notes.map((x) => x.stepNumber));
      const maxStepNote = notes.find((x) => x.stepNumber === maxStep);
      if (maxStepNote) {
        setActiveNote(maxStepNote.note);
      }
      setCurrent(maxStep);
    }
  }, []);

  return (
    <div className="px-[150px] p-10 pb-15">
      <div className="w-full mx-auto bg-white border-1 border-red-500 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-8 py-2 bg-gradient-to-r from-red-100 via-red-50 to-white rounded-t-md border-b border-red-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white px-5 py-1.5 text-base font-bold rounded-full shadow text-red-800 tracking-wide border border-red-300">
              <UserRound strokeWidth={3} />
              {nameStaff}
            </div>
            <div className="flex items-center gap-2 bg-white px-5 py-1.5 text-base font-bold rounded-full shadow text-red-800 tracking-wide border border-red-300">
              Date: {dateUpdate}
            </div>
          </div>
          <DropdownButton
            onHandleStep={handleStep}
            steps={notes}
            current={current}
          />
        </div>

        <div className="p-4 min-h-[200px] text-gray-800 text-lg leading-relaxed bg-white rounded-b-3xl">
          {activeNote}
        </div>
      </div>
    </div>
  );
}
