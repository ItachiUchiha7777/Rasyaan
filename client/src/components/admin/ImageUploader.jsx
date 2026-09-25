import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import API from '../../services/api';

export const ImageUploader = ({ images = [], onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleUploadFile = async (file) => {
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|svg\+xml)$/)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP, SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.url) {
        onChange([...images, data.url]);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-charcoal/80 mb-1">
        Product Images (Drag & Drop or URL)
      </label>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? 'border-forest bg-forest/5'
            : 'border-cream-dark/80 bg-cream/30 hover:border-forest/50'
        }`}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer space-y-2 block">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-forest animate-spin" />
              <p className="text-xs text-charcoal/60 mt-2 font-medium">Uploading image to server...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-forest/70 mb-1" />
              <p className="text-xs font-semibold text-forest">Click to browse or drag and drop image</p>
              <p className="text-[10px] text-charcoal/50">Supports PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </label>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {/* Manual URL Input fallback */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              e.preventDefault();
              onChange([...images, e.target.value.trim()]);
              e.target.value = '';
            }
          }}
          className="w-full text-xs py-2 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest"
        />
      </div>

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-cream-dark h-24 bg-white">
              <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-forest text-cream text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
