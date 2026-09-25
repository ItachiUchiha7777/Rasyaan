import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, User as UserIcon, MapPin, LogOut, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/LoadingSkeleton';

export const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Success message state from checkout redirect
  const orderSuccess = location.state?.orderSuccess;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data || []);
        if (orderSuccess) {
          setSelectedOrder(orderSuccess);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, orderSuccess]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest">Please Login</h2>
        <p className="text-xs text-charcoal/60">Log in to view your orders and manage your account.</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-forest text-cream font-bold rounded-xl text-xs">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Order Success Announcement */}
      {orderSuccess && (
        <div className="p-6 bg-forest text-cream rounded-3xl border border-pine flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-saffron" />
            <div>
              <h3 className="font-serif text-lg font-bold">Order Placed Successfully!</h3>
              <p className="text-xs text-cream/80">
                Your order <strong className="text-saffron">#{orderSuccess.orderNumber}</strong> has been received. Verification email has been sent.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrder(orderSuccess)}
            className="px-5 py-2.5 bg-saffron text-forest font-bold rounded-xl text-xs hover:bg-saffron-light transition-all whitespace-nowrap"
          >
            Track Order
          </button>
        </div>
      )}

      {/* Main Account Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-cream-dark shadow-sm space-y-2">
          <div className="p-4 border-b border-cream-dark text-center">
            <div className="w-14 h-14 rounded-full bg-forest text-cream font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="font-serif font-bold text-forest text-base">{user.name}</h3>
            <p className="text-xs text-charcoal/50">{user.email}</p>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-forest text-cream shadow-md' : 'text-charcoal/70 hover:bg-cream-muted'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-forest text-cream shadow-md' : 'text-charcoal/70 hover:bg-cream-muted'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-forest border-b border-cream-dark pb-3">
                Order Journeys from the Pahad
              </h2>

              {loading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto" />
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  title="No journeys from the Pahad yet."
                  message="You haven't placed any orders yet. Discover our fresh mountain produce."
                  actionText="Explore Shop"
                  actionLink="/shop"
                  icon="orders"
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="p-5 rounded-2xl border border-cream-dark hover:border-forest/40 bg-cream/20 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-sm text-forest">{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-1">
                          Placed on {formatDate(order.createdAt)} • {order.items?.length || 0} items
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-base text-terracotta">{formatPrice(order.total)}</span>
                        <ChevronRight className="w-5 h-5 text-charcoal/40" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-forest border-b border-cream-dark pb-3">
                Account Details
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-charcoal/50 block font-medium">Name</span>
                  <span className="font-bold text-sm text-forest">{user.name}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block font-medium">Email Address</span>
                  <span className="font-bold text-sm text-forest">{user.email}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block font-medium">Phone</span>
                  <span className="font-bold text-sm text-forest">{user.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            
            {/* Order Timeline Visual Tracker */}
            <div className="bg-cream/50 p-4 rounded-2xl border border-cream-dark">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest mb-2">Live Order Status</h4>
              <OrderTimeline currentStatus={selectedOrder.orderStatus} />
            </div>

            {/* Order Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest mb-2">Items Purchased</h4>
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

            {/* Shipping Address & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-cream-muted rounded-xl">
                <span className="font-bold text-forest block mb-1">Shipping Address</span>
                <p className="text-charcoal/80 leading-relaxed">
                  {selectedOrder.shippingAddress?.name}<br />
                  {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>

              <div className="p-3 bg-cream-muted rounded-xl space-y-1">
                <span className="font-bold text-forest block mb-1">Payment Summary</span>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong>{formatPrice(selectedOrder.subtotal)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <strong>{selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}</strong>
                </div>
                <div className="flex justify-between text-sm text-forest font-bold pt-1 border-t border-cream-dark">
                  <span>Total:</span>
                  <span className="text-terracotta">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
