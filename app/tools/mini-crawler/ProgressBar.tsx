import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
  total?: number; // Optional total value
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const roundedProgress = Math.round(normalizedProgress * 10) / 10; // Round to 1 decimal place

  const getProgressMessage = (progress: number): string => {
    if (progress === 0) return "Not started";
    if (progress < 25) return "Just beginning";
    if (progress < 50) return "Making progress";
    if (progress < 75) return "Well underway";
    if (progress < 100) return "Almost there";
    return "Complete";
  };

  const progressMessage = getProgressMessage(normalizedProgress);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-medium text-gray-700">
          {roundedProgress.toFixed(1)}% - {progressMessage}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${normalizedProgress}%` }}
        ></div>
      </div>
      {total && (
        <div className="mt-1 text-xs text-gray-500">
          {Math.round(progress)} / {total} completed
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
