// Dubai Hotels Data
const hotelsData = [
  {
    id: "hotel-partner-demo",
    name: "TripMate Dubai Partner Hotel (Demo)",
    location: "Downtown Dubai, near Dubai Mall & Burj Khalifa",
    category: "PREMIUM",
    pricePerNight: 12500,
    currency: "BDT",
    aedPrice: 420,
    rating: 4.8,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: [
      "Burj Khalifa View",
      "Rooftop Infinity Pool",
      "Complimentary High-speed WiFi",
      "Halal & International Buffet Breakfast",
      "Free Dubai Mall Shuttle",
      "24/7 Concierge & Currency Exchange",
      "Fitness Center & Spa"
    ],
    roomTypes: [
      { name: "Deluxe Downtown View", capacity: "2 Adults", price: 12500 },
      { name: "Burj View Executive Suite", capacity: "2 Adults + 1 Child", price: 17500 },
      { name: "Family Two-Bedroom Interconnected", capacity: "4 Persons", price: 24000 }
    ],
    isPartnerHotel: true,
    discountPercent: 20,
    partnerBadgeText: "20% OFF with 3 Verified Reviews Voucher",
    description: "Our signature designated partner hotel in the heart of Downtown Dubai. Enjoy breathtaking views of the Burj Khalifa and Dubai Fountain, spacious rooms, and exclusive 20% discounts redeemable through the TripMate Travel Rewards Program."
  },
  {
    id: "hotel-rove-downtown",
    name: "Rove Downtown Dubai",
    location: "Downtown Dubai / Financial Centre Rd",
    category: "STANDARD",
    pricePerNight: 8500,
    currency: "BDT",
    aedPrice: 285,
    rating: 4.6,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Outdoor Pool",
      "Modern Gym",
      "Free WiFi",
      "Daily Breakfast Buffet",
      "Self-service Laundromat",
      "Near Metro Station"
    ],
    roomTypes: [
      { name: "Rover Room", capacity: "2 Adults", price: 8500 },
      { name: "Rover Room Burj View", capacity: "2 Adults", price: 10500 }
    ],
    isPartnerHotel: false,
    discountPercent: 0,
    description: "A trendy, vibrant lifestyle hotel offering great value in Downtown Dubai, just minutes away from The Dubai Mall."
  },
  {
    id: "hotel-citymax-burdubai",
    name: "Citymax Hotel Bur Dubai",
    location: "Bur Dubai, Historic District",
    category: "BUDGET",
    pricePerNight: 5500,
    currency: "BDT",
    aedPrice: 185,
    rating: 4.3,
    reviewsCount: 195,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Rooftop Pool",
      "Free WiFi",
      "Multiple Restaurants",
      "Near Gold & Spice Souks",
      "24/7 Front Desk"
    ],
    roomTypes: [
      { name: "Standard Twin Room", capacity: "2 Adults", price: 5500 },
      { name: "Standard Double Room", capacity: "2 Adults", price: 5500 }
    ],
    isPartnerHotel: false,
    discountPercent: 0,
    description: "Affordable, comfortable accommodation in close proximity to historic Dubai Creek, traditional souks, and metro transit."
  },
  {
    id: "hotel-address-downtown",
    name: "Address Downtown Dubai",
    location: "Sheikh Mohammed bin Rashid Blvd, Downtown",
    category: "LUXURY",
    pricePerNight: 35000,
    currency: "BDT",
    aedPrice: 1180,
    rating: 4.9,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Direct Bridge to Dubai Mall",
      "Spectacular Burj Khalifa Balconies",
      "World-class Luxury Spa",
      "Fine Dining Restaurants",
      "Limousine Chauffeur Service",
      "Infinity Cascading Pool"
    ],
    roomTypes: [
      { name: "Deluxe Lake View", capacity: "2 Adults", price: 35000 },
      { name: "Premier Fountain View", capacity: "2 Adults", price: 45000 },
      { name: "Executive Suite", capacity: "3 Adults", price: 65000 }
    ],
    isPartnerHotel: false,
    discountPercent: 0,
    description: "Iconic flagship luxury hotel standing tall right beside Burj Khalifa with direct access to The Dubai Mall."
  },
  {
    id: "hotel-millennium-marina",
    name: "Millennium Place Dubai Marina",
    location: "Dubai Marina Promenade",
    category: "PREMIUM",
    pricePerNight: 14000,
    currency: "BDT",
    aedPrice: 470,
    rating: 4.7,
    reviewsCount: 180,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Marina Waterfront Views",
      "Outdoor Heated Pool",
      "Walk to Marina Walk & JBR Beach",
      "Signature Dining",
      "Fitness Center"
    ],
    roomTypes: [
      { name: "Superior Marina View", capacity: "2 Adults", price: 14000 },
      { name: "Deluxe Balcony Room", capacity: "2 Adults", price: 17000 }
    ],
    isPartnerHotel: false,
    discountPercent: 0,
    description: "Located within the picturesque Dubai Marina, offering luxury urban harbor living and quick access to JBR beachfront."
  },
  {
    id: "hotel-atlantis-the-palm",
    name: "Atlantis The Palm",
    location: "Crescent Road, Palm Jumeirah",
    category: "LUXURY",
    pricePerNight: 42000,
    currency: "BDT",
    aedPrice: 1400,
    rating: 4.9,
    reviewsCount: 560,
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Complimentary Aquaventure Waterpark Access",
      "The Lost Chambers Aquarium",
      "Private White Sand Beach",
      "Celebrity Chef Restaurants (Nobu, Ramsay)",
      "Kids Club & Dolphin Bay"
    ],
    roomTypes: [
      { name: "Ocean King Room", capacity: "2 Adults + 1 Child", price: 42000 },
      { name: "Palm View Queen Room", capacity: "2 Adults + 2 Children", price: 48000 },
      { name: "Underwater Suite", capacity: "2 Adults", price: 120000 }
    ],
    isPartnerHotel: false,
    discountPercent: 0,
    description: "World-famous palatial ocean resort perched atop the crown of Palm Jumeirah with unmatched marine and waterpark adventures."
  }
];

module.exports = hotelsData;
