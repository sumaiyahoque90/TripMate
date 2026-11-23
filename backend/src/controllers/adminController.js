const dbService = require('../services/dbService');

// @desc    Get complete admin dashboard analytics & KPIs
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dbService.getAdminStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
const getAdminBookings = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const bookings = await dbService.getBookings({ bookingStatus: status, bookingType: type, search });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all customer reviews for verification queue
// @route   GET /api/admin/reviews
const getAdminReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const reviews = await dbService.getReviews({ approvalStatus: status });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reward vouchers issued
// @route   GET /api/admin/rewards
const getAdminRewards = async (req, res, next) => {
  try {
    const stats = await dbService.getAdminStats();
    res.status(200).json({
      success: true,
      generatedVouchers: stats.generatedVouchers,
      redeemedVouchers: stats.redeemedVouchers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status by Admin
// @route   PATCH /api/admin/bookings/:id/status
const updateBookingStatusByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await dbService.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${updated.bookingReference} status updated to ${status.toUpperCase()}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getAdminBookings,
  getAdminReviews,
  getAdminRewards,
  updateBookingStatusByAdmin
};
