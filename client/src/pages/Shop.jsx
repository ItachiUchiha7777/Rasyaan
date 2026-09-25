import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilter } from '../components/product/ProductFilter';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortOption, setSortOption] = useState('featured');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== null) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?maxPrice=${priceRange}&sort=${sortOption}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        if (featuredOnly) url += `&featured=true`;

        const { data } = await API.get(url);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, priceRange, sortOption, featuredOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange(1000);
    setSortOption('featured');
    setFeaturedOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="bg-forest text-cream p-8 rounded-3xl mb-8 border border-pine relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron">Rasyaan Marketplace</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">Authentic Pahadi Store</h1>
          <p className="text-xs sm:text-sm text-cream/80 mt-2">
            Explore organic Himalayan pulses, wild flower honey, sun-cured spices, artisan pickles, and handmade woolens.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setSearchParams(slug ? { category: slug } : {});
            }}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            sortOption={sortOption}
            onChangeSort={setSortOption}
            featuredOnly={featuredOnly}
            onToggleFeatured={setFeaturedOnly}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Search bar inside shop */}
          <div className="flex items-center bg-white border border-cream-dark/80 rounded-2xl px-4 py-2.5 shadow-sm">
            <Search className="w-5 h-5 text-forest mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Rajma, Honey, Mandua, Chutney, Spices..."
              className="w-full text-xs font-medium bg-transparent border-none text-charcoal focus:outline-none placeholder-charcoal/40"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-charcoal/50 hover:text-charcoal font-bold">
                Clear
              </button>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} />

        </div>
      </div>
    </div>
  );
};
