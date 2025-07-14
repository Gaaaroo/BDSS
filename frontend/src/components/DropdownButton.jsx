import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

//Staff note dropdown button
export default function DropdownButton({ onHandleStep, steps, current }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-red-200 px-5 py-1.5 text-base font-bold rounded-full shadow text-red-800 tracking-wide border border-red-300"
      >
        Staff Note {current}
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                onHandleStep(step.stepNumber);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Step {step.stepNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
