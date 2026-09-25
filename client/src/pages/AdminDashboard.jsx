import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle, IndianRupee, Users, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import API from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';
import { StatsCard } from '../components/admin/StatsCard';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const {
    totalProducts = 0,
    totalOrders = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
    totalRevenue = 0,
    totalCustomers = 0,
    recentOrders = [],
    analytics = []
  } = stats || {};

  return (
    <div className="space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={<IndianRupee className="w-5 h-5 text-terracotta" />} />
        <StatsCard title="Total Orders" value={totalOrders} icon={<ShoppingBag className="w-5 h-5 text-forest" />} />
        <StatsCard title="Pending Orders" value={pendingOrders} icon={<Clock className="w-5 h-5 text-amber-600" />} />
        <StatsCard title="Delivered" value={deliveredOrders} icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} />
        <StatsCard title="Total Products" value={totalProducts} icon={<Package className="w-5 h-5 text-pine" />} />
        <StatsCard title="Customers" value={totalCustomers} icon={<Users className="w-5 h-5 text-saffron" />} />
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white p-6 rounded-3xl border border-cream-dark/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-forest">Revenue & Sales Trends</h3>
            <p className="text-xs text-charcoal/50">Real-time revenue metrics from completed orders</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-terracotta">
            <TrendingUp className="w-4 h-4" />
            <span>Growth Analytics</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C85A32" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C85A32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4EFE6" />
              <XAxis dataKey="name" stroke="#1F2421" fontSize={11} />
              <YAxis stroke="#1F2421" fontSize={11} />
              <Tooltip formatter={(val) => formatPrice(val)} />
              <Area type="monotone" dataKey="revenue" stroke="#C85A32" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-3xl border border-cream-dark/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
          <h3 className="font-serif text-lg font-bold text-forest">Recent Orders</h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs text-terracotta font-bold hover:underline"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-cream/50 uppercase text-[10px] tracking-wider text-charcoal/60 font-bold border-b border-cream-dark">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/40">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-cream-muted/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-forest">{ord.orderNumber}</td>
                  <td className="py-3 px-4 font-medium">{ord.shippingAddress?.name || 'Customer'}</td>
                  <td className="py-3 px-4 font-bold text-terracotta">{formatPrice(ord.total)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-charcoal/60">{formatDate(ord.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
