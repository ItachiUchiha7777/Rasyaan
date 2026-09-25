import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    weight: { type: String, default: '500g' },
    ingredients: { type: String, default: '100% Organic Himalayan Produce' },
    origin: { type: String, default: 'Garhwal, Uttarakhand' },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 12 }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', ingredients: 'text', origin: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
