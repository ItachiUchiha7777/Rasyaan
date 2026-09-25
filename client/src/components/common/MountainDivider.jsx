import React from 'react';

export const MountainDivider = ({ className = "my-6 text-pine/30" }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-current to-transparent flex-1 max-w-xs" />
      <svg className="w-8 h-6 fill-current opacity-70" viewBox="0 0 24 24">
        <path d="M14 6l-3.8 5.7 1.8 2.7H5l7-10 7 10h-2.5L14 6z" />
      </svg>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-current to-transparent flex-1 max-w-xs" />
    </div>
  );
};
