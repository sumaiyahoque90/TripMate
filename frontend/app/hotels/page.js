'use client';

import React, { useState, useEffect } from 'react';
import HotelCard, { DUBAI_HOTELS } from '../../components/HotelCard';
import BookingModal from '../../components/BookingModal';
import { Hotel, Sparkles, Search, Filter, ShieldCheck, Tag, Gift, MapPin } from 'lucide-react';

export default function HotelsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [partnerOnly, setPartnerOnly] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    itemName: 'TripMate Dubai Partner Hotel (Demo)',
    priceBDT: 7500,
    travelers: 2,
    route: 'Al Barsha, Dubai',
    isPartnerHotel: true
  });

  // Check URL query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('partner') === 'true') {
        setPartnerOnly(true);
      }
    }
  }, []);

  const filteredHotels = DUBAI_HOTELS.filter((h) => {
    if (partnerOnly && !h.isPartner) return false;
    if (selectedCategory !== 'ALL' && h.category !== selectedCategory) return false;
    if (searchLocation.trim()) {
      const q = searchLocation.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Hotel className="w-4 h-4 text-ocean" />
          <span>Curated Dubai Accommodations</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Find Your Perfect Stay in Dubai
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          From central budget-friendly family suites in Deira to 5-star beachfront resorts. Earn and redeem your 20% discount voucher at our selected partner hotel.
        </p>
      </div>

      {/* Partner Hotel Loyalty Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-6 md:p-8 text-white border border-teal/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-coral/20 border border-accent-coral/40 text-accent-coral text-xs font-extrabold uppercase">
            <Gift className="w-3.5 h-3.5" />
            <span>20% Discount Partner Program</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            TripMate Dubai Partner Hotel (Demo)
          </h2>
          <p className="text-white/80 text-xs md:text-sm max-w-2xl leading-relaxed">
            Submit 3 verified reviews to receive a unique 20% discount code applicable to all room categories at our partner hotel in Al Barsha, walking distance to Mall of the Emirates and the Dubai Metro!
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPartnerOnly(true);
            setSelectedCategory('ALL');
          }}
          className="px-6 py-3 rounded-xl bg-teal text-navy font-bold text-xs md:text-sm hover:bg-teal-light transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-accent-coral" />
          <span>View Partner Hotel Deals</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search by neighborhood */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search hotel or area (e.g. Al Barsha, Marina)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setPartnerOnly(!partnerOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              partnerOnly
                ? 'bg-accent-coral text-white shadow-sm'
                : 'bg-accent-coral/10 text-accent-coral hover:bg-accent-coral/20 border border-accent-coral/30'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>20% OFF Partner Only</span>
          </button>

          {['ALL', 'BUDGET', 'STANDARD', 'PREMIUM', 'LUXURY'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setPartnerOnly(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                !partnerOnly && selectedCategory === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'ALL' ? 'All Stays' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onBookHotel={(h, room) => {
                setBookingModalState({
                  isOpen: true,
                  itemName: `${h.name} - ${room ? room.type : 'Standard Room'}`,
                  priceBDT: room ? room.priceBDT : h.priceBDT,
                  travelers: 2,
                  route: h.location,
                  isPartnerHotel: h.isPartner
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-sm">No hotels found matching your filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setPartnerOnly(false);
              setSearchLocation('');
            }}
            className="mt-3 px-4 py-2 bg-navy text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ ...bookingModalState, isOpen: false })}
        initialBookingType="HOTEL"
        initialItemName={bookingModalState.itemName}
        initialPriceBDT={bookingModalState.priceBDT}
        initialTravelers={bookingModalState.travelers}
        initialRoute={bookingModalState.route}
        isPartnerHotel={bookingModalState.isPartnerHotel}
      />
    </div>
  );
}
