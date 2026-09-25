import React from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';

export const OrderTable = ({ orders = [], onViewOrder, onUpdateStatus }) => {
  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-cream-dark/80 shadow-sm">
      <table className="w-full text-left text-xs text-charcoal">
        <thead className="bg-cream/60 border-b border-cream-dark uppercase text-[10px] tracking-wider text-charcoal/60 font-bold">
          <tr>
            <th className="py-3.5 px-4">Order ID</th>
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Items</th>
            <th className="py-3.5 px-4">Total</th>
            <th className="py-3.5 px-4">Payment</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-dark/50">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-cream-muted/50 transition-colors">
              <td className="py-3.5 px-4 font-bold text-forest">{order.orderNumber}</td>
              <td className="py-3.5 px-4">
                <span className="font-semibold block">{order.shippingAddress?.name || 'Customer'}</span>
                <span className="text-[10px] text-charcoal/50">{order.shippingAddress?.email}</span>
              </td>
              <td className="py-3.5 px-4">
                <span className="font-medium">{order.items?.length || 0} Items</span>
              </td>
              <td className="py-3.5 px-4 font-bold text-terracotta">{formatPrice(order.total)}</td>
              <td className="py-3.5 px-4">
                <span className="capitalize text-[11px] font-semibold text-charcoal/80">
                  {order.paymentMethod}
                </span>
                <span
                  className={`block text-[9px] uppercase font-bold ${
                    order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${getStatusColor(
                    order.orderStatus
                  )} focus:outline-none cursor-pointer`}
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3.5 px-4 text-charcoal/60">{formatDate(order.createdAt)}</td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onViewOrder(order)}
                  className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors"
                  title="View Order Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
