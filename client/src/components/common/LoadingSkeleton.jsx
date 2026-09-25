import React from 'react';
import { ShoppingBag, PackageX, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 border border-cream-dark shadow-sm animate-pulse space-y-4">
          <div className="w-full h-48 bg-cream-muted rounded-xl" />
          <div className="h-4 bg-cream-muted rounded w-3/4" />
          <div className="h-3 bg-cream-muted rounded w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-cream-muted rounded w-1/3" />
            <div className="h-8 bg-cream-muted rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-cream-dark h-32 space-y-3">
            <div className="h-4 bg-cream-muted rounded w-1/2" />
            <div className="h-8 bg-cream-muted rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-cream-dark h-80" />
    </div>
  );
};

export const EmptyState = ({
  title = "No products found",
  message = "Your Pahadi basket is waiting for a little bit of Pahad.",
  actionText = "Explore Shop",
  actionLink = "/shop",
  icon = "cart"
}) => {
  return (
    <div className="py-16 px-4 text-center bg-cream/50 border border-dashed border-cream-dark rounded-3xl max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-forest/10 text-forest mx-auto flex items-center justify-center mb-4">
        {icon === 'cart' && <ShoppingBag className="w-8 h-8 text-forest" />}
        {icon === 'orders' && <PackageX className="w-8 h-8 text-terracotta" />}
        {icon === 'search' && <SearchX className="w-8 h-8 text-pine" />}
      </div>
      <h3 className="font-serif text-2xl font-bold text-forest mb-2">{title}</h3>
      <p className="text-charcoal/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed">{message}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-forest text-cream font-medium hover:bg-pine transition-all shadow-md"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
