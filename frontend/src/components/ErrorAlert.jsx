import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm font-bold text-red-600">{message}</p>
    </div>
  );
};

export default ErrorAlert;
