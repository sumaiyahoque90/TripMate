# TripMate – Smart Travel Planning & International Booking Platform

> **"Your Journey, Your Budget, Your Adventure."**  
> *"Fly to Dubai. Plan Your Stay. Explore More. Save More."*

TripMate is a full-stack international travel agency platform engineered for Bangladeshi travelers traveling from Dhaka (Hazrat Shahjalal International Airport - DAC) to Dubai, United Arab Emirates (comparing Dubai International Airport - DXB and Al Maktoum International Airport - DWC).

---

## 🌟 Key Features

### 1. ✈️ Dhaka to Dubai Flight Search & Dual-Airport Hub
- Direct route search from Dhaka (DAC) to Dubai International (DXB) and Al Maktoum International (DWC).
- Side-by-side airport comparison guide (DXB for city central convenience vs. DWC for budget savings).
- Major airline schedules (Biman Bangladesh Airlines, Emirates, Flydubai, US-Bangla).
- Economy and Business class fare estimates in Bangladeshi Taka (BDT / ৳) and baggage guidelines.

### 2. 🧮 Smart Personalized Trip Planner
- Interactive budget calculator that balances travel days (3–14 days), number of travelers, and total BDT budget.
- Dynamic cost breakdown:
  - **Flights:** DAC to DXB/DWC return estimates with cabin class multipliers.
  - **Hotels:** Budget, Standard, Premium, or 5-Star Luxury room night rates.
  - **Food:** Halal cafeterias to fine-dining allowances per person/day.
  - **Attractions:** Customizable checklist of top Dubai sights.
- Real-time **Within Budget** / **Over Budget** indicator.

### 3. 🏨 Curated Dubai Hotels & 20% Partner Hotel
- Handpicked properties in prime districts: Downtown, Al Barsha, Dubai Marina, Deira, and Palm Jumeirah.
- Features **TripMate Dubai Partner Hotel (Demo)** in Al Barsha near Mall of the Emirates.
- Integrated voucher validation: apply code `TRIPMATE20-XXXXX` for an instant 20% discount on hotel bookings!

### 4. 🎁 TripMate Loyalty Program ("Review 3 Times, Get 20% OFF!")
- Transparent 4-step loyalty progression:
  1. Book & travel to Dubai.
  2. Write an authentic review with rating and comments.
  3. TripMate admin reviews and verifies the submission.
  4. Once **3 verified reviews** are approved, the platform automatically issues a unique 20% discount voucher (`TRIPMATE20-XXXXX`) valid for 12 months at the partner hotel.

### 5. 🌴 Signature International Package (Dhaka to Dubai – Dubai Explorer)
- **Duration:** 5 Days / 4 Nights
- **Price:** ৳85,000 per person (Demo Estimate)
- **Day-by-Day Interactive Timeline:**
  - Day 1: Dhaka departure, Dubai arrival, VIP private transfer, Marina Dhow Cruise Dinner.
  - Day 2: Modern Dubai City Tour & Burj Khalifa "At The Top" (124th/125th floor).
  - Day 3: Red Dunes Desert Safari 4x4 dune bashing, camel ride, BBQ buffet & Tanoura fire show.
  - Day 4: Palm Jumeirah monorail, Miracle Garden / Museum of the Future, traditional souks.
  - Day 5: Souvenir shopping, check-out, airport transfer, and flight back to Dhaka.

### 6. 📊 Dashboards & Role-Based Access Control
- **Customer Dashboard:** Manage reservations, track loyalty progress, view vouchers, submit reviews.
- **Admin Dashboard:** Real-time KPI metrics, booking status management, review verification queue with 1-click Approve/Reject (auto-unlocking vouchers upon 3rd approval), and inquiry monitoring.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | **Next.js 14 (App Router)**, React 18, Tailwind CSS, Lucide React icons, JavaScript (ES6+) |
| **Backend** | **Node.js + Express.js**, REST API, JWT authentication, bcryptjs, CORS |
| **Database** | **NeonDB PostgreSQL** with **Prisma ORM** (`DATABASE_URL`) + resilient fallback store |
| **Styling** | Custom Tailwind theme (Ocean Blue `#087E8B`, Deep Navy `#123047`, Accent Soft Teal `#D9F3EF`, Coral `#FF5A5F`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### 1. Installation
Clone the repository and install dependencies:

```bash
# In project root
npm --prefix backend install --strict-ssl=false
npm --prefix frontend install --strict-ssl=false
```

### 2. Environment Configuration

#### Backend (`backend/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://user:password@ep-demo-pooler.ap-southeast-1.aws.neon.tech/tripmate_db?sslmode=require"
JWT_SECRET="tripmate_jwt_super_secret_production_key_2026"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### 3. Run Application

#### Option A: One-Click Startup Scripts
- **Windows Batch:** Double-click `start.bat`
- **PowerShell:** Run `./start-dev.ps1`

#### Option B: Manual Command Line

**Terminal 1 (Backend - Port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend - Port 3000):**
```bash
cd frontend
npm run dev
```

Now open **http://localhost:3000** in your web browser.

---

## 👥 Demo Credentials

For testing and demonstration, use the following pre-configured credentials or the 1-click buttons on the login page:

| Role | Email | Password | Perks |
|---|---|---|---|
| **Verified Customer** | `tanvir@example.com` | `123456` | Has 3 bookings, 2 verified reviews (1 away from 20% voucher!) |
| **Platform Administrator** | `admin@tripmate.com` | `123456` | Full access to review verification queue & booking statuses |

---

## 🛡️ License
TripMate is licensed under the MIT License. Demo prices and airline schedules are realistic estimates designed for travel planning.
