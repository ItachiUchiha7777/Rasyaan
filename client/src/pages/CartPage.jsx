import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { formatPrice } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/LoadingSkeleton';

export const CartPage = () => {
  const { cartItems, subtotal, shippingFee, total } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Pahadi basket is empty"
          message="Bring the authentic taste of Uttarakhand to your home. Explore our fresh mountain produce."
          actionText="Explore Shop"
          actionLink="/shop"
          icon="cart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-cream-dark pb-4">
        <h1 className="font-serif text-3xl font-bold text-forest">Shopping Basket</h1>
        <Link to="/shop" className="text-xs font-bold text-terracotta hover:underline flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-cream-dark shadow-sm">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-forest border-b border-cream-dark pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-charcoal/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-bold">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
            </div>
            {subtotal < 999 && (
              <p className="text-[11px] text-terracotta font-medium bg-terracotta/10 p-2 rounded-lg">
                Add {formatPrice(999 - subtotal)} more to unlock FREE shipping!
              </p>
            )}
            <div className="flex justify-between text-lg font-bold text-forest pt-3 border-t border-cream-dark">
              <span>Total Amount</span>
              <span className="text-terracotta">{formatPrice(total)}</span>
            </div>
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/checkout')}>
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </div>
      </div>

    </div>
  );
};
