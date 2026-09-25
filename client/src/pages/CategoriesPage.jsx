import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../services/api';
import { MountainDivider } from '../components/common/MountainDivider';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Himalayan Collections</span>
        <h1 className="font-serif text-4xl font-bold text-forest">Explore All Categories</h1>
        <MountainDivider />
        <p className="text-xs sm:text-sm text-charcoal/70">
          Discover our curated ranges of traditional Uttarakhand pulses, honey, tisanes, spices, and artisan woolens.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-dark shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-cream-muted">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest group-hover:text-terracotta transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed mt-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-dark">
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-forest hover:text-terracotta transition-colors"
                  >
                    <span>Browse {cat.name} Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
