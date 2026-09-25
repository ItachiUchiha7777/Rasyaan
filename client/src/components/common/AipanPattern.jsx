import React from 'react';

export const AipanPattern = ({ className = "h-4 w-full text-terracotta/20 opacity-40 opacity-80" }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 py-2 overflow-hidden ${className}`}>
      <svg className="w-full h-4" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="aipan" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="10" r="3" fill="currentColor" />
          <path d="M 0 10 L 15 10 M 25 10 L 40 10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <polygon points="20,2 25,10 20,18 15,10" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect x="0" y="0" width="100%" height="20" fill="url(#aipan)" />
      </svg>
    </div>
  );
};
