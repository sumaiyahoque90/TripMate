const dbService = require('../services/dbService');

// @desc    Calculate smart personalized trip estimate
// @route   POST /api/trips/estimate
const estimateTrip = async (req, res, next) => {
  try {
    const {
      departureCity = "Dhaka",
      destination = "Dubai",
      arrivalAirport = "DXB", // DXB or DWC
      departureDate,
      returnDate,
      travelers = 2,
      totalBudget = 250000,
      hotelCategory = "STANDARD",
      preferredAttractions = []
    } = req.body;

    const numTravelers = Math.max(1, parseInt(travelers, 10) || 1);
    const budgetVal = Math.max(10000, Number(totalBudget) || 200000);

    // Calculate duration in days and nights
    let nights = 4;
    let days = 5;
    if (departureDate && returnDate) {
      const d1 = new Date(departureDate);
      const d2 = new Date(returnDate);
      const diffDays = Math.round((d2 - d1) / (1000 * 3600 * 24));
      if (diffDays > 0) {
        nights = diffDays;
        days = diffDays + 1;
      }
    }

    // 1. FLIGHT ESTIMATE
    // DWC flights are generally more economical than DXB
    let baseReturnFlightPerPerson = arrivalAirport === 'DWC' ? 36000 : 44000;
    if (hotelCategory === 'LUXURY') baseReturnFlightPerPerson = 95000; // Business class expectation
    const totalFlightExpenses = baseReturnFlightPerPerson * numTravelers;

    // 2. HOTEL ESTIMATE
    const roomsCount = Math.ceil(numTravelers / 2);
    let nightlyRate = 8500; // Standard
    if (hotelCategory === 'BUDGET') nightlyRate = 5500;
    if (hotelCategory === 'PREMIUM') nightlyRate = 13500;
    if (hotelCategory === 'LUXURY') nightlyRate = 35000;
    const totalHotelExpenses = nightlyRate * nights * roomsCount;

    // 3. FOOD EXPENSES (3 meals/day in Dubai)
    let dailyFoodPerPerson = 2200; // ~70 AED / day
    if (hotelCategory === 'BUDGET') dailyFoodPerPerson = 1500;
    if (hotelCategory === 'PREMIUM') dailyFoodPerPerson = 3200;
    if (hotelCategory === 'LUXURY') dailyFoodPerPerson = 6000;
    const totalFoodExpenses = dailyFoodPerPerson * days * numTravelers;

    // 4. LOCAL TRANSPORTATION EXPENSES
    // Metro card + occasional taxis/airport transfers
    let dailyTransportPerPerson = 1200; // ~40 AED / day
    if (hotelCategory === 'LUXURY') dailyTransportPerPerson = 3500; // Private chauffeur
    const totalTransportExpenses = (dailyTransportPerPerson * days * numTravelers) + (3000 * roomsCount); // includes airport pickup

    // 5. ATTRACTIONS & ACTIVITIES
    // Burj Khalifa (5,500), Desert Safari (4,200), City Tour (2,500)
    let activitiesPerPerson = 12200;
    if (preferredAttractions && preferredAttractions.length > 0) {
      activitiesPerPerson = preferredAttractions.length * 3500;
    }
    const totalActivitiesExpenses = activitiesPerPerson * numTravelers;

    // TOTAL CALCULATION
    const totalEstimatedTripCost = totalFlightExpenses + totalHotelExpenses + totalFoodExpenses + totalTransportExpenses + totalActivitiesExpenses;
    const costPerPerson = Math.round(totalEstimatedTripCost / numTravelers);
    const remainingBudget = budgetVal - totalEstimatedTripCost;

    // BUDGET STATUS
    let budgetStatus = 'WITHIN_BUDGET';
    if (remainingBudget < 0 && Math.abs(remainingBudget) <= budgetVal * 0.15) {
      budgetStatus = 'SLIGHTLY_OVER';
    } else if (remainingBudget < 0) {
      budgetStatus = 'OVER_BUDGET';
    }

    // SMART RECOMMENDATIONS
    const recommendations = [];
    if (arrivalAirport === 'DXB' && budgetStatus === 'OVER_BUDGET') {
      recommendations.push({
        type: 'FLIGHT',
        tip: 'Consider landing at Al Maktoum Airport (DWC) to save approx. BDT 8,000 per traveler on flight tickets.'
      });
    }
    if (hotelCategory === 'LUXURY' && budgetStatus !== 'WITHIN_BUDGET') {
      recommendations.push({
        type: 'HOTEL',
        tip: 'Switching to our designated TripMate Dubai Partner Hotel (4-Star Premium) saves up to BDT 20,000 per night while unlocking an extra 20% loyalty discount.'
      });
    }
    recommendations.push({
      type: 'METRO',
      tip: 'Purchase a Dubai RTA Silver Nol Card at DXB terminal for budget-friendly metro & bus transit across Dubai.'
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          departureCity,
          destination,
          arrivalAirport,
          days,
          nights,
          travelers: numTravelers,
          totalBudget: budgetVal,
          totalEstimatedTripCost,
          costPerPerson,
          remainingBudget,
          budgetStatus
        },
        expenseBreakdown: {
          flightExpenses: totalFlightExpenses,
          flightPerPerson: baseReturnFlightPerPerson,
          hotelExpenses: totalHotelExpenses,
          hotelNightlyRate: nightlyRate,
          roomsCount,
          foodExpenses: totalFoodExpenses,
          foodPerPersonDaily: dailyFoodPerPerson,
          transportationExpenses: totalTransportExpenses,
          activitiesExpenses: totalActivitiesExpenses
        },
        recommendations,
        dataNotice: "Estimates are illustrative demo calculations for vacation planning and budget allocation."
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save custom trip plan
// @route   POST /api/trips
const saveTrip = async (req, res, next) => {
  try {
    const tripData = {
      userId: req.user ? req.user.id : null,
      ...req.body
    };

    const saved = await dbService.saveTripPlan(tripData);
    res.status(201).json({
      success: true,
      message: 'Personalized trip plan saved to your profile!',
      data: saved
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user saved trip plans
// @route   GET /api/trips
const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const trips = await dbService.getUserTripPlans(userId);
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  estimateTrip,
  saveTrip,
  getUserTrips
};
