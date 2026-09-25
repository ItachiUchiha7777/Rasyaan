import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import API from '../services/api';
import { formatPrice } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { ProductForm } from '../components/admin/ProductForm';
import { Toast } from '../components/common/Toast';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories')
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Pahadi product?')) return;

    try {
      await API.delete(`/products/${id}`);
      setToastType('success');
      setToastMessage('Product deleted successfully');
      fetchProductsAndCategories();
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData);
        setToastType('success');
        setToastMessage('Product updated successfully');
      } else {
        await API.post('/products', formData);
        setToastType('success');
        setToastMessage('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <Toast type={toastType} message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
        </div>

        <button
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-5 py-2.5 bg-forest text-cream text-xs font-bold rounded-xl hover:bg-pine transition-all flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-cream-dark/80 shadow-sm">
        <table className="w-full text-left text-xs text-charcoal">
          <thead className="bg-cream/60 border-b border-cream-dark uppercase text-[10px] tracking-wider text-charcoal/60 font-bold">
            <tr>
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark/50">
            {filteredProducts.map((prod) => (
              <tr key={prod._id} className="hover:bg-cream-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <img
                    src={prod.images && prod.images[0] ? prod.images[0] : '/placeholder.jpg'}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-lg bg-cream-muted border"
                  />
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-forest block">{prod.name}</span>
                  <span className="text-[10px] text-charcoal/50 font-mono">SKU: {prod.sku}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-charcoal/80">
                  {prod.category?.name || 'Uncategorized'}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-terracotta">
                    {formatPrice(prod.discountPrice > 0 ? prod.discountPrice : prod.price)}
                  </span>
                  {prod.discountPrice > 0 && (
                    <span className="block text-[10px] text-charcoal/40 line-through">
                      {formatPrice(prod.price)}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-forest">
                  <span className={prod.stock <= 5 ? 'text-rose-600' : ''}>{prod.stock}</span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prod.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {prod.featured && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-saffron text-forest">
                      Featured
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Pahadi Product' : 'Add New Pahadi Product'}
        maxWidth="max-w-3xl"
      >
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      </Modal>

    </div>
  );
};
