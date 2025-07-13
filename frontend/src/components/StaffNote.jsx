import { UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DropdownButton from './DropdownButton';

export default function StaffNote({ notes }) {
  const [activeStep, setActiveStep] = useState('');
  const [current, setCurrent] = useState();
  useEffect(() => {
    console.log(notes);
  }, [notes]);

  const handleStep = (step) => {
    const tmp = notes.find((x) => x.stepNumber === step);
    if (tmp) {
      setActiveStep(tmp);
    }
    setCurrent(step);
  };

  useEffect(() => {
    if (notes.length > 0) {
      const maxStep = Math.max(...notes.map((x) => x.stepNumber));
      const maxStepNote = notes.find((x) => x.stepNumber === maxStep);
      if (maxStepNote) {
        setActiveStep(maxStepNote);
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
              {activeStep.updatedBy}
            </div>
            <div className="flex items-center gap-2 bg-white px-5 py-1.5 text-base font-bold rounded-full shadow text-red-800 tracking-wide border border-red-300">
              Date:{' '}
              {activeStep?.updatedAt
                ? activeStep.updatedAt.slice(0, 10)
                : activeStep}
            </div>
          </div>
          <DropdownButton
            onHandleStep={handleStep}
            steps={notes}
            current={current}
          />
        </div>

        <div className="p-4 min-h-[200px] text-gray-800 text-lg leading-relaxed bg-white rounded-b-3xl">
          {activeStep.note}
        </div>
      </div>
    </div>
  );
}
