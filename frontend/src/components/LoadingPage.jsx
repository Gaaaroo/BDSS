import React from 'react';

export default function LoadingPage() {
  return (
    <div className="flex place-items-baseline justify-center h-screen bg-white pt-[25vh]">
      <p className="text-2xl font-semibold text-gray-500 flex space-x-1">
        {'Loading...'.split('').map((char, idx) => (
          <span
            key={idx}
            className={`inline-block animate-bounce`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
