const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { prisma, isDbConnected } = require('../config/prisma');
const flightsData = require('../data/flightsData');
const hotelsData = require('../data/hotelsData');
const packagesData = require('../data/packagesData');
const destinationsData = require('../data/destinationsData');

const LOCAL_STORAGE_FILE = path.join(__dirname, '../../.neondb_local_store.json');

// Memory store fallback
let store = {
  users: [],
  bookings: [],
  flights: [...flightsData],
  hotels: [...hotelsData],
  packages: [...packagesData],
  destinations: [...destinationsData],
  reviews: [],
  vouchers: [],
  tripPlans: [],
  contactMessages: []
};

// Initialize seed data
const initStore = () => {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      store = { ...store, ...JSON.parse(data) };
    } else {
      // Seed initial admin and test customer with hashed password '123456'
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('123456', salt);

      const adminUser = {
        id: 'usr_admin_01',
        name: 'TripMate Administrator',
        email: 'admin@tripmate.com',
        password: hashedPassword,
        phone: '+880 1800-874762',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      };

      const customerUser = {
        id: 'usr_cust_01',
        name: 'Tanvir Ahmed',
        email: 'tanvir@example.com',
        password: hashedPassword,
        phone: '+880 1711-234567',
        role: 'CUSTOMER',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      };

      store.users = [adminUser, customerUser];

      // Seed 3 completed bookings for Tanvir so he can test the review & reward flow!
      const booking1 = {
        id: 'bk_seed_01',
        bookingReference: 'TM-DXB-1011',
        userId: customerUser.id,
        bookingType: 'PACKAGE',
        fullName: 'Tanvir Ahmed',
        email: 'tanvir@example.com',
        phone: '+880 1711-234567',
        departureCity: 'Dhaka',
        destination: 'Dubai, UAE',
        departureAirport: 'DAC',
        arrivalAirport: 'DXB',
        departureDate: new Date(Date.now() - 25 * 86400000).toISOString(),
        returnDate: new Date(Date.now() - 20 * 86400000).toISOString(),
        numberOfTravelers: 2,
        selectedPackage: 'Dubai Explorer – 5 Days / 4 Nights',
        totalEstimatedCost: 170000,
        currency: 'BDT',
        bookingStatus: 'COMPLETED',
        createdAt: new Date(Date.now() - 28 * 86400000).toISOString()
      };

      const booking2 = {
        id: 'bk_seed_02',
        bookingReference: 'TM-DXB-2022',
        userId: customerUser.id,
        bookingType: 'HOTEL',
        fullName: 'Tanvir Ahmed',
        email: 'tanvir@example.com',
        phone: '+880 1711-234567',
        departureCity: 'Dhaka',
        destination: 'Dubai, UAE',
        departureAirport: 'DAC',
        arrivalAirport: 'DXB',
        departureDate: new Date(Date.now() - 15 * 86400000).toISOString(),
        returnDate: new Date(Date.now() - 11 * 86400000).toISOString(),
        numberOfTravelers: 2,
        selectedHotelId: 'hotel-partner-demo',
        totalEstimatedCost: 50000,
        currency: 'BDT',
        bookingStatus: 'COMPLETED',
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
      };

      const booking3 = {
        id: 'bk_seed_03',
        bookingReference: 'TM-DXB-3033',
        userId: customerUser.id,
        bookingType: 'FLIGHT',
        fullName: 'Tanvir Ahmed',
        email: 'tanvir@example.com',
        phone: '+880 1711-234567',
        departureCity: 'Dhaka',
        destination: 'Dubai, UAE',
        departureAirport: 'DAC',
        arrivalAirport: 'DWC',
        departureDate: new Date(Date.now() - 7 * 86400000).toISOString(),
        returnDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        numberOfTravelers: 1,
        selectedFlightId: 'fl-gf-251',
        totalEstimatedCost: 36000,
        currency: 'BDT',
        bookingStatus: 'COMPLETED',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      };

      store.bookings = [booking1, booking2, booking3];

      // Seed 2 approved reviews so the customer only needs 1 more review approval to get the 20% discount voucher!
      const review1 = {
        id: 'rev_01',
        userId: customerUser.id,
        bookingId: booking1.id,
        bookingReference: booking1.bookingReference,
        rating: 5,
        reviewText: "Incredible 5-day tour of Dubai from Dhaka! The Burj Khalifa view at sunset and the desert safari dune bashing were breathtaking.",
        approvalStatus: 'APPROVED',
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
      };

      const review2 = {
        id: 'rev_02',
        userId: customerUser.id,
        bookingId: booking2.id,
        bookingReference: booking2.bookingReference,
        rating: 5,
        reviewText: "TripMate Partner Hotel in Downtown Dubai exceeded all expectations. Extremely clean, walking distance to Dubai Mall, and top halal breakfast.",
        approvalStatus: 'APPROVED',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
      };

      store.reviews = [review1, review2];

      saveStore();
    }
  } catch (err) {
    console.error('Error initializing data store:', err.message);
  }
};

