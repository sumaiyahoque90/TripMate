-- DEMO DATA ONLY. All prices are configurable estimates in BDT, not live pricing.
-- Admin user is created by: node scripts/setup-db.js (uses ADMIN_EMAIL / ADMIN_PASSWORD).

INSERT INTO hotels (name, location, category, price_per_night_bdt, facilities, description, image_url, room_types, is_partner) VALUES
('Marina Budget Stay (Demo)', 'Deira', 'budget', 7500, ARRAY['Free WiFi','Air conditioning','24h reception'], 'Simple, clean rooms close to the Deira metro line. Good for travelers who plan to spend most of the day out.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', '[{"name":"Standard Double","extra":0},{"name":"Twin Room","extra":500}]', FALSE),
('Creek Side Inn (Demo)', 'Bur Dubai', 'standard', 13500, ARRAY['Free WiFi','Breakfast','Pool','Airport shuttle'], 'Comfortable mid-range hotel near the historic creek and abra stations.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', '[{"name":"Deluxe Room","extra":0},{"name":"Family Room","extra":3500}]', FALSE),
('Downtown Skyline Hotel (Demo)', 'Downtown Dubai', 'premium', 24000, ARRAY['Free WiFi','Breakfast','Pool','Gym','Burj Khalifa view'], 'Modern rooms a short walk from Dubai Mall and the Dubai Fountain.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', '[{"name":"Premium Room","extra":0},{"name":"Skyline Suite","extra":8000}]', FALSE),
('Palm Horizon Resort (Demo)', 'Palm Jumeirah', 'luxury', 48000, ARRAY['Private beach','Spa','Pool','Fine dining','Gym','Kids club'], 'Beachfront resort with spa, multiple restaurants and island views.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', '[{"name":"Sea View Room","extra":0},{"name":"Beach Villa","extra":22000}]', FALSE),
('Marina Walk Suites (Demo)', 'Dubai Marina', 'premium', 26000, ARRAY['Free WiFi','Pool','Gym','Kitchenette','Marina view'], 'Apartment-style suites on the Marina promenade with tram access.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', '[{"name":"One Bedroom Suite","extra":0}]', FALSE),
('TripMate Dubai Partner Hotel (Demo)', 'Dubai Marina', 'standard', 16000, ARRAY['Free WiFi','Breakfast','Pool','Gym'], 'Demonstration partner hotel for the TripMate Travel Rewards program. Not an actual commercial partnership.', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200', '[{"name":"Deluxe Room","extra":0},{"name":"Deluxe Twin","extra":1000}]', TRUE);

INSERT INTO flights (airline, flight_number, destination_code, destination_name, departure_time, arrival_time, duration_minutes, cabin_class, estimated_price_bdt) VALUES
('Demo Airline A', 'DM101', 'DXB', 'Dubai International Airport', '09:30', '13:15', 345, 'economy', 52000),
('Demo Airline B', 'DM205', 'DXB', 'Dubai International Airport', '22:10', '02:00', 350, 'economy', 48000),
('Demo Airline A', 'DM330', 'DXB', 'Dubai International Airport', '11:00', '14:45', 345, 'business', 128000),
('Demo Airline C', 'DM412', 'DWC', 'Al Maktoum International Airport', '06:45', '10:40', 355, 'economy', 44000),
('Demo Airline C', 'DM418', 'DWC', 'Al Maktoum International Airport', '19:20', '23:15', 355, 'premium_economy', 71000);

INSERT INTO travel_packages (name, description, nights, hotel_id, airport_code, inclusions, price_per_person_bdt, image_url) VALUES
('Dubai Essentials (Demo)', '4 nights, city highlights, great for first-time visitors.', 4, 2, 'DXB', ARRAY['Return flight estimate','4 nights hotel','Airport transfers','Burj Khalifa ticket'], 115000, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200'),
('Dubai Family Escape (Demo)', '5 nights near the Marina with desert safari.', 5, 6, 'DXB', ARRAY['Return flight estimate','5 nights hotel','Desert safari','Breakfast daily'], 148000, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200'),
('Dubai Budget Saver via DWC (Demo)', '4 nights, lower-cost airport option.', 4, 1, 'DWC', ARRAY['Return flight estimate','4 nights hotel'], 82000, 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200'),
('Dubai Luxury Week (Demo)', '6 nights on Palm Jumeirah.', 6, 4, 'DXB', ARRAY['Business class estimate','6 nights resort','Private transfers','Spa credit'], 420000, 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200');

INSERT INTO reward_settings (id, partner_hotel_id, reviews_required, discount_percent, voucher_valid_days, eligible_room_types, conditions)
VALUES (1, 6, 3, 20, 180, ARRAY['Deluxe Room','Deluxe Twin'], 'Discount applies to hotel accommodation charges only. One-time use. Demo program.')
ON CONFLICT (id) DO NOTHING;
