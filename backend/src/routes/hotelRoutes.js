const express = require('express');
const router = express.Router();
const { getHotels, getHotelById, bookHotel } = require('../controllers/hotelController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/bookings', optionalAuth, bookHotel);

module.exports = router;
