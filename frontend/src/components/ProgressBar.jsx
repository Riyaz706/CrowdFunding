import React from 'react';

function ProgressBar({ progress, color = "bg-blue-600" }) {
  const percentage = Math.min(Math.max(progress || 0, 0), 100);

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressBar;