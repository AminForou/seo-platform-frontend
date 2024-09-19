import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${normalizedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
