const dbService = require('../services/dbService');

// @desc    Submit a review for a completed booking
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, reviewText } = req.body;
    const userId = req.user.id;

    if (!bookingId || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking reference/ID and review feedback.'
      });
    }

    const review = await dbService.createReview({
      userId,
      bookingId,
      rating: parseInt(rating, 10) || 5,
      reviewText: reviewText.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It is now in the verification queue. Once approved by our team, it counts towards your 20% hotel discount milestone.',
      data: review
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all reviews (Approved reviews for public, or user's reviews)
// @route   GET /api/reviews
const getReviews = async (req, res, next) => {
  try {
    const { status, mine } = req.query;
    const filters = {};

    if (mine === 'true' && req.user) {
      filters.userId = req.user.id;
    } else if (req.user && req.user.role === 'ADMIN') {
      filters.approvalStatus = status; // admin can see all or filter
    } else {
      filters.approvalStatus = 'APPROVED'; // public only sees approved
    }

    const reviews = await dbService.getReviews(filters);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's review milestone progress towards 20% discount
// @route   GET /api/reviews/progress
const getReviewProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await dbService.getUserRewardProgress(userId);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin approve or reject review
// @route   PATCH /api/reviews/:id/approval
const updateApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!approvalStatus || !['APPROVED', 'REJECTED', 'PENDING'].includes(approvalStatus.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status: APPROVED, REJECTED, or PENDING.'
      });
    }

    const updated = await dbService.updateReviewApproval(id, approvalStatus);

    res.status(200).json({
      success: true,
      message: `Review has been marked as ${approvalStatus.toUpperCase()}. If the customer now has 3 approved reviews, their 20% discount voucher has been generated!`,
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewProgress,
  updateApproval
};
