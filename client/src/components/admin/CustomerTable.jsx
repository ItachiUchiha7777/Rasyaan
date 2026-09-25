import React from 'react';
import { formatPrice, formatDate } from '../../utils/formatters';

export const CustomerTable = ({ customers = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-cream-dark/80 shadow-sm">
      <table className="w-full text-left text-xs text-charcoal">
        <thead className="bg-cream/60 border-b border-cream-dark uppercase text-[10px] tracking-wider text-charcoal/60 font-bold">
          <tr>
            <th className="py-3.5 px-4">Customer Name</th>
            <th className="py-3.5 px-4">Email Address</th>
            <th className="py-3.5 px-4">Phone</th>
            <th className="py-3.5 px-4">Orders</th>
            <th className="py-3.5 px-4">Total Spent</th>
            <th className="py-3.5 px-4">Joined Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-dark/50">
          {customers.map((cust) => (
            <tr key={cust._id} className="hover:bg-cream-muted/50 transition-colors">
              <td className="py-3.5 px-4 font-bold text-forest">{cust.name}</td>
              <td className="py-3.5 px-4 font-medium text-charcoal/80">{cust.email}</td>
              <td className="py-3.5 px-4 text-charcoal/70">{cust.phone || 'N/A'}</td>
              <td className="py-3.5 px-4 font-bold text-forest">{cust.ordersCount || 0}</td>
              <td className="py-3.5 px-4 font-bold text-terracotta">{formatPrice(cust.totalSpent || 0)}</td>
              <td className="py-3.5 px-4 text-charcoal/60">{formatDate(cust.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
