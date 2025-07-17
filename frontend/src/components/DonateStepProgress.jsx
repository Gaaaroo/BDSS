import React, { useState, useEffect } from 'react';
import { updateDonationProcessStep } from '../services/api/bloodRequestService';
import { addBloodUnit } from '../services/api/bloodUnitService';

const stepNames = [
  'Register for blood donation',
  'Health check-up and consultation',
  'Blood testing',
  'Blood donation',
  'Rest after donation',
];

const statusColor = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  DONE: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function StepProgress({
  steps,
  onReload,
  donateId,
  onReloadTable,
  bloodUnit,
}) {
  const [openStepIdx, setOpenStepIdx] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    steps[openStepIdx]?.status || 'PENDING'
  );

  const [note, setNote] = useState(steps[openStepIdx]?.note || '');
  const [loading, setLoading] = useState(false);

  const [showVolumeInput, setShowVolumeInput] = useState(false);
  const [volume, setVolume] = useState('');

  const handleAddBloodUnit = async () => {
    if (!volume || isNaN(volume) || Number(volume) <= 0) {
      alert('Please enter a valid volume!');
      return;
    }

    try {
      await addBloodUnit({
        donateId,
        volume: Number(volume),
      });
      console.log();
      alert('Blood unit added successfully!');
      setShowVolumeInput(false);
    } catch (error) {
      alert(error?.response?.data?.message || 'Error adding blood unit');
    }
  };

  const handleShowVolumeInput = () => {
    setShowVolumeInput(true);
    setVolume(bloodUnit?.volume || '');
  };

  useEffect(() => {
    if (openStepIdx !== null) {
      setNote(steps[openStepIdx]?.note || '');
    }
  }, [openStepIdx, steps]);

  useEffect(() => {
    if (openStepIdx !== null) {
      setSelectedStatus(steps[openStepIdx]?.status || 'PENDING');
    }
  }, [openStepIdx, steps]);

  const handleUpdate = async () => {
    // Check previous steps
    const allPrevDone = steps
      .slice(0, openStepIdx)
      .every((step) => step.status === 'DONE');
    // Check next steps
    const allNextPending = steps
      .slice(openStepIdx + 1)
      .every((step) => !step.status || step.status === 'PENDING');

    // If it's the first step
    if (openStepIdx === 0) {
      if (!allNextPending) {
        alert('All following steps must be PENDING!');
        setLoading(false);
        return;
      }
    }
    // If it's the last step
    else if (openStepIdx === steps.length - 1) {
      if (!allPrevDone) {
        alert('All previous steps must be DONE!');
        setLoading(false);
        return;
      }
    }
    // Any step in the middle
    else {
      if (!allPrevDone || !allNextPending) {
        alert(
          'All previous steps must be DONE and all following steps must be PENDING!'
        );
        setLoading(false);
        return;
      }
    }

    // If all conditions are met, allow update
    try {
      await updateDonationProcessStep({
        donateId,
        stepNumber: openStepIdx + 1,
        status: selectedStatus,
        note,
      });
      await onReload();
      if (onReloadTable) {
        await onReloadTable();
      }
      setOpenStepIdx(null);
    } catch (error) {
      alert(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#FDE4E4] rounded-xl shadow-lg px-4 pt-3 pb-[18px]">
      <h2 className="text-xl font-bold mb-4 text-center text-black">
        Step Progress
      </h2>
      <div className="space-y-4">
        {stepNames.map((name, idx) => {
          const step = steps[idx] || {};
          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer transition border
                ${
                  step.status === 'DONE'
                    ? 'bg-green-100 border-green-300'
                    : step.status === 'FAILED'
                    ? 'bg-red-100 border-red-300'
                    : step.status || 'PENDING' === 'PENDING'
                    ? 'bg-yellow-100 border-yellow-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              onClick={() => setOpenStepIdx(idx)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold border
                    ${
                      step.status === 'DONE'
                        ? 'bg-green-400 text-white border-green-400'
                        : step.status === 'FAILED'
                        ? 'bg-red-400 text-white border-red-400'
                        : step.status || 'PENDING' === 'PENDING'
                        ? 'bg-yellow-400 text-white border-yellow-400'
                        : 'bg-gray-300 text-gray-600 border-gray-300'
                    }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`font-semibold text-base ${
                    step.status === 'DONE'
                      ? 'text-green-700'
                      : step.status === 'FAILED'
                      ? 'text-red-700'
                      : step.status || 'PENDING' === 'PENDING'
                      ? 'text-yellow-700'
                      : 'text-gray-700'
                  }`}
                >
                  {name}
                </span>
              </div>
              <span
                className={`capitalize font-bold px-3 py-1 rounded-full text-sm text-center w-24
                  ${
                    step.status === 'DONE'
                      ? 'bg-green-200 text-green-700'
                      : step.status === 'FAILED'
                      ? 'bg-red-200 text-red-700'
                      : step.status || 'PENDING' === 'PENDING'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {step.status || 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>

      {steps[3]?.status === 'DONE' && (
        <>
          <button
            className="mt-4 px-3 py-2 hover:bg-text-red-600 bg-[#F76C6C] hover:scale-105 transition-transform duration-200 hover:text-white text-white rounded-[50px] font-semibold block mx-auto"
            onClick={handleShowVolumeInput}
          >
            Add blood to inventory
          </button>
          {showVolumeInput && (
            <div className="fixed inset-0 bg-black/30 z-40">
              <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md relative mx-2">
                  <button
                    className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
                    onClick={() => setShowVolumeInput(false)}
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-bold mb-3 text-black text-center">
                    Select Blood Volume (ml)
                  </h3>
                  <div className="mt-8 flex gap-2 justify-center">
                    {[250, 350, 450].map((v) => (
                      <span
                        key={v}
                        className={`px-1 py-1 rounded-full font-semibold w-24 text-center inline-block cursor-pointer transition
                ${
                  Number(volume) === v
                    ? 'bg-[#F76C6C] text-white'
                    : 'bg-gray-200 text-gray-700'
                }
              `}
                        onClick={() => setVolume(v)}
                      >
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-8 justify-center">
                    <button
                      className="px-4 py-1 text-white rounded font-semibold w-20 flex items-center justify-center
                      bg-[#F76C6C] hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onClick={handleAddBloodUnit}
                      disabled={!!bloodUnit?.volume}
                    >
                      Confirm
                    </button>
                    <button
                      className="px-4 py-1 bg-gray-300 text-black rounded font-semibold w-20 flex items-center justify-center
                      hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onClick={() => setShowVolumeInput(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal chi tiết step */}
      {openStepIdx !== null && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30 z-40"></div>
          {/* Modal content */}
          <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md relative mx-2">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setOpenStepIdx(null)}
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-3 text-black">
                {stepNames[openStepIdx]}
              </h3>
              {/*Set status*/}
              <div className="mb-3 flex gap-2 justify-center">
                {['PENDING', 'DONE', 'FAILED'].map((status) => (
                  <span
                    key={status}
                    className={`px-3 py-1 rounded-full font-semibold w-24 text-center inline-block cursor-pointer transition
        ${
          selectedStatus === status
            ? statusColor[status]
            : 'bg-gray-200 text-gray-400'
        }
      `}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </span>
                ))}
              </div>

              <div className="mb-3">
                <div className="font-semibold mb-1 text-left text-black">
                  Note
                </div>
                <textarea
                  value={note}
                  className="border rounded p-2 min-h-[40px] bg-gray-50 text-black w-full"
                  placeholder="Enter note here..."
                  onChange={(e) => setNote(e.target.value)}
                >
                  {note}
                </textarea>
              </div>
              <button
                className="px-4 py-2 bg-[#F9B3B3] hover:bg-[#F76C6C] text-white rounded-[50px] font-semibold block mx-auto"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
