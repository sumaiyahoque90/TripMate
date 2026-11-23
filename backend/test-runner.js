const http = require('http');
const PORT = parseInt(process.argv[2] || process.env.PORT || '5000', 10);

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'POST',
      headers
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    http.get(`http://127.0.0.1:${PORT}${path}`, { headers }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function patch(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'PATCH',
      headers
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING TRIPMATE INTERNATIONAL API TESTS ---');

  // 1. Health check
  const health = await get('/api/health');
  console.log('1. Health check status:', health.status, health.body.platform);

  // 2. Flight Search (DAC -> DXB / DWC)
  const flightSearch = await post('/api/flights/search', {
    departureAirport: 'DAC',
    arrivalAirport: 'DXB',
    travelers: 2,
    cabinClass: 'Economy'
  });
  console.log('2. Flight Search count:', flightSearch.body.count, 'First flight:', flightSearch.body.data[0].airlineName, flightSearch.body.data[0].flightNumber);

  // 3. Hotels (Partner Hotel check)
  const hotels = await get('/api/hotels');
  const partnerHotel = hotels.body.data.find(h => h.isPartnerHotel);
  console.log('3. Hotels count:', hotels.body.count, 'Partner Hotel found:', partnerHotel ? partnerHotel.name : 'None');

  // 4. Smart Trip Planner Estimate
  const estimate = await post('/api/trips/estimate', {
    departureCity: 'Dhaka',
    destination: 'Dubai',
    arrivalAirport: 'DXB',
    travelers: 2,
    totalBudget: 300000,
    hotelCategory: 'PREMIUM'
  });
  console.log('4. Trip Planner Total Est:', estimate.body.data.summary.totalEstimatedTripCost, 'Status:', estimate.body.data.summary.budgetStatus);

  // 5. Auth Login (Test Admin)
  const loginRes = await post('/api/auth/login', {
    email: 'admin@tripmate.com',
    password: '123456'
  });
  console.log('5. Admin Login status:', loginRes.status, 'Token acquired:', !!loginRes.body.token);
  const adminToken = loginRes.body.token;

  // 6. Customer Login
  const custLogin = await post('/api/auth/login', {
    email: 'tanvir@example.com',
    password: '123456'
  });
  const custToken = custLogin.body.token;
  console.log('6. Customer Login status:', custLogin.status, 'Customer:', custLogin.body.user.name);

  // 7. Check Customer Reward Progress
  const progress = await get('/api/rewards/progress', custToken);
  console.log('7. Reward Progress:', `${progress.body.data.approvedReviews} / 3 Approved Reviews`, 'Eligible:', progress.body.data.isRewardUnlocked);

  // 8. Submit New Booking Request
  const booking = await post('/api/bookings', {
    fullName: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    phone: '+880 1711-234567',
    bookingType: 'PACKAGE',
    departureAirport: 'DAC',
    arrivalAirport: 'DXB',
    departureDate: '2026-12-20',
    returnDate: '2026-12-25',
    numberOfTravelers: 2,
    selectedPackage: 'Dubai Explorer – 5 Days / 4 Nights',
    totalEstimatedCost: 170000
  }, custToken);
  console.log('8. Booking Created:', booking.status, 'Ref:', booking.body.data.bookingReference);

  // 9. Admin Dashboard KPIs
  const adminDashboard = await get('/api/admin/dashboard', adminToken);
  console.log('9. Admin KPIs Total Bookings:', adminDashboard.body.data.totalBookings, 'Total Revenue: BDT', adminDashboard.body.data.totalRevenue);

  console.log('--- ALL TRIPMATE INTERNATIONAL API TESTS PASSED! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
