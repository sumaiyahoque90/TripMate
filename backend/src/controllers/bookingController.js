const dbService = require('../services/dbService');

// @desc    Create unified booking request (Flight, Hotel, Package, or Trip Plan)
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      bookingType = "PACKAGE",
      departureCity = "Dhaka",
      destination = "Dubai, UAE",
      departureAirport = "DAC",
      arrivalAirport = "DXB",
      departureDate,
      returnDate,
      numberOfTravelers = 1,
      selectedFlightId,
      selectedHotelId,
      selectedPackage,
      totalEstimatedCost = 0,
      voucherCode,
      specialRequests
    } = req.body;

    if (!fullName || !email || !phone || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Full Name, Email, Phone, and Departure Date.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const bookingPayload = {
      userId: req.user ? req.user.id : null,
      bookingType: bookingType.toUpperCase(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      departureCity: departureCity.trim(),
      destination: destination.trim(),
      departureAirport,
      arrivalAirport,
      departureDate: new Date(departureDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      numberOfTravelers: Math.max(1, parseInt(numberOfTravelers, 10) || 1),
      selectedFlightId: selectedFlightId || null,
      selectedHotelId: selectedHotelId || null,
      selectedPackage: selectedPackage || 'Custom Dubai Itinerary Request',
      totalEstimatedCost: Number(totalEstimatedCost) || 0,
      currency: 'BDT',
      voucherCode: voucherCode || null,
      specialRequests: specialRequests ? specialRequests.trim() : '',
      bookingStatus: 'PENDING'
    };

    const newBooking = await dbService.createBooking(bookingPayload);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Your booking is under review by our Dubai tour specialist.',
      data: newBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings (User's bookings or all if admin)
// @route   GET /api/bookings
const getBookings = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const filters = {
      bookingStatus: status,
      bookingType: type,
      search
    };

    // If customer, only show their own bookings
    if (req.user && req.user.role !== 'ADMIN') {
      filters.userId = req.user.id;
    }

    const bookings = await dbService.getBookings(filters);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get booking by ID or Reference
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await dbService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID or Reference "${id}" was not found.`
      });
    }

    // Authorization check
    if (req.user && req.user.role !== 'ADMIN' && booking.userId && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own bookings.'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (Admin or customer cancellation)
// @route   PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status to update.'
      });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await dbService.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status.toUpperCase()}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus
};
