const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getReviewProgress,
  updateApproval
} = require('../controllers/reviewController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/', optionalAuth, getReviews);
router.get('/progress', protect, getReviewProgress);
router.patch('/:id/approval', protect, adminOnly, updateApproval);

module.exports = router;
