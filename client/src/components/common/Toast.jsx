import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const typeStyles = {
    success: 'bg-forest text-cream border-pine-light',
    error: 'bg-rose-900 text-cream border-rose-700',
    info: 'bg-amber-900 text-cream border-amber-700'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-saffron mr-2" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300 mr-2" />,
    info: <Info className="w-5 h-5 text-amber-300 mr-2" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center p-4 rounded-xl border shadow-2xl ${typeStyles[type]} max-w-md`}>
        {icons[type]}
        <span className="text-sm font-medium mr-4">{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-75">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
