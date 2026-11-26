-- TripMate schema (PostgreSQL / NeonDB). Safe to re-run on an empty database.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('customer','admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE booking_type AS ENUM ('flight','hotel','package','personalized'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE booking_status AS ENUM ('pending','confirmed','completed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE review_status AS ENUM ('pending','approved','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE voucher_status AS ENUM ('active','redeemed','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE hotel_category AS ENUM ('budget','standard','premium','luxury'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. flights (demo / sample flight info, modular for future airline API)
CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  airline VARCHAR(120) NOT NULL,
  flight_number VARCHAR(20),
  origin_code CHAR(3) NOT NULL DEFAULT 'DAC',
  destination_code CHAR(3) NOT NULL CHECK (destination_code IN ('DXB','DWC')),
  destination_name VARCHAR(160) NOT NULL,
  departure_time TIME,
  arrival_time TIME,
  duration_minutes INT CHECK (duration_minutes > 0),
  cabin_class VARCHAR(20) NOT NULL DEFAULT 'economy' CHECK (cabin_class IN ('economy','premium_economy','business','first')),
  estimated_price_bdt NUMERIC(12,2) NOT NULL CHECK (estimated_price_bdt >= 0),
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_flights_dest ON flights(destination_code) WHERE is_active;

-- 5. hotels
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  category hotel_category NOT NULL,
  price_per_night_bdt NUMERIC(12,2) NOT NULL CHECK (price_per_night_bdt >= 0),
  facilities TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  room_types JSONB NOT NULL DEFAULT '[]',
  is_partner BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON hotels(category);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price_per_night_bdt);

-- 7. travel_packages
CREATE TABLE IF NOT EXISTS travel_packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  nights INT NOT NULL CHECK (nights > 0),
  hotel_id INT REFERENCES hotels(id) ON DELETE SET NULL,
  airport_code CHAR(3) CHECK (airport_code IN ('DXB','DWC')),
  inclusions TEXT[] NOT NULL DEFAULT '{}',
  price_per_person_bdt NUMERIC(12,2) NOT NULL CHECK (price_per_person_bdt >= 0),
  image_url TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. reward_vouchers
CREATE TABLE IF NOT EXISTS reward_vouchers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_hotel_id INT REFERENCES hotels(id) ON DELETE SET NULL,
  discount_percent INT NOT NULL DEFAULT 20 CHECK (discount_percent BETWEEN 1 AND 100),
  status voucher_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((status = 'redeemed') = (redeemed_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_vouchers_user ON reward_vouchers(user_id);

-- 2. bookings (unified parent record)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type booking_type NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  departure_city VARCHAR(80) NOT NULL DEFAULT 'Dhaka',
  destination VARCHAR(80) NOT NULL DEFAULT 'Dubai',
  airport_code CHAR(3) CHECK (airport_code IN ('DXB','DWC')),
  package_id INT REFERENCES travel_packages(id) ON DELETE SET NULL,
  departure_date DATE,
  return_date DATE,
  travelers INT NOT NULL DEFAULT 1 CHECK (travelers BETWEEN 1 AND 20),
  estimated_total_bdt NUMERIC(12,2) CHECK (estimated_total_bdt >= 0),
  discount_bdt NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_bdt >= 0),
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (return_date IS NULL OR departure_date IS NULL OR return_date >= departure_date)
);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 4. flight_bookings
CREATE TABLE IF NOT EXISTS flight_bookings (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  flight_id INT REFERENCES flights(id) ON DELETE SET NULL,
  cabin_class VARCHAR(20) NOT NULL DEFAULT 'economy',
  passengers JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. hotel_bookings
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  hotel_id INT REFERENCES hotels(id) ON DELETE SET NULL,
  room_type VARCHAR(80),
  nights INT CHECK (nights > 0),
  voucher_id INT UNIQUE REFERENCES reward_vouchers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. trip_plans
CREATE TABLE IF NOT EXISTS trip_plans (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
  airport_code CHAR(3) NOT NULL CHECK (airport_code IN ('DXB','DWC')),
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  travelers INT NOT NULL CHECK (travelers BETWEEN 1 AND 20),
  budget_bdt NUMERIC(12,2) NOT NULL CHECK (budget_bdt > 0),
  hotel_category hotel_category NOT NULL,
  activities TEXT[] NOT NULL DEFAULT '{}',
  preferences TEXT,
  estimate JSONB NOT NULL,
  itinerary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (return_date >= departure_date)
);
CREATE INDEX IF NOT EXISTS idx_trip_plans_user ON trip_plans(user_id);

-- 9. reviews (must reference a completed booking; one review per booking)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(160),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 20),
  status review_status NOT NULL DEFAULT 'pending',
  reviewed_by INT REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_user_status ON reviews(user_id, status);

-- Reward program settings (single row, admin configurable)
CREATE TABLE IF NOT EXISTS reward_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  partner_hotel_id INT REFERENCES hotels(id) ON DELETE SET NULL,
  reviews_required INT NOT NULL DEFAULT 3 CHECK (reviews_required > 0),
  discount_percent INT NOT NULL DEFAULT 20 CHECK (discount_percent BETWEEN 1 AND 100),
  voucher_valid_days INT NOT NULL DEFAULT 180 CHECK (voucher_valid_days > 0),
  eligible_room_types TEXT[] NOT NULL DEFAULT '{}',
  conditions TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at triggers
DO $$ DECLARE t TEXT; BEGIN
  FOREACH t IN ARRAY ARRAY['users','flights','hotels','travel_packages','reward_vouchers','bookings','trip_plans','reviews','reward_settings'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated ON %1$s; CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON %1$s FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
  END LOOP;
END $$;
