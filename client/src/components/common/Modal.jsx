import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-cream p-6 text-left shadow-2xl transition-all border border-cream-dark z-10 animate-fadeIn`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
            <h3 className="font-serif text-xl font-bold text-forest">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-charcoal/60 hover:bg-cream-muted hover:text-forest transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
