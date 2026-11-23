const express = require('express');
const router = express.Router();
const {
  getProgress,
  getVouchers,
  validateVoucher,
  redeemVoucher
} = require('../controllers/rewardController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/progress', protect, getProgress);
router.get('/vouchers', protect, getVouchers);
router.post('/validate', optionalAuth, validateVoucher);
router.post('/redeem', protect, redeemVoucher);

module.exports = router;
