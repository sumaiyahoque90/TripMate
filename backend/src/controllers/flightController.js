const dbService = require('../services/dbService');

// @desc    Get all available sample flights
// @route   GET /api/flights
const getFlights = async (req, res, next) => {
  try {
    const { arrivalAirport, cabinClass, stops } = req.query;
    const flights = await dbService.getFlights({ arrivalAirport, cabinClass, stops });

    res.status(200).json({
      success: true,
      count: flights.length,
      route: "Dhaka (DAC) ➔ Dubai (DXB / DWC)",
      dataNotice: "Illustrative sample flight schedules & estimated fares for planning purposes. Live seat inventory is verified upon quote request.",
      data: flights
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search flights based on customer itinerary
// @route   POST /api/flights/search
const searchFlights = async (req, res, next) => {
  try {
    const {
      departureAirport = "DAC",
      arrivalAirport = "DXB",
      departureDate,
      returnDate,
      travelers = 1,
      cabinClass = "Economy"
    } = req.body;

    const numTravelers = parseInt(travelers, 10) || 1;
    let list = await dbService.getFlights({
      arrivalAirport: arrivalAirport === 'ALL' ? undefined : arrivalAirport,
      cabinClass: cabinClass === 'ALL' ? undefined : cabinClass
    });

    // Compute estimated total cost per flight based on travelers & cabin class
    const results = list.map(f => {
      let unitPrice = f.priceEconomy;
      if (cabinClass.toLowerCase() === 'business') unitPrice = f.priceBusiness;
      if (cabinClass.toLowerCase() === 'first') unitPrice = f.priceFirst || (f.priceBusiness * 1.5);

      const estimatedTotal = unitPrice * numTravelers;
      return {
        ...f,
        selectedCabinClass: cabinClass,
        selectedTravelers: numTravelers,
        unitPrice,
        estimatedTotalFares: estimatedTotal
      };
    });

    res.status(200).json({
      success: true,
      count: results.length,
      criteria: {
        departureCity: "Dhaka, Bangladesh",
        departureAirport,
        arrivalCity: "Dubai, UAE",
        arrivalAirport,
        departureDate,
        returnDate,
        travelers: numTravelers,
        cabinClass
      },
      dataNotice: "Sample flight options for Dhaka to Dubai. Real-time availability will be confirmed by our flight desk.",
      data: results
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit flight booking request
// @route   POST /api/flights/bookings
const bookFlight = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      flightId,
      departureAirport = "DAC",
      arrivalAirport = "DXB",
      departureDate,
      returnDate,
      passengersCount = 1,
      cabinClass = "Economy",
      specialRequests
    } = req.body;

    if (!fullName || !email || !phone || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone, and departure date.'
      });
    }

    const flight = await dbService.getFlightById(flightId);
    let unitPrice = flight ? (cabinClass.toLowerCase() === 'business' ? flight.priceBusiness : flight.priceEconomy) : 45000;
    const numTravelers = parseInt(passengersCount, 10) || 1;
    const totalCost = unitPrice * numTravelers;

    const bookingPayload = {
      userId: req.user ? req.user.id : null,
      bookingType: 'FLIGHT',
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      departureCity: 'Dhaka',
      destination: 'Dubai, UAE',
      departureAirport,
      arrivalAirport,
      departureDate: new Date(departureDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      numberOfTravelers: numTravelers,
      selectedFlightId: flight ? flight.id : 'custom-flight-quote',
      selectedPackage: flight ? `${flight.airlineName} (${flight.flightNumber}) - ${cabinClass}` : 'Custom Flight Quote Request',
      totalEstimatedCost: totalCost,
      currency: 'BDT',
      specialRequests: specialRequests ? specialRequests.trim() : '',
      bookingStatus: 'PENDING'
    };

    const newBooking = await dbService.createBooking(bookingPayload);

    res.status(201).json({
      success: true,
      message: 'Flight booking request submitted successfully! Reference code generated.',
      data: newBooking
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFlights,
  searchFlights,
  bookFlight
};
