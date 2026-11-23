const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createContact);
router.get('/', protect, adminOnly, getContacts);

module.exports = router;
