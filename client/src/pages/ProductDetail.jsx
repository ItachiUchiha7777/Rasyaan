import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, MapPin, ArrowRight, Plus, Minus, Check } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import { ProductCard } from '../components/product/ProductCard';
import { Toast } from '../components/common/Toast';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${slug}`);
        setProductData(data);
        if (data.product?.images && data.product.images.length > 0) {
          setSelectedImage(data.product.images[0]);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-forest border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!productData || !productData.product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest">
          This product seems to have wandered back into the mountains.
        </h2>
        <p className="text-xs text-charcoal/60">
          The product you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-forest text-cream font-bold rounded-xl text-xs"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const { product, reviews = [], relatedProducts = [] } = productData;
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setToastType('success');
      setToastMessage(`Added ${quantity} ${product.name} to your Pahadi basket.`);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/checkout');
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to process item');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      await API.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });

      setToastType('success');
      setToastMessage('Thank you! Your review has been published.');
      setReviewComment('');

      // Refresh product details
      const { data } = await API.get(`/products/${slug}`);
      setProductData(data);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Toast popup */}
      <Toast type={toastType} message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-white border border-cream-dark shadow-md">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPrice > 0 && (
              <span className="absolute top-4 left-4 bg-terracotta text-cream text-xs font-bold px-3 py-1 rounded-full shadow">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-forest scale-105 shadow' : 'border-cream-dark opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-terracotta mb-1">
              <span>{product.category?.name || 'Himalayan Produce'}</span>
              <span>•</span>
              <span className="text-charcoal/60">{product.origin}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-charcoal">{product.rating || 4.8} / 5</span>
              <span className="text-xs text-charcoal/50">({product.numReviews || reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-cream-muted rounded-2xl border border-cream-dark flex items-baseline space-x-3">
            <span className="font-serif text-3xl font-bold text-forest">
              {formatPrice(effectivePrice)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-base text-charcoal/40 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Taxes Included
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-charcoal/80 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-white rounded-2xl border border-cream-dark">
            <div>
              <span className="text-charcoal/50 block font-medium">Weight / Quantity</span>
              <span className="font-bold text-forest">{product.weight || '500g'}</span>
            </div>
            <div>
              <span className="text-charcoal/50 block font-medium">Origin Region</span>
              <span className="font-bold text-forest">{product.origin || 'Uttarakhand'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-charcoal/50 block font-medium">Key Ingredients</span>
              <span className="font-bold text-forest">{product.ingredients || '100% Himalayan Organic'}</span>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-charcoal/80">Select Quantity:</span>
              <div className="flex items-center space-x-3 bg-cream-muted p-1.5 rounded-xl border border-cream-dark">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-white rounded-lg text-forest"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-forest w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  className="p-1 hover:bg-white rounded-lg text-forest"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-charcoal/50">({product.stock} items in stock)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 bg-forest text-cream font-bold rounded-2xl hover:bg-pine transition-all shadow-lg flex items-center justify-center space-x-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 bg-terracotta text-cream font-bold rounded-2xl hover:bg-terracotta-dark transition-all shadow-lg text-sm"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery & Assurance info */}
          <div className="pt-4 border-t border-cream-dark space-y-2 text-xs text-charcoal/70">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-forest" />
              <span>Ships across India in 3–5 business days from Uttarakhand</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>100% Himalayan Authenticity & Quality Guaranteed</span>
            </div>
          </div>

        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-white p-8 rounded-3xl border border-cream-dark/80 shadow-sm space-y-8">
        <h3 className="font-serif text-2xl font-bold text-forest">Customer Reviews ({reviews.length})</h3>

        {/* Add Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="p-4 bg-cream/50 rounded-2xl border border-cream-dark space-y-4">
            <h4 className="text-sm font-bold text-forest">Write a Review</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-charcoal/70">Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this Himalayan produce..."
              className="w-full text-xs p-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
              required
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2.5 bg-forest text-cream text-xs font-bold rounded-xl hover:bg-pine transition-colors"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-cream-muted rounded-2xl text-xs text-charcoal/70">
            Please{' '}
            <Link to="/login" className="text-terracotta font-bold hover:underline">
              login
            </Link>{' '}
            to leave a review for this product.
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-charcoal/50 italic">No reviews yet. Be the first to leave a review!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-cream/30 border border-cream-dark/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-forest">{rev.name}</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-charcoal/80 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-forest">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
