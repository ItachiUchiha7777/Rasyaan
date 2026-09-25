import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logoutUser,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);
router.put('/profile', protect, updateProfile);

export default router;
