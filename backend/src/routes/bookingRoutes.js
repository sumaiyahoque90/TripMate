const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/bookingController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, createBooking)
  .get(optionalAuth, getBookings);

router.route('/:id')
  .get(optionalAuth, getBookingById);

router.route('/:id/status')
  .patch(protect, updateBookingStatus);

module.exports = router;
