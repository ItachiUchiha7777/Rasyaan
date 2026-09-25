import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, subtotal, shippingFee, total } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream shadow-2xl border-l border-cream-dark flex flex-col justify-between z-10 animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-cream-dark flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="font-serif text-xl font-bold text-forest">Your Pahadi Basket</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-charcoal/60 hover:bg-cream-muted rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-cream-muted rounded-full flex items-center justify-center mx-auto text-charcoal/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest">Your Pahadi basket is empty</h3>
                <p className="text-xs text-charcoal/60 max-w-xs mx-auto">
                  Bring the authentic taste of Uttarakhand to your home. Explore our fresh mountain produce.
                </p>
                <Button variant="primary" onClick={() => setIsCartOpen(false)}>
                  Explore Products
                </Button>
              </div>
            ) : (
              cartItems.map((item) => <CartItem key={item._id} item={item} />)
            )}
          </div>

          {/* Drawer Footer / Checkout summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-cream-dark space-y-4">
              <div className="space-y-2 text-xs text-charcoal/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-cream-dark">
                  <span>Total Amount</span>
                  <span className="text-terracotta">{formatPrice(total)}</span>
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={handleCheckout}>
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
