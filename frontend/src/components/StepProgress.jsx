import React, { useState } from "react";

const stepNames = [
  "Register for blood donation",
  "Health check-up and consultation",
  "Blood testing",
  "Blood donation",
  "Rest after donation"
];

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700"
};

export default function StepProgress({ steps }) {
  const [openStepIdx, setOpenStepIdx] = useState(null);

  return (
    <div className="w-full max-w-xl mx-auto bg-[#FDE4E4] rounded-xl shadow-lg px-4 pt-3 pb-6">
      <h2 className="text-xl font-bold mb-4 text-center">Step Progress</h2>
      <div className="space-y-4">
        {stepNames.map((name, idx) => {
          const step = steps[idx] || {};
          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer transition border
                ${
                  step.status === "DONE"
                    ? "bg-green-100 border-green-300"
                    : step.status === "FAILED"
                    ? "bg-red-100 border-red-300"
                    : step.status === "PENDING"
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              onClick={() => setOpenStepIdx(idx)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold border
                    ${
                      step.status === "DONE"
                        ? "bg-green-400 text-white border-green-400"
                        : step.status === "FAILED"
                        ? "bg-red-400 text-white border-red-400"
                        : step.status === "PENDING"
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : "bg-gray-300 text-gray-600 border-gray-300"
                    }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`font-semibold text-base ${
                    step.status === "DONE"
                      ? "text-green-700"
                      : step.status === "FAILED"
                      ? "text-red-700"
                      : step.status === "PENDING"
                      ? "text-yellow-700"
                      : "text-gray-700"
                  }`}
                >
                  {name}
                </span>
              </div>
              <span
                className={`capitalize font-bold px-3 py-1 rounded-full text-sm text-center w-24
                  ${
                    step.status === "DONE"
                      ? "bg-green-200 text-green-700"
                      : step.status === "FAILED"
                      ? "bg-red-200 text-red-700"
                      : step.status === "PENDING"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
              >
                {step.status || "pending"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal chi tiết step */}
      {openStepIdx !== null && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpenStepIdx(null)}
          ></div>
          {/* Modal content */}
          <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md relative mx-2">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setOpenStepIdx(null)}
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-3">{stepNames[openStepIdx]}</h3>
              <div className="mb-3">
                <span
                  className={`px-3 py-1 rounded-full font-semibold w-24 text-center inline-block ${
                    statusColor[steps[openStepIdx]?.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {(steps[openStepIdx]?.status || "pending").toUpperCase()}
                </span>
              </div>
              <div className="mb-3">
                <div className="font-semibold mb-1">Note:</div>
                <div className="border rounded p-2 min-h-[40px] bg-gray-50">
                  {steps[openStepIdx]?.note || <span className="text-gray-400">No note</span>}
                </div>
              </div>
              <button
                className="mt-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold block mx-auto"
                onClick={() => setOpenStepIdx(null)}
              >
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}