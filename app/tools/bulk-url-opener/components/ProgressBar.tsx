'use client';

import React from 'react';

// ProgressBar.tsx
// Displays the progress of URL opening
// Shows current position and total URLs

interface ProgressBarProps {
  currentPosition: number;
  totalUrls: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPosition, totalUrls }) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">
        Total URLs: {totalUrls}. Current Position: {currentPosition}. Use Ctrl+Enter to start,
        pause, or resume opening URLs.
      </p>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white"
              style={{ background: 'linear-gradient(90deg, #2dbdad 0%, #30a3c5 50%, #804cbd 100%)' }}
            >
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-gray-700">
              {currentPosition}/{totalUrls}
            </span>
          </div>
        </div>
        <div
          className="overflow-hidden h-2 mb-4 text-xs flex rounded"
          style={{ backgroundColor: '#e0e0e0' }}
        >
          <div
            style={{
              width: `${(currentPosition / totalUrls) * 100}%`,
              background: 'linear-gradient(90deg, #2dbdad 0%, #30a3c5 50%, #804cbd 100%)',
            }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
