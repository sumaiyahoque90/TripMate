const dbService = require('../services/dbService');

// @desc    Get user's reward milestone progress
// @route   GET /api/rewards/progress
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await dbService.getUserRewardProgress(userId);

    res.status(200).json({
      success: true,
      program: "TripMate Travel Rewards – Review 3 Times, Get 20% OFF!",
      partnerHotel: "TripMate Dubai Partner Hotel (Demo)",
      data: progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's discount vouchers
// @route   GET /api/rewards/vouchers
const getVouchers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await dbService.getUserRewardProgress(userId);

    res.status(200).json({
      success: true,
      activeVouchers: progress.activeVouchers,
      redeemedVouchers: progress.redeemedVouchers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Validate voucher code for checkout
// @route   POST /api/rewards/validate
const validateVoucher = async (req, res, next) => {
  try {
    const { voucherCode } = req.body;
    const result = await dbService.validateVoucher(voucherCode);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      voucher: result.voucher,
      discountPercentage: result.discountPercentage,
      partnerHotelId: result.partnerHotelId
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Redeem voucher code
// @route   POST /api/rewards/redeem
const redeemVoucher = async (req, res, next) => {
  try {
    const { voucherCode } = req.body;
    const redeemed = await dbService.redeemVoucher(voucherCode);

    if (!redeemed) {
      return res.status(400).json({
        success: false,
        message: 'Could not redeem voucher. It may be invalid or already used.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Voucher ${voucherCode} redeemed successfully!`,
      data: redeemed
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProgress,
  getVouchers,
  validateVoucher,
  redeemVoucher
};
