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

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.single('file'), createReview);
router.get('/', authMiddleware, getReviews);
router.get('/:id', authMiddleware, getReviewById);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;