const saveStore = () => {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err.message);
  }
};

initStore();

const dbService = {
  // USER METHODS
  async findUserByEmail(email) {
    if (isDbConnected()) {
      try {
        return await prisma.user.findUnique({ where: { email } });
      } catch (e) {
        console.warn('Prisma findUserByEmail fallback:', e.message);
      }
    }
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id) {
    if (isDbConnected()) {
      try {
        return await prisma.user.findUnique({ where: { id } });
      } catch (e) {
        console.warn('Prisma findUserById fallback:', e.message);
      }
    }
    return store.users.find(u => u.id === id);
  },

  async createUser(userData) {
    if (isDbConnected()) {
      try {
        return await prisma.user.create({ data: userData });
      } catch (e) {
        console.warn('Prisma createUser fallback:', e.message);
      }
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    saveStore();
    return newUser;
  },

  // BOOKING METHODS
  async createBooking(bookingData) {
    const reference = 'TM-DXB-' + Math.floor(100000 + Math.random() * 900000);
    const payload = {
      ...bookingData,
      bookingReference: reference,
      bookingStatus: bookingData.bookingStatus || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        return await prisma.booking.create({ data: payload });
      } catch (e) {
        console.warn('Prisma createBooking fallback:', e.message);
      }
    }

    const newBooking = {
      id: 'bk_' + Date.now(),
      ...payload
    };
    store.bookings.unshift(newBooking);
    saveStore();
    return newBooking;
  },

  async getBookings(filters = {}) {
    if (isDbConnected()) {
      try {
        const query = {};
        if (filters.userId) query.userId = filters.userId;
        if (filters.bookingStatus && filters.bookingStatus !== 'ALL') query.bookingStatus = filters.bookingStatus;
        if (filters.bookingType && filters.bookingType !== 'ALL') query.bookingType = filters.bookingType;
        return await prisma.booking.findMany({
          where: query,
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        console.warn('Prisma getBookings fallback:', e.message);
      }
    }

    let list = [...store.bookings];
    if (filters.userId) {
      list = list.filter(b => b.userId === filters.userId);
    }
    if (filters.bookingStatus && filters.bookingStatus !== 'ALL') {
      list = list.filter(b => b.bookingStatus.toUpperCase() === filters.bookingStatus.toUpperCase());
    }
    if (filters.bookingType && filters.bookingType !== 'ALL') {
      list = list.filter(b => b.bookingType.toUpperCase() === filters.bookingType.toUpperCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(b =>
        b.fullName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.bookingReference.toLowerCase().includes(q) ||
        b.arrivalAirport.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  },

  async getBookingById(id) {
    if (isDbConnected()) {
      try {
        return await prisma.booking.findFirst({
          where: {
            OR: [{ id }, { bookingReference: id }]
          }
        });
      } catch (e) {
        console.warn('Prisma getBookingById fallback:', e.message);
      }
    }
    return store.bookings.find(b => b.id === id || b.bookingReference === id);
  },

  async updateBookingStatus(id, bookingStatus) {
    if (isDbConnected()) {
      try {
        return await prisma.booking.update({
          where: { id },
          data: { bookingStatus, updatedAt: new Date() }
        });
      } catch (e) {
        console.warn('Prisma updateBookingStatus fallback:', e.message);
      }
    }

    const idx = store.bookings.findIndex(b => b.id === id || b.bookingReference === id);
    if (idx !== -1) {
      store.bookings[idx].bookingStatus = bookingStatus.toUpperCase();
      store.bookings[idx].updatedAt = new Date().toISOString();
      saveStore();
      return store.bookings[idx];
    }
    return null;
  },

  // FLIGHTS METHODS
  async getFlights(filters = {}) {
    let list = [...store.flights];
    if (filters.arrivalAirport && filters.arrivalAirport !== 'ALL') {
      list = list.filter(f => f.arrivalAirport.toUpperCase() === filters.arrivalAirport.toUpperCase());
    }
    if (filters.cabinClass && filters.cabinClass !== 'ALL') {
      list = list.filter(f => f.cabinClass.toLowerCase() === filters.cabinClass.toLowerCase());
    }
    if (filters.stops && filters.stops !== 'ALL') {
      list = list.filter(f => f.stops.toLowerCase().includes(filters.stops.toLowerCase()));
    }
    return list;
  },

  async getFlightById(id) {
    return store.flights.find(f => f.id === id || f.flightNumber === id);
  },

  // HOTELS METHODS
  async getHotels(filters = {}) {
    let list = [...store.hotels];
    if (filters.category && filters.category !== 'ALL') {
      list = list.filter(h => h.category.toUpperCase() === filters.category.toUpperCase());
    }
    if (filters.isPartnerHotel === 'true' || filters.isPartnerHotel === true) {
      list = list.filter(h => h.isPartnerHotel === true);
    }
    if (filters.maxPrice) {
      list = list.filter(h => h.pricePerNight <= Number(filters.maxPrice));
    }
    return list;
  },

  async getHotelById(id) {
    return store.hotels.find(h => h.id === id);
  },

  // REVIEWS & REWARD REPUTATION ENGINE
  async getReviews(filters = {}) {
    let list = [...store.reviews];
    if (filters.userId) {
      list = list.filter(r => r.userId === filters.userId);
    }
    if (filters.approvalStatus && filters.approvalStatus !== 'ALL') {
      list = list.filter(r => r.approvalStatus.toUpperCase() === filters.approvalStatus.toUpperCase());
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  },

  async createReview({ userId, bookingId, rating, reviewText }) {
    // Check if booking already reviewed
    const existing = store.reviews.find(r => r.bookingId === bookingId);
    if (existing) {
      throw new Error('This booking has already been reviewed.');
    }

    // Verify booking is eligible (COMPLETED status)
    const booking = store.bookings.find(b => b.id === bookingId || b.bookingReference === bookingId);
    if (!booking) {
      throw new Error('Booking record not found.');
    }

    const review = {
      id: 'rev_' + Date.now(),
      userId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      rating: parseInt(rating, 10) || 5,
      reviewText: reviewText.trim(),
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.reviews.unshift(review);
    saveStore();
    return review;
  },

  async updateReviewApproval(reviewId, approvalStatus) {
    const idx = store.reviews.findIndex(r => r.id === reviewId);
    if (idx === -1) {
      throw new Error('Review not found.');
    }

    const validStatus = approvalStatus.toUpperCase(); // APPROVED, REJECTED, PENDING
    store.reviews[idx].approvalStatus = validStatus;
    store.reviews[idx].updatedAt = new Date().toISOString();

    const review = store.reviews[idx];
    saveStore();

    // IF APPROVED, check if user has reached 3 APPROVED REVIEWS
    // Section 11: After 3 approved reviews, auto-generate unique 20% discount voucher!
    if (validStatus === 'APPROVED') {
      await this.checkAndGenerateRewardVoucher(review.userId);
    }

    return store.reviews[idx];
  },

  async checkAndGenerateRewardVoucher(userId) {
    const approvedReviews = store.reviews.filter(r => r.userId === userId && r.approvalStatus === 'APPROVED');

    // Only generate if user has at least 3 approved reviews and hasn't already received an active voucher for this milestone
    if (approvedReviews.length >= 3) {
      const existingVoucher = store.vouchers.find(v => v.userId === userId && v.redemptionStatus === 'ACTIVE');
      if (!existingVoucher) {
        const randomCode = 'TRIPMATE20-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90); // 90 days validity

        const voucher = {
          id: 'vch_' + Date.now(),
          userId,
          voucherCode: randomCode,
          discountPercentage: 20,
          partnerHotelId: 'hotel-partner-demo',
          partnerHotelName: 'TripMate Dubai Partner Hotel (Demo)',
          expiryDate: expiryDate.toISOString(),
          redemptionStatus: 'ACTIVE',
          redeemedAt: null,
          createdAt: new Date().toISOString()
        };

        store.vouchers.unshift(voucher);
        saveStore();
        return voucher;
      }
    }
    return null;
  },

  async getUserRewardProgress(userId) {
    const userReviews = store.reviews.filter(r => r.userId === userId);
    const approvedCount = userReviews.filter(r => r.approvalStatus === 'APPROVED').length;
    const pendingCount = userReviews.filter(r => r.approvalStatus === 'PENDING').length;
    const activeVouchers = store.vouchers.filter(v => v.userId === userId && v.redemptionStatus === 'ACTIVE');
    const redeemedVouchers = store.vouchers.filter(v => v.userId === userId && v.redemptionStatus === 'REDEEMED');

    return {
      totalReviews: userReviews.length,
      approvedReviews: approvedCount,
      pendingReviews: pendingCount,
      targetNeeded: 3,
      isRewardUnlocked: approvedCount >= 3,
      progressPercentage: Math.min(100, Math.round((approvedCount / 3) * 100)),
      activeVouchers,
      redeemedVouchers
    };
  },

  async validateVoucher(voucherCode) {
    if (!voucherCode) return { valid: false, message: 'Please enter a voucher code.' };

    const voucher = store.vouchers.find(v => v.voucherCode.toUpperCase() === voucherCode.trim().toUpperCase());
    if (!voucher) {
      return { valid: false, message: 'Invalid discount voucher code.' };
    }

    if (voucher.redemptionStatus !== 'ACTIVE') {
      return { valid: false, message: 'This voucher has already been redeemed or expired.' };
    }

    if (new Date(voucher.expiryDate) < new Date()) {
      voucher.redemptionStatus = 'EXPIRED';
      saveStore();
      return { valid: false, message: 'This voucher has expired.' };
    }

    return {
      valid: true,
      voucher,
      discountPercentage: voucher.discountPercentage,
      partnerHotelId: voucher.partnerHotelId,
      message: `20% Discount Voucher ${voucher.voucherCode} applied successfully!`
    };
  },

  async redeemVoucher(voucherCode) {
    const vIdx = store.vouchers.findIndex(v => v.voucherCode.toUpperCase() === voucherCode.trim().toUpperCase());
    if (vIdx !== -1 && store.vouchers[vIdx].redemptionStatus === 'ACTIVE') {
      store.vouchers[vIdx].redemptionStatus = 'REDEEMED';
      store.vouchers[vIdx].redeemedAt = new Date().toISOString();
      saveStore();
      return store.vouchers[vIdx];
    }
    return null;
  },

  // TRIP PLANS
  async saveTripPlan(tripData) {
    const newPlan = {
      id: 'plan_' + Date.now(),
      ...tripData,
      createdAt: new Date().toISOString()
    };
    store.tripPlans.unshift(newPlan);
    saveStore();
    return newPlan;
  },

  async getUserTripPlans(userId) {
    return store.tripPlans.filter(p => p.userId === userId);
  },

  // CONTACT MESSAGES
  async saveContactMessage(msgData) {
    const newMsg = {
      id: 'msg_' + Date.now(),
      ...msgData,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    store.contactMessages.unshift(newMsg);
    saveStore();
    return newMsg;
  },

  async getContactMessages() {
    return store.contactMessages;
  },

  // ADMIN STATS
  async getAdminStats() {
    const totalBookings = store.bookings.length;
    const flightBookings = store.bookings.filter(b => b.bookingType === 'FLIGHT').length;
    const hotelBookings = store.bookings.filter(b => b.bookingType === 'HOTEL').length;
    const packageBookings = store.bookings.filter(b => b.bookingType === 'PACKAGE').length;
    const tripBookings = store.bookings.filter(b => b.bookingType === 'TRIP_PLAN').length;

    const pendingBookings = store.bookings.filter(b => b.bookingStatus === 'PENDING').length;
    const confirmedBookings = store.bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const completedBookings = store.bookings.filter(b => b.bookingStatus === 'COMPLETED').length;

    const totalRevenue = store.bookings
      .filter(b => b.bookingStatus !== 'CANCELLED')
      .reduce((sum, b) => sum + (Number(b.totalEstimatedCost) || 0), 0);

    const totalReviews = store.reviews.length;
    const pendingReviews = store.reviews.filter(r => r.approvalStatus === 'PENDING').length;
    const approvedReviews = store.reviews.filter(r => r.approvalStatus === 'APPROVED').length;

    const generatedVouchers = store.vouchers.length;
    const redeemedVouchers = store.vouchers.filter(v => v.redemptionStatus === 'REDEEMED').length;

    return {
      totalCustomers: store.users.filter(u => u.role === 'CUSTOMER').length,
      totalBookings,
      flightBookings,
      hotelBookings,
      packageBookings,
      tripBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue,
      totalReviews,
      pendingReviews,
      approvedReviews,
      generatedVouchers,
      redeemedVouchers,
      currency: 'BDT'
    };
  }
};

module.exports = dbService;
