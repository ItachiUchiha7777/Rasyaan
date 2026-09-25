import express from 'express';
import {
  sendOTP,
  verifyOTP,
  createOrder,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

export default router;
