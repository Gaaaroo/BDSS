import React from 'react';
import { useApp } from '../Contexts/AppContext';
import { useState, useEffect } from 'react';
import MapFinder from './MapFinder';

export default function MapPin() {
  const { profile, activeWidget, setActiveWidget } = useApp();
  const [showFinder, setShowFinder] = useState(false);

  const handleOpenMap = () => {
    if (activeWidget !== 'map') {
      setActiveWidget('map');
      setShowFinder(true);
    } else {
      setActiveWidget(null);
      setShowFinder(false);
    }
  };

  useEffect(() => {
    if (activeWidget !== 'map') {
      setShowFinder(false);
    }
  }, [activeWidget]);

  return (
    <>
      <div className="fixed bottom-40 right-5 flex flex-col z-50">
        {!showFinder && activeWidget !== 'chat' && (
          <div
            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-400 transition"
            onClick={handleOpenMap}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-6.5 8-13a8 8 0 10-16 0c0 6.5 8 13 8 13z"
              />
            </svg>
          </div>
        )}
      </div>

      {showFinder && (
        <MapFinder
          initialLocation={{
            lat: profile?.lat,
            lng: profile?.lng,
          }}
          onClose={() => setShowFinder(false)}
        />
      )}
    </>
  );
}
