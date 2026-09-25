import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const urlPath = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully',
    url: urlPath,
    filename: req.file.filename
  });
});

export default router;
