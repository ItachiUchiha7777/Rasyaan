import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock weight category'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const existingQty = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const targetQty = existingQty + Number(quantity);

    if (targetQty > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in mountain stock.`
      });
    }

    const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = targetQty;
      cart.items[itemIndex].price = effectivePrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: effectivePrice
      });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock weight category'
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Merge guest cart into user cart
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = async (req, res) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const pId = guestItem.productId || (guestItem.product && (guestItem.product._id || guestItem.product));
      if (!pId) continue;

      const product = await Product.findById(pId);
      if (!product || !product.isActive) continue;

      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === pId.toString());

      if (itemIndex > -1) {
        const mergedQty = cart.items[itemIndex].quantity + Number(guestItem.quantity || 1);
        cart.items[itemIndex].quantity = Math.min(mergedQty, product.stock);
        cart.items[itemIndex].price = effectivePrice;
      } else {
        const qty = Math.min(Number(guestItem.quantity || 1), product.stock);
        cart.items.push({
          product: pId,
          quantity: qty,
          price: effectivePrice
        });
      }
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock weight category'
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Cannot exceed available stock of ${product.stock} units.`
      });
    }

    if (Number(quantity) <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock weight category'
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items.pull(itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock weight category'
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
