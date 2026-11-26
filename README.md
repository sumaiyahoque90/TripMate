# TripMate – Smart Travel Planning & Booking Platform

*Your Journey, Your Budget, Your Adventure.* Dhaka → Dubai flights, hotels, budget trip planner and a review-to-reward program.

One Next.js 14 (App Router) app. Frontend and backend are both Next.js. Database is NeonDB PostgreSQL via `pg` with native, parameterized SQL. No ORM, no Express.

## Setup
1. `npm install` (Node 20.9+). Uses Next.js 16.4.6 and React 19; `npm audit` reports 0 vulnerabilities at release time.
2. Create a Neon project and copy its connection string.
3. `cp .env.example .env` and fill in `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. `npm run db:setup` applies `database/schema.sql`, loads `database/seed.sql` (only if empty) and creates the admin user.
   Manual alternative: paste `schema.sql`, then `seed.sql`, into the Neon SQL Editor.
5. `npm run dev` then open http://localhost:3000. Sign in at `/login` with the admin account to reach `/admin`.
6. Optional: with the app running, `npm run test:e2e` runs 88 API checks (needs `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`; set `BASE` if not on port 3000). **Run it against a development database**, it creates test users and bookings.

## What is implemented
- Homepage, flight search + sample flights, airport comparison (DXB/DWC), hotel discovery with filters and detail pages, Dubai destination guide, smart budget planner (estimate, itinerary, recommendations, save and book), contact form.
- Unified booking (flight / hotel / package / personalized) with unique `TM-XXXXXX` reference, status workflow `pending → confirmed → completed`, cancellation, server-computed totals. No payments.
- Auth: bcrypt hashing, signed httpOnly session cookie, roles re-read from the database on every request, `proxy.js` (Next 16 middleware) plus server-side checks on every admin route/page, same-origin check on JSON endpoints.
- Rewards: reviews only for completed bookings, one per booking (DB unique), admin approval, rating never affects eligibility, automatic `TRIPMATE20-XXXXX` voucher in the approval transaction, backend validation, one-time redemption (row lock), expiry, restore on cancellation, discount applies to hotel accommodation only.
- Admin: stats, booking management, review moderation, reward settings (partner hotel, rooms, discount, expiry, conditions), vouchers, CRUD for hotels/flights/packages (archive, not delete), contact inbox.
- Transactions (`withTransaction`) for booking creation, voucher redemption and review approval/reward generation.

## Design decisions to know
- All prices are demo estimates stored in the database or `lib/planner.js` (`CONFIG`) and clearly labeled. No live flight/hotel data. Flight data is modular: replace `/api/flights/search` with an airline API later.
- Attractions live in `lib/dubai.js` (not a DB table, since the spec fixes 11 tables).
- Vouchers apply to **Hotel only** bookings at the configured partner hotel.
- A rejected review is final for that booking.
- The demo partner hotel is labeled as not an actual commercial partnership.

## Known limitations
- No rate limiting on login/contact (add one, e.g. Upstash, before launch). No email notifications. No password reset.
- Hotel/destination photos load from Unsplash and Google Fonts from their CDNs; broken images fall back to a gradient.
- Verified: schema/seed on PostgreSQL 16, 88 API/business-rule checks, production build, authenticated and anonymous page rendering. **Not verified:** visual layout in real browsers on phone/tablet (layouts use responsive Tailwind breakpoints; please eyeball them), and a live Neon connection (tested on local PostgreSQL).
