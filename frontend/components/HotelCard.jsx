'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Check, 
  Gift, 
  ArrowRight, 
  Sparkles,
  CalendarCheck,
  X,
  ShieldCheck,
  Info
} from 'lucide-react';

export const DUBAI_HOTELS = [
  {
    id: 'tripmate-partner-hotel',
    name: 'TripMate Dubai Partner Hotel (Demo)',
    category: 'STANDARD',
    isPartner: true,
    isPartnerHotel: true,
    rating: 4.9,
    reviewsCount: 312,
    location: 'Al Barsha 1, Dubai (500m from Mall of the Emirates)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    priceBDT: 7500,
    pricePerNight: 7500,
    priceAED: 245,
    distanceToMetro: '3 min walk to Mall of the Emirates Metro Station',
    description: 'Our premier official hospitality partner in Dubai. Premium 4-star amenities, rooftop pool with Burj Al Arab views, authentic Halal restaurant, and 20% discount for TripMate verified reviewers.',
    highlights: [
      'Unlock 20% OFF with 3 verified customer reviews',
      'Free high-speed shuttle to JBR Beach and Kite Beach',
      'Complimentary international & Bengali breakfast options'
    ],
    facilities: ['Rooftop Swimming Pool', 'Free High-speed Wi-Fi', '24/7 Room Service', 'Fitness Center & Sauna', 'Airport Shuttle'],
    rooms: [
      { type: 'Superior Queen Room', priceBDT: 7500, maxGuests: 2 },
      { type: 'Deluxe Twin City View', priceBDT: 9200, maxGuests: 2 },
      { type: 'Family Executive Suite', priceBDT: 13500, maxGuests: 4 }
    ]
  },
  {
    id: 'deira-creek-budget-hotel',
    name: 'Al Bandar Creek Hotel Dubai',
    category: 'BUDGET',
    isPartner: false,
    isPartnerHotel: false,
    rating: 4.5,
    reviewsCount: 198,
    location: 'Baniyas Square, Deira, Dubai',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    priceBDT: 3500,
    pricePerNight: 3500,
    priceAED: 115,
    distanceToMetro: '2 min walk to Baniyas Square Metro Station',
    description: 'Affordable, clean, and highly convenient for Bangladeshi shoppers visiting Gold and Spice Souks. Direct access to Deira markets and creek abra boats.',
    highlights: [
      'Super affordable rate in historical Deira district',
      'Surrounded by dozens of Bangladeshi and Halal restaurants',
      'Direct Metro Red Line connection to Dubai Airport'
    ],
    facilities: ['Free Wi-Fi', 'Daily Housekeeping', 'Air Conditioning', 'Elevator', '24-hour Front Desk'],
    rooms: [
      { type: 'Standard Double', priceBDT: 3500, maxGuests: 2 },
      { type: 'Family Room (3 Beds)', priceBDT: 5200, maxGuests: 3 }
    ]
  },
  {
    id: 'marina-waterfront-suites',
    name: 'Marina Bay View Hotel & Suites',
    category: 'PREMIUM',
    isPartner: false,
    isPartnerHotel: false,
    rating: 4.8,
    reviewsCount: 420,
    location: 'Dubai Marina Walk, Dubai Marina',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    priceBDT: 11500,
    pricePerNight: 11500,
    priceAED: 375,
    distanceToMetro: '5 min walk to Sobha Realty Metro & Dubai Tram',
    description: 'Scenic apartment hotel overlooking luxury yachts in Dubai Marina. Features private balconies, kitchenettes, and infinity pool.',
    highlights: [
      'Floor-to-ceiling marina skyline views from private balconies',
      'Walking distance to JBR Beach and Ain Dubai',
      'Full kitchen facilities ideal for family stays'
    ],
    facilities: ['Infinity Pool', 'Spa & Wellness', 'Marina Terrace Cafe', 'Valet Parking', 'Concierge'],
    rooms: [
      { type: '1-Bedroom Marina View Suite', priceBDT: 11500, maxGuests: 2 },
      { type: '2-Bedroom Grand Suite', priceBDT: 18500, maxGuests: 4 }
    ]
  },
  {
    id: 'downtown-luxury-palace',
    name: 'Downtown Grand View & Residences',
    category: 'LUXURY',
    isPartner: false,
    isPartnerHotel: false,
    rating: 4.9,
    reviewsCount: 512,
    location: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    priceBDT: 22000,
    pricePerNight: 22000,
    priceAED: 720,
    distanceToMetro: 'Direct air-conditioned link to Burj Khalifa / Dubai Mall Metro',
    description: 'Iconic 5-star luxury at the doorstep of Burj Khalifa and The Dubai Mall. Unsurpassed hospitality, fine dining, and VIP services.',
    highlights: [
      'Direct view of Burj Khalifa and Dubai Fountain shows',
      'Award-winning Michelin-starred restaurants on premises',
      'World-class spa and private butler service'
    ],
    facilities: ['Heated Pool', 'Burj View Terrace', 'Luxury Spa', 'Chauffeur Service', 'Executive Lounge'],
    rooms: [
      { type: 'Burj View Deluxe Room', priceBDT: 22000, maxGuests: 2 },
      { type: 'Presidential Suite', priceBDT: 45000, maxGuests: 4 }
    ]
  },
  {
    id: 'al-barsha-standard-comfort',
    name: 'Rose Park Hotel Al Barsha',
    category: 'STANDARD',
    isPartner: false,
    isPartnerHotel: false,
    rating: 4.7,
    reviewsCount: 280,
    location: 'Opposite Sharaf DG Metro, Al Barsha 1, Dubai',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    priceBDT: 6500,
    pricePerNight: 6500,
    priceAED: 215,
    distanceToMetro: 'Directly across from Mashreq Metro Station',
    description: 'Convenient 4-star city hotel with exceptional metro connectivity, comfortable spacious rooms, and great value for family travelers.',
    highlights: [
      'Directly opposite Metro station for 15-min ride to Downtown',
      'Close to supermarkets, pharmacies, and dining',
      'Swimming pool and modern fitness center'
    ],
    facilities: ['Swimming Pool', 'Free Wi-Fi', 'Fitness Center', 'On-site Restaurant', 'Tour Desk'],
    rooms: [
      { type: 'Standard King', priceBDT: 6500, maxGuests: 2 },
      { type: 'Deluxe Twin Room', priceBDT: 7800, maxGuests: 2 }
    ]
  },
  {
    id: 'palm-jumeirah-resort',
    name: 'Anantara Palm Dubai Luxury Resort',
    category: 'LUXURY',
    isPartner: false,
    isPartnerHotel: false,
    rating: 4.9,
    reviewsCount: 389,
    location: 'East Crescent, Palm Jumeirah, Dubai',
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    priceBDT: 31000,
    pricePerNight: 31000,
    priceAED: 1015,
    distanceToMetro: 'Private resort limousine service',
    description: 'Exclusive Thai-inspired beachfront resort on the Palm Jumeirah frond featuring UAE’s only over-water lagoon villas.',
    highlights: [
      'Private 400-meter sandy beach on the Arabian Gulf',
      'Over-water villas and lagoon access rooms',
      'Water sports, Turkish hammam, and beachfront cabanas'
    ],
    facilities: ['Private Beach', 'Lagoon Pools', 'Water Sports', 'Kids Club', 'Multiple Fine Dining Venues'],
    rooms: [
      { type: 'Lagoon View Room', priceBDT: 31000, maxGuests: 2 },
      { type: 'Over Water Villa', priceBDT: 58000, maxGuests: 2 }
    ]
  }
];

