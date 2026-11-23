const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminBookings,
  getAdminReviews,
  getAdminRewards,
  updateBookingStatusByAdmin
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAdminBookings);
router.get('/reviews', getAdminReviews);
router.get('/rewards', getAdminRewards);
router.patch('/bookings/:id/status', updateBookingStatusByAdmin);

module.exports = router;
