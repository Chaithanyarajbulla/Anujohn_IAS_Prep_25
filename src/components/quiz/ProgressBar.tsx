import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answered }) => {
  const progress = (current / total) * 100;
  const answeredProgress = (answered / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>{answered} of {total} answered</span>
        <span>Question {current} of {total}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="w-full h-1 bg-transparent rounded-full overflow-hidden -mt-1">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${answeredProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;