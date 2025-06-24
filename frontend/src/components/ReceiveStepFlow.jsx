import React from 'react';
import { CheckIcon } from 'lucide-react';

const steps = [
  'Confirm information',
  'Check blood inventory',
  'In transit to recipient',
];

const getStepStatus = (idx, completedStepIndex) => {
  if (idx < completedStepIndex) return 'done';
  if (idx === completedStepIndex) return 'current';
  return 'upcoming';
};

const ReceiveStepFlow = ({ completedStepIndex }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto bg-white">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-400 mb-5 text-center tracking-tight">
        Blood Donation Journey
      </h2>
      <ol className="w-full space-y-0">
        {steps.map((step, idx) => {
          const status = getStepStatus(idx, completedStepIndex);
          return (
            <li
              key={step}
              className={`flex items-center gap-4 py-2 px-4 rounded-xl transition-all duration-300 mb-2
                ${
                  status === 'done'
                    ? 'bg-green-50 border-l-4 border-green-400'
                    : status === 'current'
                    ? 'bg-red-50 border-l-4 border-red-400'
                    : 'bg-gray-50 border-l-4 border-gray-200'
                }
              `}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 text-lg font-bold transition-all duration-300
                  ${
                    status === 'done'
                      ? 'bg-green-400 border-green-500 text-white'
                      : status === 'current'
                      ? 'bg-red-400 border-red-500 text-white animate-pulse'
                      : 'bg-gray-200 border-gray-300 text-gray-400'
                  }
                `}
              >
                {status === 'done' ? (
                  <CheckIcon strokeWidth={1} className="w-7 h-7" />
                ) : (
                  idx + 1
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`text-lg font-semibold transition-colors duration-300
                    ${
                      status === 'done'
                        ? 'text-green-700'
                        : status === 'current'
                        ? 'text-red-700'
                        : 'text-gray-600'
                    }
                  `}
                >
                  {step}
                </span>
                {status === 'current' && (
                  <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full shadow font-semibold">
                    In progress
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ReceiveStepFlow;
