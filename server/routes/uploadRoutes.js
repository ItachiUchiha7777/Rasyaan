import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnq3n3fbi',
  api_key: process.env.CLOUDINARY_API_KEY || '672569512879156',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QpSusavdjtWZ2ZQf2H3qRNyynsM'
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'rasyaan_products',
      format: 'webp',
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ message: 'Cloudinary upload failed: ' + error.message });
      }
      return res.json({
        message: 'Image uploaded successfully to Cloudinary in WebP format',
        url: result.secure_url,
        public_id: result.public_id
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

export default router;
