import bcrypt from 'bcryptjs';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import OTP from '../models/OTP.js';
import { sendOTPEmail, sendOrderConfirmationEmail } from '../utils/email.js';

// Helper to generate order number: RYS-2026-001024 style
const generateOrderNumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RYS-2026-${randomNum}`;
};

// @desc    Send OTP to email for order verification
// @route   POST /api/orders/send-otp
// @access  Private
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || req.user.email).toLowerCase();

    // Delete previous pending OTPs for this email
    await OTP.deleteMany({ email: targetEmail });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otpCode, salt);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
      email: targetEmail,
      otpHash,
      attempts: 0,
      expiresAt
    });

    await sendOTPEmail(targetEmail, otpCode);

    res.json({
      message: `Verification code sent to ${targetEmail}. Please check your email.`,
      email: targetEmail
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for checkout
// @route   POST /api/orders/verify-otp
// @access  Private
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (email || req.user.email).toLowerCase();

    if (!otp) {
      return res.status(400).json({ message: 'Please enter the 6-digit verification code.' });
    }

    const otpRecord = await OTP.findOne({ email: targetEmail });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new code.' });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
    }

    // Success - delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'OTP verified successfully!', verified: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingFee, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Your basket is waiting for a little bit of Pahad.' });
    }

    if (!shippingAddress || !shippingAddress.house || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Please complete all delivery address details.' });
    }

    // Validate product stock & reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} is no longer available.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock limit reached for ${product.name}. Available: ${product.stock}`
        });
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      user: req.user._id,
      items,
      shippingAddress: {
        ...shippingAddress,
        email: shippingAddress.email || req.user.email
      },
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee || 0),
      total: Number(total),
      paymentMethod: paymentMethod || 'Pay on Delivery',
      paymentStatus: 'pending',
      orderStatus: 'Pending',
      otpVerified: true
    });

    const createdOrder = await order.save();

    // Send confirmation email asynchronously
    sendOrderConfirmationEmail(createdOrder);

    // Clear cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