const HotelCard = ({ hotel, onBookHotel }) => {
  const [showDetail, setShowDetail] = useState(false);
  const h = hotel || DUBAI_HOTELS[0];

  const categoryColors = {
    BUDGET: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    STANDARD: 'bg-blue-100 text-blue-900 border-blue-300',
    PREMIUM: 'bg-purple-100 text-purple-900 border-purple-300',
    LUXURY: 'bg-amber-100 text-amber-900 border-amber-300',
  };

  const isPartner = h.isPartner || h.isPartnerHotel;
  const price = h.priceBDT || h.pricePerNight || 7500;

  return (
    <>
      <div className={`bg-white rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden group shadow-md hover:shadow-2xl ${
        isPartner ? 'border-[#087E8B] ring-4 ring-[#087E8B]/15' : 'border-gray-200'
      }`}>
        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
          <img 
            src={h.image} 
            alt={h.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {isPartner && (
            <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <Gift className="w-4 h-4" />
              <span>Partner Hotel • 20% Voucher Eligible</span>
            </div>
          )}

          {!isPartner && (
            <div className={`absolute top-3.5 left-3.5 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border-2 backdrop-blur-md ${categoryColors[h.category] || 'bg-gray-100 text-gray-800'}`}>
              {h.category}
            </div>
          )}

          <div className="absolute top-3.5 right-3.5 bg-white text-[#123047] text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{h.rating} ({h.reviewsCount || 100})</span>
          </div>

          <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D9F3EF] flex-shrink-0" />
            <span className="truncate">{h.distanceToMetro || h.location}</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              <Building2 className="w-4 h-4 text-[#087E8B]" />
              <span className="line-clamp-1">{h.location}</span>
            </div>

            <h3 className="font-heading font-black text-xl md:text-2xl text-[#123047] group-hover:text-[#087E8B] transition-colors line-clamp-1 mb-2.5">
              {h.name}
            </h3>

            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 font-medium mb-5">
              {h.description}
            </p>

            {isPartner && (
              <div className="mb-5 p-3.5 bg-[#D9F3EF] rounded-2xl border-2 border-[#087E8B]/30 flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-[#087E8B] flex-shrink-0" />
                <span className="text-xs md:text-sm text-[#123047] font-bold">
                  Review 3 times to unlock <strong className="text-[#087E8B] font-black">20% OFF</strong> at this hotel!
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block uppercase font-extrabold tracking-wider">Demo Rate / Night</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-2xl text-[#087E8B]">
                  ৳{price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 font-bold">/ night</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#087E8B] text-[#123047] hover:text-white text-xs md:text-sm font-black transition flex items-center gap-1.5 border border-gray-300 hover:border-[#087E8B]"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-64 w-full">
              <img 
                src={h.image} 
                alt={h.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123047] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    isPartner ? 'bg-amber-500 text-white' : 'bg-[#087E8B] text-white'
                  }`}>
                    {isPartner ? '★ TripMate Official Partner' : h.category}
                  </span>
                  <span className="text-xs text-amber-300 font-black flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {h.rating} ({h.reviewsCount || 100} reviews)
                  </span>
                </div>
                <h3 className="font-heading font-black text-2xl md:text-3xl text-white">{h.name}</h3>
                <p className="text-sm font-semibold text-white/90 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#D9F3EF]" />
                  <span>{h.location}</span>
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {isPartner && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3">
                  <Gift className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950 font-black text-sm md:text-base mb-1">
                      TripMate Travel Rewards Eligible Property:
                    </strong>
                    <span className="text-xs md:text-sm font-medium leading-relaxed">
                      Complete 3 verified reviews to automatically receive a <strong>20% discount voucher</strong> applicable to this partner hotel!
                    </span>
                  </div>
                </div>
              )}

              <p className="text-gray-800 text-base leading-relaxed font-medium">
                {h.description}
              </p>

              {/* Highlights */}
              {h.highlights && (
                <div>
                  <h4 className="font-heading font-black text-[#123047] text-base mb-3">Property Highlights</h4>
                  <div className="space-y-2">
                    {h.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm font-medium text-gray-700">
                        <Check className="w-4 h-4 text-[#087E8B] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div>
                <h4 className="font-heading font-black text-[#123047] text-base mb-3">Facilities & Services</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {h.facilities && h.facilities.map((fac, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Check className="w-4 h-4 text-[#087E8B]" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms Selection */}
              {h.rooms && (
                <div>
                  <h4 className="font-heading font-black text-[#123047] text-base mb-3">Available Room Types</h4>
                  <div className="space-y-2.5">
                    {h.rooms.map((room, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 bg-gray-50/70 text-sm">
                        <div>
                          <span className="font-black text-[#123047] block text-base">{room.type}</span>
                          <span className="text-gray-600 text-xs font-bold">Max {room.maxGuests} Guests</span>
                        </div>
                        <div className="text-right flex items-center gap-3.5">
                          <span className="font-black text-[#087E8B] text-base md:text-lg">৳{room.priceBDT.toLocaleString()} / night</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDetail(false);
                              if (onBookHotel) onBookHotel(h, room);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#087E8B] text-white font-black text-xs hover:bg-[#066772]"
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-5 border-t-2 border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold block">Starting Demo Rate</span>
                  <span className="font-heading font-black text-2xl text-[#123047]">
                    ৳{price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ night</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDetail(false);
                    if (onBookHotel) onBookHotel(h, null);
                  }}
                  className="px-7 py-3 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white text-sm font-black transition flex items-center gap-2 shadow-md"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Hotel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelCard;
