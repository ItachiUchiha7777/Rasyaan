import multer from 'multer';
import path from 'path';

// Use memoryStorage for Cloudinary stream uploads
const storage = multer.memoryStorage();

const checkFileTypes = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, svg)!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter(req, file, cb) {
    checkFileTypes(file, cb);
  }
});
