import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import API from '../services/api';
import { OrderTable } from '../components/admin/OrderTable';
import { Modal } from '../components/common/Modal';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';
import { Toast } from '../components/common/Toast';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/admin/orders?limit=100`;
      if (selectedStatus !== 'All') url += `&status=${selectedStatus}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const { data } = await API.get(url);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, searchQuery]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      setToastType('success');
      setToastMessage(`Order status updated to ${newStatus}. Notification email sent.`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      
      <Toast type={toastType} message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer, Phone..."
            className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-forest" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium py-2.5 px-3 rounded-xl border border-cream-dark bg-white text-charcoal focus:outline-none focus:border-forest cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        onViewOrder={(order) => setSelectedOrder(order)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Manage Order #${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-left">
            
            {/* Status Update Header */}
            <div className="flex items-center justify-between p-4 bg-cream-muted rounded-2xl border border-cream-dark">
              <div>
                <span className="text-xs font-bold text-forest uppercase tracking-wider block">Current Status</span>
                <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal/70 block mb-1">Change Status:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  className="text-xs font-bold py-1.5 px-3 rounded-xl border border-forest bg-white focus:outline-none text-forest cursor-pointer"
                >
                  {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-cream-dark space-y-1">
                <h4 className="font-bold text-forest border-b border-cream-dark pb-1 mb-2">Customer Info</h4>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-cream-dark space-y-1">
                <h4 className="font-bold text-forest border-b border-cream-dark pb-1 mb-2">Delivery Address</h4>
                <p>
                  {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}<br />
                  {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-forest mb-2">Ordered Items</h4>
              <div className="space-y-2 border-b border-cream-dark pb-4">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-cream-dark/40 last:border-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-cream-muted border"
                      />
                      <div>
                        <span className="font-bold text-forest block">{item.name}</span>
                        <span className="text-charcoal/50">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-terracotta">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center text-sm font-bold text-forest pt-2">
              <span>Total Order Value ({selectedOrder.paymentMethod}):</span>
              <span className="text-lg text-terracotta">{formatPrice(selectedOrder.total)}</span>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
