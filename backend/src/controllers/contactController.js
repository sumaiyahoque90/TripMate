const dbService = require('../services/dbService');

// @desc    Submit a contact inquiry message
// @route   POST /api/contact
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and your inquiry message.'
      });
    }

    const saved = await dbService.saveContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject || 'General Inquiry',
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to TripMate! Our travel desk will respond to your inquiry shortly.',
      data: saved
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
const getContacts = async (req, res, next) => {
  try {
    const list = await dbService.getContactMessages();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createContact,
  getContacts
};
