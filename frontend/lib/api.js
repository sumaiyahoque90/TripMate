const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper for authenticated requests
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tripmate_token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[TripMate API] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// Authentication Service
export const authApi = {
  async register(userData) {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('tripmate_token', res.token);
      localStorage.setItem('tripmate_user', JSON.stringify(res.user));
    }
    return res;
  },

  async login(credentials) {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('tripmate_token', res.token);
      localStorage.setItem('tripmate_user', JSON.stringify(res.user));
    }
    return res;
  },

  async getMe() {
    return await fetchApi('/auth/me');
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tripmate_token');
      localStorage.removeItem('tripmate_user');
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('tripmate_user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tripmate_token');
    }
    return null;
  }
};

// Flights Service
export const flightApi = {
  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/flights${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async search(searchData) {
    const res = await fetchApi('/flights/search', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
    return res;
  },

  async book(bookingData) {
    return await fetchApi('/flights/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
};

// Hotels Service
export const hotelApi = {
  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/hotels${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await fetchApi(`/hotels/${id}`);
    return res.data;
  },

  async book(bookingData) {
    return await fetchApi('/hotels/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
};

// Trip Planner Service
export const tripApi = {
  async estimate(estimateData) {
    const res = await fetchApi('/trips/estimate', {
      method: 'POST',
      body: JSON.stringify(estimateData),
    });
    return res.data;
  },

  async save(tripData) {
    return await fetchApi('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  async getUserTrips() {
    const res = await fetchApi('/trips');
    return res.data || [];
  }
};

// Bookings Service
export const bookingApi = {
  async create(bookingData) {
    return await fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/bookings${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await fetchApi(`/bookings/${id}`);
    return res.data;
  },

  async updateStatus(id, status) {
    return await fetchApi(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
};

// Reviews & Rewards Service
export const reviewApi = {
  async submit(reviewData) {
    return await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/reviews${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getProgress() {
    const res = await fetchApi('/reviews/progress');
    return res.data;
  },

  async updateApproval(id, approvalStatus) {
    return await fetchApi(`/reviews/${id}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ approvalStatus }),
    });
  }
};

export const rewardApi = {
  async getProgress() {
    const res = await fetchApi('/rewards/progress');
    return res.data;
  },

  async getVouchers() {
    return await fetchApi('/rewards/vouchers');
  },

  async validateVoucher(voucherCode) {
    return await fetchApi('/rewards/validate', {
      method: 'POST',
      body: JSON.stringify({ voucherCode }),
    });
  },

  async redeemVoucher(voucherCode) {
    return await fetchApi('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ voucherCode }),
    });
  }
};

// Admin Service
export const adminApi = {
  async getDashboard() {
    const res = await fetchApi('/admin/dashboard');
    return res.data;
  },

  async getBookings(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/admin/bookings${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getReviews(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/admin/reviews${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async updateBookingStatus(id, status) {
    return await fetchApi(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
};

// Destinations & Packages
export const destinationApi = {
  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/destinations${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await fetchApi(`/destinations/${id}`);
    return res.data;
  }
};

export const packageApi = {
  async getAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetchApi(`/packages${q ? `?${q}` : ''}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await fetchApi(`/packages/${id}`);
    return res.data;
  }
};

// Contact Service
export const contactApi = {
  async sendMessage(msgData) {
    return await fetchApi('/contact', {
      method: 'POST',
      body: JSON.stringify(msgData),
    });
  },

  async getMessages() {
    const res = await fetchApi('/contact');
    return res.data || [];
  }
};


// Default unified API client export
const api = {
  // Auth
  register: authApi.register,
  login: authApi.login,
  logout: authApi.logout,
  getCurrentUser: authApi.getCurrentUser,
  // Flights
  searchFlights: flightApi.searchFlights,
  bookFlight: flightApi.createBooking,
  // Hotels
  getHotels: hotelApi.getHotels,
  getPartnerHotel: hotelApi.getPartnerHotel,
  bookHotel: hotelApi.bookHotel,
  // Bookings
  createBooking: bookingApi.createBooking,
  getMyBookings: bookingApi.getMyBookings,
  getAllBookings: adminApi.getAllBookings,
  updateBookingStatus: adminApi.updateBookingStatus,
  // Trip Planner
  submitTripPlan: tripApi.savePlan,
  getTripPlans: tripApi.getPlans,
  // Reviews
  createReview: reviewApi.createReview,
  getMyReviews: reviewApi.getMyReviews,
  getAllReviews: reviewApi.getAllReviews,
  verifyReview: reviewApi.verifyReview,
  // Rewards
  getMyRewards: rewardApi.getMyRewards,
  validateVoucher: rewardApi.validateVoucher,
  getAllVouchers: adminApi.getAllVouchers,
  // Admin & Contact
  getAdminStats: adminApi.getStats,
  submitContactMessage: contactApi.sendMessage,
  getContactMessages: contactApi.getMessages,
  // Destinations & Packages
  getDestinations: destinationApi.getAll,
  getPackages: packageApi.getAll
};

export default api;
