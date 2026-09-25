import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onQuickAdd }) => {
  const { addToCart } = useCart();
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (onQuickAdd) {
        onQuickAdd(product);
      } else {
        await addToCart(product, 1);
      }
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-cream-dark/80 hover:border-forest/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Discount Badge */}
      {product.discountPrice > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-terracotta text-cream text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
        </div>
      )}

      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-3 right-3 z-10 bg-forest text-saffron text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow">
          Pahad Pick
        </div>
      )}

      {/* Image Gallery Preview */}
      <Link to={`/product/${product.slug}`} className="block relative w-full h-56 bg-cream-muted overflow-hidden">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-xs font-semibold text-cream bg-forest/90 px-3 py-1.5 rounded-lg flex items-center space-x-1 backdrop-blur-sm">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-1">
            <span className="uppercase tracking-wider font-semibold text-terracotta text-[10px]">
              {product.category?.name || 'Uttarakhand Produce'}
            </span>
            {product.weight && <span className="text-charcoal/50">{product.weight}</span>}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-lg font-bold text-forest group-hover:text-terracotta transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1 my-1.5 text-xs text-charcoal/70">
            <div className="flex text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-charcoal">{product.rating || 4.8}</span>
            <span className="text-charcoal/40">({product.numReviews || 12})</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed my-2">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-cream-dark/50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-lg text-forest">{formatPrice(effectivePrice)}</span>
              {product.discountPrice > 0 && (
                <span className="text-xs text-charcoal/40 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">In Stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2 rounded-xl bg-forest hover:bg-pine text-cream text-xs font-semibold flex items-center space-x-1.5 shadow-sm hover:shadow transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
