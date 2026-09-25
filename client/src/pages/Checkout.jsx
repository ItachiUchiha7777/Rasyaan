import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { formatPrice } from '../utils/formatters';
import { AddressForm } from '../components/order/AddressForm';
import { OTPModal } from '../components/common/OTPModal';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, shippingFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    city: '',
    district: '',
    state: 'Uttarakhand',
    pincode: ''
  });

  useEffect(() => {
    if (user) {
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddressData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          ...defaultAddr
        }));
      } else {
        setAddressData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone
        }));
      }
    }
  }, [user]);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitiateOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (!addressData.house || !addressData.street || !addressData.city || !addressData.pincode) {
      setToastType('error');
      setToastMessage('Please complete all delivery address fields.');
      return;
    }

    setLoading(true);
    try {
      // Send Email OTP
      const { data } = await API.post('/orders/send-otp', { email: addressData.email });
      setToastType('info');
      setToastMessage(data.message || 'OTP verification code sent to your email.');
      setIsOtpModalOpen(true);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndCreateOrder = async (otpCode) => {
    setLoading(true);
    try {
      // 1. Verify OTP
      await API.post('/orders/verify-otp', {
        email: addressData.email,
        otp: otpCode
      });

      // 2. Format order items
      const formattedItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        image: item.product.images && item.product.images[0] ? item.product.images[0] : ''
      }));

      // 3. Create Order
      const { data: newOrder } = await API.post('/orders', {
        items: formattedItems,
        shippingAddress: addressData,
        subtotal,
        shippingFee,
        total,
        paymentMethod: 'Pay on Delivery (COD)'
      });

      // 4. Clear cart
      await clearCart();
      setIsOtpModalOpen(false);

      // 5. Navigate to order confirmation
      navigate('/account', { state: { orderSuccess: newOrder } });
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Toast type={toastType} message={toastMessage} onClose={() => setToastMessage('')} />

      <h1 className="font-serif text-3xl font-bold text-forest border-b border-cream-dark pb-4">
        Checkout & Delivery Address
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Delivery Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-cream-dark shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-forest font-serif font-bold text-xl pb-2 border-b border-cream-dark">
            <ShieldCheck className="w-6 h-6 text-terracotta" />
            <h2>Shipping & Contact Information</h2>
          </div>

          <form onSubmit={handleInitiateOrder} className="space-y-6">
            <AddressForm formData={addressData} onChange={handleAddressChange} />

            <div className="p-4 bg-cream-muted rounded-2xl border border-cream-dark space-y-2">
              <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Payment Method</h4>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-forest/30">
                <CheckCircle2 className="w-5 h-5 text-forest" />
                <div>
                  <span className="text-sm font-bold text-forest block">Pay on Delivery (Cash / UPI)</span>
                  <span className="text-xs text-charcoal/60">Pay easily at your doorstep when your Pahadi parcel arrives.</span>
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              <span>Verify & Place Order</span>
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Button>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-forest border-b border-cream-dark pb-3">
            Items in Basket ({cartItems.length})
          </h3>

          <div className="space-y-4 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-3 text-xs">
                <img
                  src={item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg bg-cream-muted border"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-forest block truncate">{item.product.name}</span>
                  <span className="text-charcoal/60">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-terracotta">
                  {formatPrice((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-cream-dark text-charcoal/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-cream-dark">
              <span>Total Pay</span>
              <span className="text-terracotta">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* OTP Modal Popup */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={addressData.email}
        onVerify={handleVerifyOtpAndCreateOrder}
        onResend={handleInitiateOrder}
        loading={loading}
      />

    </div>
  );
};
