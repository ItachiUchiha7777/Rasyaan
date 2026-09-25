import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductSkeleton, EmptyState } from '../common/LoadingSkeleton';

export const ProductGrid = ({ products, loading, emptyMessage }) => {
  if (loading) {
    return <ProductSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message={emptyMessage || "No mountain items matched your current filter criteria."}
        actionText="Reset Filters"
        actionLink="/shop"
        icon="search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
