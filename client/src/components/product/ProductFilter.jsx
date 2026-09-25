import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const ProductFilter = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePriceRange,
  sortOption,
  onChangeSort,
  featuredOnly,
  onToggleFeatured,
  onReset
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-cream-dark/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
        <div className="flex items-center space-x-2 text-forest font-serif font-bold text-base">
          <Filter className="w-4 h-4 text-terracotta" />
          <span>Filter & Sort</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-terracotta hover:underline font-semibold flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3 mr-1 inline" />
          Reset
        </button>
      </div>

      {/* Sort Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2">
          Sort Products
        </label>
        <select
          value={sortOption}
          onChange={(e) => onChangeSort(e.target.value)}
          className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border border-cream-dark bg-cream/40 focus:outline-none focus:border-forest text-charcoal"
        >
          <option value="featured">Featured Pahadi Picks</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Highest Rated</option>
        </select>
      </div>

      {/* Categories list */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2">
          Categories
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === ''
                ? 'bg-forest text-cream font-semibold'
                : 'text-charcoal/80 hover:bg-cream-muted'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-forest text-cream font-semibold'
                  : 'text-charcoal/80 hover:bg-cream-muted'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
            Max Price
          </label>
          <span className="text-xs font-bold text-terracotta">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={priceRange}
          onChange={(e) => onChangePriceRange(Number(e.target.value))}
          className="w-full accent-forest cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-charcoal/50 mt-1 font-medium">
          <span>₹100</span>
          <span>₹1,000</span>
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="pt-2 border-t border-cream-dark">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onToggleFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-forest focus:ring-forest accent-forest"
          />
          <span className="text-xs font-medium text-charcoal">Show Featured Pahadi Picks Only</span>
        </label>
      </div>
    </div>
  );
};
