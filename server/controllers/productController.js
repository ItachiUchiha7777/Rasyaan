import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      featured,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOptions = {};
    if (sort === 'price_asc') {
      sortOptions.price = 1;
    } else if (sort === 'price_desc') {
      sortOptions.price = -1;
    } else if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'popular') {
      sortOptions.rating = -1;
    } else {
      // Default: featured first, then newest
      sortOptions = { featured: -1, createdAt: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug }).populate('category', 'name slug');

    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ message: 'This product seems to have wandered back into the mountains.' });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({ product, reviews, relatedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      stock,
      sku,
      weight,
      ingredients,
      origin,
      images,
      featured,
      isActive
    } = req.body;

    if (!name || !price || !category || stock === undefined || !sku) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const product = new Product({
      name,
      slug,
      description,
      shortDescription: shortDescription || '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      stock: Number(stock),
      sku,
      weight: weight || '500g',
      ingredients: ingredients || '100% Organic Himalayan Produce',
      origin: origin || 'Garhwal, Uttarakhand',
      images: Array.isArray(images) ? images : images ? [images] : [],
      featured: Boolean(featured),
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      stock,
      sku,
      weight,
      ingredients,
      origin,
      images,
      featured,
      isActive
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (sku) product.sku = sku;
    if (weight) product.weight = weight;
    if (ingredients) product.ingredients = ingredients;
    if (origin) product.origin = origin;
    if (images) product.images = Array.isArray(images) ? images : [images];
    if (featured !== undefined) product.featured = Boolean(featured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      product: product._id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    await review.save();

    const reviews = await Review.find({ product: product._id });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
