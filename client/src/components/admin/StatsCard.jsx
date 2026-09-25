import React from 'react';

export const StatsCard = ({ title, value, icon, change, color = 'forest' }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-cream-dark/80 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">{title}</p>
        <h3 className="font-serif text-3xl font-bold text-forest">{value}</h3>
        {change && <p className="text-xs text-emerald-600 font-semibold mt-1">{change}</p>}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-cream-muted text-forest flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};
