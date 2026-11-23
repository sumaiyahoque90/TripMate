const dbService = require('../services/dbService');

// @desc    Get all Dubai hotels with optional filters
// @route   GET /api/hotels
const getHotels = async (req, res, next) => {
  try {
    const { category, location, maxPrice, isPartnerHotel } = req.query;
    let hotels = await dbService.getHotels({ category, isPartnerHotel, maxPrice });

    if (location && location !== 'ALL') {
      hotels = hotels.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.status(200).json({
      success: true,
      count: hotels.length,
      destination: "Dubai, United Arab Emirates",
      dataNotice: "Hotel rates are illustrative demo estimates. Live inventory verified upon reservation inquiry.",
      data: hotels
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get hotel details by ID
// @route   GET /api/hotels/:id
const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await dbService.getHotelById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit hotel booking request
// @route   POST /api/hotels/bookings
const bookHotel = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      hotelId,
      checkInDate,
      checkOutDate,
      roomType = "Deluxe Room",
      guestsCount = 2,
      voucherCode,
      specialRequests
    } = req.body;

    if (!fullName || !email || !phone || !hotelId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone, hotel, check-in, and check-out dates.'
      });
    }

    const hotel = await dbService.getHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Selected hotel not found.'
      });
    }

    // Calculate nights
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.round(timeDiff / (1000 * 3600 * 24)));

    let baseRate = hotel.pricePerNight;
    // Check if room type has custom price
    if (hotel.roomTypes) {
      const matchRoom = hotel.roomTypes.find(r => r.name.toLowerCase() === roomType.toLowerCase());
      if (matchRoom) baseRate = matchRoom.price;
    }

    let rawTotal = baseRate * nights;
    let discountApplied = 0;
    let appliedVoucher = null;

    // VOUCHER REDEMPTION CHECK
    // Section 11: 20% discount voucher valid ONLY for the designated partner hotel!
    if (voucherCode) {
      const voucherCheck = await dbService.validateVoucher(voucherCode);
      if (voucherCheck.valid) {
        if (hotel.isPartnerHotel || hotel.id === voucherCheck.partnerHotelId) {
          discountApplied = Math.round(rawTotal * (voucherCheck.discountPercentage / 100));
          appliedVoucher = voucherCheck.voucher;
          // Redeem the voucher
          await dbService.redeemVoucher(voucherCode);
        } else {
          return res.status(400).json({
            success: false,
            message: `Voucher ${voucherCode} is only redeemable at ${voucherCheck.voucher.partnerHotelName || 'TripMate Dubai Partner Hotel (Demo)'}.`
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: voucherCheck.message
        });
      }
    }

    const finalTotal = Math.max(0, rawTotal - discountApplied);

    const bookingPayload = {
      userId: req.user ? req.user.id : null,
      bookingType: 'HOTEL',
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      departureCity: 'Dhaka',
      destination: 'Dubai, UAE',
      departureAirport: 'DAC',
      arrivalAirport: 'DXB',
      departureDate: start,
      returnDate: end,
      numberOfTravelers: parseInt(guestsCount, 10) || 2,
      selectedHotelId: hotel.id,
      selectedPackage: `${hotel.name} (${nights} Nights - ${roomType})`,
      totalEstimatedCost: finalTotal,
      currency: 'BDT',
      voucherCode: appliedVoucher ? appliedVoucher.voucherCode : null,
      specialRequests: `${specialRequests ? specialRequests.trim() + ' | ' : ''}Room: ${roomType}, ${nights} nights. ${discountApplied > 0 ? `[20% Loyalty Voucher Applied: -BDT ${discountApplied.toLocaleString()}]` : ''}`,
      bookingStatus: 'PENDING'
    };

    const newBooking = await dbService.createBooking(bookingPayload);

    res.status(201).json({
      success: true,
      message: 'Hotel booking request submitted successfully! Reference code generated.',
      discountApplied,
      finalTotal,
      data: newBooking
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHotels,
  getHotelById,
  bookHotel
};
