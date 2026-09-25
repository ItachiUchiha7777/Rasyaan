import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product || {};
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : (product.price || item.price);

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-cream-dark/60 last:border-0">
      {/* Thumbnail */}
      <img
        src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
        alt={product.name || 'Product'}
        className="w-16 h-16 object-cover rounded-xl bg-cream-muted border border-cream-dark"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-serif font-bold text-forest truncate">{product.name || 'Himalayan Produce'}</h4>
        {product.weight && <p className="text-xs text-charcoal/50">{product.weight}</p>}
        <p className="text-xs font-bold text-terracotta mt-0.5">{formatPrice(effectivePrice)}</p>
      </div>

      {/* Quantity adjustment buttons */}
      <div className="flex items-center space-x-2 bg-cream-muted p-1 rounded-xl border border-cream-dark">
        <button
          onClick={() => updateQuantity(item._id, product, item.quantity - 1)}
          className="p-1 text-charcoal/70 hover:text-forest hover:bg-cream rounded-lg transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-bold text-forest w-5 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, product, item.quantity + 1)}
          className="p-1 text-charcoal/70 hover:text-forest hover:bg-cream rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeFromCart(item._id, product)}
        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
