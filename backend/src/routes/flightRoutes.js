const express = require('express');
const router = express.Router();
const { getFlights, searchFlights, bookFlight } = require('../controllers/flightController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getFlights);
router.post('/search', searchFlights);
router.post('/bookings', optionalAuth, bookFlight);

module.exports = router;
