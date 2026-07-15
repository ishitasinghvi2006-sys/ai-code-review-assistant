const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
} = require('../controllers/reviewController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 }, // 1MB max
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.txt'];
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Allowed: .js, .jsx, .ts, .tsx, .py, .java, .txt'));
    }
  },
});
router.post('/', authMiddleware, upload.single('file'), createReview);
router.get('/', authMiddleware, getReviews);
router.get('/:id', authMiddleware, getReviewById);
router.delete('/:id', authMiddleware, deleteReview);
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;