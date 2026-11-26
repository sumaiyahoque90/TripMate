const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(b = {}) {
  const errors = {};
  const full_name = String(b.full_name || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const phone = String(b.phone || "").trim();
  const password = String(b.password || "");
  if (full_name.length < 2 || full_name.length > 120) errors.full_name = "Enter your full name.";
  if (!EMAIL.test(email) || email.length > 255) errors.email = "Enter a valid email address.";
  if (phone && !/^[+\d][\d\s-]{6,20}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  if (password.length < 8 || password.length > 72) errors.password = "Password must be 8 to 72 characters.";
  return { errors, value: { full_name, email, phone: phone || null, password } };
}

export function validateLogin(b = {}) {
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const errors = {};
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return { errors, value: { email, password } };
}

const AIRPORTS = ["DXB", "DWC"];
const CABINS = ["economy", "premium_economy", "business", "first"];
const CATS = ["budget", "standard", "premium", "luxury"];
const TYPES = ["flight", "hotel", "package", "personalized"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);
const posInt = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
export { AIRPORTS, CABINS, CATS };

function checkDates(b, errors, { depRequired, retRequired }) {
  const dep = b.departure_date ? String(b.departure_date) : null;
  const ret = b.return_date ? String(b.return_date) : null;
  if (dep && !DATE.test(dep)) errors.departure_date = "Invalid date.";
  else if (dep && dep < today()) errors.departure_date = "Departure cannot be in the past.";
  if (ret && !DATE.test(ret)) errors.return_date = "Invalid date.";
  if (depRequired && !dep) errors.departure_date = "Choose a departure date.";
  if (retRequired && !ret) errors.return_date = "Choose a return date.";
  if (dep && ret && !errors.return_date && ret < dep) errors.return_date = "Return must be on or after departure.";
  return { dep, ret };
}

export function validateFlightSearch(b = {}) {
  const errors = {};
  const airport = String(b.airport || "");
  if (!AIRPORTS.includes(airport)) errors.airport = "Choose DXB or DWC.";
  const { dep, ret } = checkDates({ departure_date: b.departure_date ?? b.departure, return_date: b.return_date ?? b.return }, errors, { depRequired: true });
  const travelers = posInt(b.travelers);
  if (!travelers || travelers > 9) errors.travelers = "1 to 9 travelers.";
  const cabin = String(b.cabin || "economy");
  if (!CABINS.includes(cabin)) errors.cabin = "Invalid cabin.";
  return { errors, value: { airport, departure: dep, ret, travelers, cabin } };
}

export function validateBooking(b = {}) {
  const errors = {};
  const type = String(b.type || "");
  if (!TYPES.includes(type)) errors.type = "Choose a booking type.";
  const full_name = String(b.full_name || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const phone = String(b.phone || "").trim();
  if (full_name.length < 2 || full_name.length > 120) errors.full_name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!/^[+\d][\d\s-]{6,20}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  const travelers = type === "personalized" ? 1 : posInt(b.travelers); // personalized trips take travelers from the saved plan
  if (!travelers || travelers > 20) errors.travelers = "1 to 20 travelers.";
  const airport_code = b.airport_code ? String(b.airport_code) : null;
  if (airport_code && !AIRPORTS.includes(airport_code)) errors.airport_code = "Choose DXB or DWC.";
  const { dep, ret } = checkDates(b, errors, { depRequired: type !== "personalized", retRequired: type === "hotel" });
  const cabin_class = String(b.cabin_class || "economy");
  if (!CABINS.includes(cabin_class)) errors.cabin_class = "Invalid cabin.";
  const flight_id = b.flight_id ? posInt(b.flight_id) : null;
  const hotel_id = b.hotel_id ? posInt(b.hotel_id) : null;
  const package_id = b.package_id ? posInt(b.package_id) : null;
  const trip_plan_id = b.trip_plan_id ? posInt(b.trip_plan_id) : null;
  if (type === "hotel" && !hotel_id) errors.hotel_id = "Select a hotel.";
  if (type === "package" && !package_id) errors.package_id = "Select a package.";
  if (type === "personalized" && !trip_plan_id) errors.trip_plan_id = "Select a saved trip plan.";
  if (type === "flight" && !airport_code && !flight_id) errors.airport_code = "Choose an airport.";
  const passengers = Array.isArray(b.passengers)
    ? b.passengers.slice(0, 20).map((p) => ({ full_name: String(p?.full_name || "").trim().slice(0, 120) })).filter((p) => p.full_name) : [];
  const special_requests = String(b.special_requests || "").trim().slice(0, 1000) || null;
  const voucher_code = String(b.voucher_code || "").trim().toUpperCase().slice(0, 40) || null;
  if (voucher_code && type !== "hotel") errors.voucher_code = "Vouchers apply to hotel bookings only.";
  return { errors, value: { type, full_name, email, phone, travelers, airport_code, departure_date: dep, return_date: ret, cabin_class,
    flight_id, hotel_id, package_id, trip_plan_id, room_type: b.room_type ? String(b.room_type).slice(0, 80) : null, passengers, special_requests, voucher_code } };
}

export function validateTripInput(b = {}) {
  const errors = {};
  const airport_code = String(b.airport_code || "");
  if (!AIRPORTS.includes(airport_code)) errors.airport_code = "Choose DXB or DWC.";
  const { dep, ret } = checkDates(b, errors, { depRequired: true, retRequired: true });
  const travelers = posInt(b.travelers);
  if (!travelers || travelers > 20) errors.travelers = "1 to 20 travelers.";
  const budget_bdt = Number(b.budget_bdt);
  if (!Number.isFinite(budget_bdt) || budget_bdt < 1000 || budget_bdt > 1e9) errors.budget_bdt = "Enter a budget in BDT (at least 1,000).";
  const hotel_category = String(b.hotel_category || "");
  if (!CATS.includes(hotel_category)) errors.hotel_category = "Choose a hotel category.";
  const activities = Array.isArray(b.activities) ? [...new Set(b.activities.map(String))].slice(0, 20) : [];
  const preferences = String(b.preferences || "").trim().slice(0, 500) || null;
  if (dep && ret && dep === ret) errors.return_date = "Trip must be at least one night.";
  return { errors, value: { airport_code, departure_date: dep, return_date: ret, travelers, budget_bdt, hotel_category, activities, preferences } };
}

export function validateReview(b = {}) {
  const errors = {};
  const booking_id = posInt(b.booking_id);
  if (!booking_id) errors.booking_id = "Choose a booking.";
  const rating = Number(b.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Rating must be 1 to 5.";
  const title = String(b.title || "").trim().slice(0, 160) || null;
  const comment = String(b.comment || "").trim();
  if (comment.length < 20 || comment.length > 2000) errors.comment = "Write at least 20 characters about your experience.";
  return { errors, value: { booking_id, rating, title, comment } };
}

export function validateContact(b = {}) {
  const errors = {};
  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const subject = String(b.subject || "").trim().slice(0, 200) || null;
  const message = String(b.message || "").trim();
  if (name.length < 2 || name.length > 120) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (message.length < 10 || message.length > 3000) errors.message = "Message must be 10 to 3000 characters.";
  return { errors, value: { name, email, subject, message } };
}
