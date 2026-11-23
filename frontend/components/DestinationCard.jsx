'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Star, 
  Ticket, 
  ArrowRight, 
  CheckCircle, 
  X,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';

export const DUBAI_DESTINATIONS = [
  {
    id: 'burj-khalifa',
    name: 'Burj Khalifa – At The Top',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=800&q=80',
    location: '1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
    rating: 4.9,
    reviewsCount: 3840,
    estimatedDuration: '2 - 3 Hours',
    priceBDT: 5500,
    priceAED: 179,
    description: 'Ascend the world’s tallest tower to levels 124 and 125 for 360-degree panoramic views of Dubai, the Arabian Gulf, and the desert.',
    highlights: [
      'Fastest double-deck elevators in the world (10m/s)',
      'Outdoor observation terrace with high-powered telescopes',
      'Stunning sunset time slots overlooking Downtown Dubai fountains'
    ],
    travelTips: 'Sunset slots (4:30 PM - 6:30 PM) offer the most dramatic views and photos.'
  },
  {
    id: 'desert-safari',
    name: 'Red Dunes Desert Safari & Bedouin Camp',
    category: 'Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    location: 'Lahbab Red Sand Desert, Dubai',
    rating: 4.9,
    reviewsCount: 2950,
    estimatedDuration: '6 Hours (Afternoon)',
    priceBDT: 5800,
    priceAED: 190,
    description: 'High-octane 4x4 dune bashing across the high crimson dunes of Lahbab, followed by sandboarding, camel riding, and a 5-star BBQ buffet.',
    highlights: [
      'Exciting 4x4 Land Cruiser dune bashing with licensed desert safari drivers',
      'Camel ride, henna painting, Arabic coffee & authentic dates',
      'Live Tanoura dance, belly dancing, and thrilling fire show under starry skies'
    ],
    travelTips: 'Wear loose cotton clothes and sandals for walking in desert sands.'
  },
  {
    id: 'dubai-mall-fountain',
    name: 'The Dubai Mall & Dubai Fountain',
    category: 'Shopping',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    location: 'Financial Centre Rd, Downtown Dubai',
    rating: 4.8,
    reviewsCount: 4210,
    estimatedDuration: '4 - 6 Hours',
    priceBDT: 0,
    priceAED: 0,
    description: 'Over 1,200 shops, the Dubai Aquarium & Underwater Zoo, Olympic-sized ice rink, and the mesmerizing evening choreographed water fountains.',
    highlights: [
      'Free nightly Dubai Fountain shows every 30 minutes from 6:00 PM',
      'Walk-through gigantic Dubai Aquarium tunnel and Underwater Zoo',
      'Chinatown, Fashion Avenue, and endless international dining options'
    ],
    travelTips: 'Grab a waterside restaurant terrace seat at Souk Al Bahar for unobstructed fountain views.'
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina & JBR Walk',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    location: 'Dubai Marina / Jumeirah Beach Residence',
    rating: 4.8,
    reviewsCount: 2190,
    estimatedDuration: '3 - 5 Hours',
    priceBDT: 4200,
    priceAED: 135,
    description: 'A 7km pedestrian walkway winding alongside luxury yachts, chic waterfront cafes, and towering illuminated residential skyscrapers.',
    highlights: [
      'Luxury evening Dhow Cruise dinner through illuminated marina lagoons',
      'Direct walking access to JBR The Beach and Ain Dubai views',
      'Thrilling XLine Dubai Marina zipline over the harbor waters'
    ],
    travelTips: 'Evenings are cool and vibrant with bustling open-air cafes.'
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah & Atlantis The Palm',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
    location: 'Crescent Rd, Palm Jumeirah, Dubai',
    rating: 4.8,
    reviewsCount: 1870,
    estimatedDuration: '4 - 6 Hours',
    priceBDT: 8900,
    priceAED: 290,
    description: 'The world-famous tree-shaped artificial archipelago featuring Atlantis The Palm, Aquaventure Waterpark, and The View at The Palm.',
    highlights: [
      'Scenic monorail ride providing birds-eye view of luxury villas',
      'Aquaventure – world’s largest waterpark with over 105 slides',
      'The View at The Palm 240-meter high observation deck'
    ],
    travelTips: 'Take the Palm Monorail from Gateway station for panoramic photos of the fronds.'
  },
  {
    id: 'miracle-garden',
    name: 'Dubai Miracle Garden',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1578895101407-3a1b80d0d829?auto=format&fit=crop&w=800&q=80',
    location: 'Al Barsha South 3, Dubailand',
    rating: 4.7,
    reviewsCount: 1540,
    estimatedDuration: '2 - 3 Hours',
    priceBDT: 3200,
    priceAED: 95,
    description: 'The world’s largest natural flower garden featuring more than 150 million blooming flowers arranged in stunning 2D and 3D floral sculptures.',
    highlights: [
      'Guinness record floral Emirates A380 airplane model',
      'Heart-shaped floral tunnel pathway – perfect for couples and families',
      'Smurfs Village and giant floral Disney characters'
    ],
    travelTips: 'Open seasonally from November to April. Visit in the morning to avoid midday heat.'
  },
  {
    id: 'museum-of-the-future',
    name: 'Museum of the Future',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1644783134954-4638a2e1d09f?auto=format&fit=crop&w=800&q=80',
    location: 'Sheikh Zayed Rd, Trade Centre 2, Dubai',
    rating: 4.9,
    reviewsCount: 2260,
    estimatedDuration: '2 - 3 Hours',
    priceBDT: 5200,
    priceAED: 149,
    description: 'Recognized as one of the most beautiful buildings in the world. Features futuristic interactive exhibits imagining human life in 2071.',
    highlights: [
      'Exterior stainless steel facade wrapped in Arabic poetic calligraphy',
      'Simulated space journey to OSS Hope space station',
      'DNA vault displaying thousands of living ecosystem species'
    ],
    travelTips: 'Tickets sell out weeks in advance. TripMate reservations pre-book guaranteed entry slots.'
  },
  {
    id: 'gold-spice-souk',
    name: 'Old Dubai Gold & Spice Souk',
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1512632570417-a609802970a7?auto=format&fit=crop&w=800&q=80',
    location: 'Deira / Al Ras, Dubai Creek',
    rating: 4.7,
    reviewsCount: 3100,
    estimatedDuration: '2 - 3 Hours',
    priceBDT: 50,
    priceAED: 2,
    description: 'Immerse yourself in traditional Arabian commerce. Hundreds of shops displaying glittering 22K and 24K gold jewelry and fragrant exotic spices.',
    highlights: [
      'Traditional 1 AED Abra wooden boat ferry across Dubai Creek',
      'Tax-free certified gold jewelry with strict government hallmarking',
      'Iranian saffron, cardamom, frankincense, and Arabic perfumes'
    ],
    travelTips: 'Polite bargaining is customary and expected in the spice souk.'
  }
];

