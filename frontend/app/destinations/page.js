'use client';

import React, { useState } from 'react';
import DestinationCard, { DUBAI_DESTINATIONS } from '../../components/DestinationCard';
import BookingModal from '../../components/BookingModal';
import { Compass, Search, MapPin, Sparkles, Filter } from 'lucide-react';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    itemName: 'Burj Khalifa "At The Top"',
    priceBDT: 5500,
    travelers: 2,
    route: 'Dhaka (DAC) ➔ Dubai'
  });

  const categories = [
    { id: 'ALL', label: 'All Sights' },
    { id: 'Architecture', label: 'Architecture & Icons' },
    { id: 'Adventure', label: 'Desert & Adventure' },
    { id: 'Family', label: 'Family & Theme Parks' },
    { id: 'Shopping', label: 'Shopping & Malls' },
    { id: 'Culture', label: 'Culture & Heritage' }
  ];

  const filteredDestinations = DUBAI_DESTINATIONS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Compass className="w-4 h-4 text-ocean" />
          <span>Dubai Sightseeing Catalog</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Explore Dubai's Wonders
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          From record-breaking skyscrapers and historic spice souks to tranquil desert camps, discover the highlights of Dubai.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions (e.g. Burj Khalifa, Desert)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPlanTrip={(d) => {
                setBookingModalState({
                  isOpen: true,
                  itemName: `Attraction Visit: ${d.name}`,
                  priceBDT: d.priceBDT,
                  travelers: 2,
                  route: 'Dhaka (DAC) ➔ Dubai'
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-sm">No attractions found matching "{searchQuery}". Try a different keyword.</p>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ ...bookingModalState, isOpen: false })}
        initialBookingType="CUSTOM_PLAN"
        initialItemName={bookingModalState.itemName}
        initialPriceBDT={bookingModalState.priceBDT}
        initialTravelers={bookingModalState.travelers}
        initialRoute={bookingModalState.route}
      />
    </div>
  );
}
