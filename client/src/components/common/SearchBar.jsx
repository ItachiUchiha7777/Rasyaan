import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import API from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-cream w-full max-w-2xl rounded-2xl shadow-2xl border border-cream-dark overflow-hidden animate-fadeIn">
        
        {/* Input Header */}
        <div className="p-4 border-b border-cream-dark flex items-center bg-white">
          <Search className="w-5 h-5 text-forest mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pahadi Rajma, Wild Honey, Mandua, Spices, Woolens..."
            className="w-full bg-transparent border-none text-charcoal focus:outline-none focus:ring-0 text-base font-medium placeholder-charcoal/40"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-forest animate-spin mr-2" />}
          <button onClick={onClose} className="p-1 hover:bg-cream-muted rounded-full">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() && results.length === 0 && !loading && (
            <div className="py-8 text-center text-charcoal/60 text-sm">
              No Himalayan products found for "<span className="font-semibold">{query}</span>".
            </div>
          )}

          {results.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSelectProduct(product.slug)}
              className="flex items-center space-x-4 p-3 hover:bg-cream-muted rounded-xl cursor-pointer transition-colors border border-transparent hover:border-cream-dark"
            >
              <img
                src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg bg-cream-muted border"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-forest font-serif">{product.name}</h4>
                <p className="text-xs text-charcoal/60 line-clamp-1">{product.shortDescription || product.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-terracotta">
                  {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                </span>
                {product.category?.name && (
                  <span className="block text-[10px] text-charcoal/50 uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
              </div>
            </div>
          ))}

          {!query && (
            <div className="py-4 px-2">
              <p className="text-xs font-bold uppercase tracking-wider text-terracotta mb-2">Popular Pahadi Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Pahadi Rajma', 'Wild Honey', 'Mandua Atta', 'Bhang Chutney', 'Buransh Squash', 'Woolen Socks'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-cream-muted hover:bg-forest hover:text-cream text-xs font-medium text-charcoal transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
