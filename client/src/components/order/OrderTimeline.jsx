import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertTriangle } from 'lucide-react';

export const OrderTimeline = ({ currentStatus = 'Pending' }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-rose-600" />
        <span className="text-sm font-semibold">This order has been cancelled.</span>
      </div>
    );
  }

  const getStepIndex = (status) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-6 px-2">
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-cream-dark -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-4 h-1 bg-forest -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isDone
                    ? 'bg-forest text-cream border-forest shadow-md'
                    : 'bg-white text-charcoal/40 border-cream-dark'
                } ${isCurrent ? 'ring-4 ring-forest/20 scale-110' : ''}`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 text-saffron" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] md:text-xs mt-2 font-medium text-center max-w-[70px] leading-tight ${
                  isCurrent ? 'font-bold text-forest' : isDone ? 'text-charcoal/80' : 'text-charcoal/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
