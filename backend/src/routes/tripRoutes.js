const express = require('express');
const router = express.Router();
const { estimateTrip, saveTrip, getUserTrips } = require('../controllers/tripController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/estimate', estimateTrip);
router.post('/', optionalAuth, saveTrip);
router.get('/', optionalAuth, getUserTrips);

module.exports = router;
