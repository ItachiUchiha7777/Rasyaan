import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { ImageUploader } from './ImageUploader';

export const ProductForm = ({ initialData, categories = [], onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    sku: '',
    weight: '500g',
    ingredients: '100% Organic Himalayan Produce',
    origin: 'Garhwal, Uttarakhand',
    images: [],
    featured: false,
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        category: initialData.category?._id || initialData.category || '',
        images: initialData.images || []
      });
    } else if (categories.length > 0) {
      setFormData((prev) => ({ ...prev, category: categories[0]._id }));
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Pahadi Rajma (Harshil)"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="RYS-GRAIN-005"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="299"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Discount Price (₹)</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="249"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Stock Quantity *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="50"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Weight / Unit</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="1 kg"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Origin / Region</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Munsiyari, Uttarakhand"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/80 mb-1">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="High-altitude organic kidney beans from Harshil & Munsiyari."
          className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/80 mb-1">Full Description *</label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed story of the product, farming methods, cooking notes..."
          className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/80 mb-1">Ingredients</label>
        <input
          type="text"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="100% Organic Himalayan Kidney Beans"
          className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
        />
      </div>

      {/* Image Uploader */}
      <ImageUploader
        images={formData.images}
        onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
      />

      {/* Toggles */}
      <div className="flex items-center space-x-6 pt-2 border-t border-cream-dark">
        <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-charcoal">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-forest focus:ring-forest accent-forest"
          />
          <span>Featured Pahadi Pick</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-charcoal">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-forest focus:ring-forest accent-forest"
          />
          <span>Active Product (Visible on Store)</span>
        </label>
      </div>

      <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
        {initialData ? 'Update Product' : 'Create & Save Product'}
      </Button>
    </form>
  );
};