const DestinationCard = ({ destination, onPlanTrip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dest = destination || DUBAI_DESTINATIONS[0];

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-3xl border-2 border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col cursor-pointer group hover:border-[#087E8B]"
      >
        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
          <img 
            src={dest.imageUrl || dest.image} 
            alt={dest.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3.5 left-3.5 bg-[#123047] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
            {dest.category}
          </div>
          <div className="absolute top-3.5 right-3.5 bg-white text-[#123047] text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{dest.rating}</span>
          </div>
          <div className="absolute bottom-3.5 left-3.5 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D9F3EF]" />
            <span>{dest.estimatedDuration}</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#087E8B] mb-2">
              <MapPin className="w-4 h-4 text-[#087E8B]" />
              <span className="line-clamp-1">{dest.location}</span>
            </div>
            <h3 className="font-heading font-black text-xl md:text-2xl text-[#123047] group-hover:text-[#087E8B] transition-colors line-clamp-1 mb-2.5">
              {dest.name}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 font-medium mb-5">
              {dest.description}
            </p>
          </div>

          <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block uppercase font-extrabold tracking-wider">Demo Entry Fee</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-xl text-[#087E8B]">
                  {dest.priceBDT === 0 ? 'Free Entry' : `৳${dest.priceBDT?.toLocaleString()}`}
                </span>
                {dest.priceAED > 0 && (
                  <span className="text-xs font-bold text-gray-500">({dest.priceAED} AED)</span>
                )}
              </div>
            </div>

            <button 
              type="button"
              className="w-10 h-10 rounded-xl bg-[#D9F3EF] text-[#087E8B] flex items-center justify-center group-hover:bg-[#087E8B] group-hover:text-white transition-all shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-64 w-full">
              <img 
                src={dest.imageUrl || dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123047] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#087E8B] text-white uppercase tracking-wider mb-2 inline-block">
                  {dest.category}
                </span>
                <h3 className="font-heading font-black text-2xl md:text-3xl text-white">{dest.name}</h3>
                <p className="text-sm font-semibold text-white/90 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#D9F3EF]" />
                  <span>{dest.location}</span>
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <p className="text-gray-800 text-base leading-relaxed font-medium">
                {dest.description}
              </p>

              {dest.highlights && (
                <div>
                  <h4 className="font-heading font-black text-[#123047] text-base mb-3">Key Highlights</h4>
                  <div className="space-y-2">
                    {dest.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm font-medium text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dest.travelTips && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-sm text-amber-950 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950 font-black text-sm mb-0.5">Visitor Travel Tip:</strong>
                    <span>{dest.travelTips}</span>
                  </div>
                </div>
              )}

              <div className="pt-5 border-t-2 border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-bold italic">Prices are illustrative demo estimates.</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onPlanTrip) onPlanTrip(dest);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white text-sm font-black transition flex items-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Include in Smart Planner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DestinationCard;
