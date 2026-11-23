'use client';

import React, { useState } from 'react';
import RewardProgressCard from '../../components/RewardProgressCard';
import BookingModal from '../../components/BookingModal';
import { Gift, Sparkles, CheckCircle2, ShieldCheck, Hotel, HelpCircle, ArrowRight, Award, Star } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Gift className="w-4 h-4 text-accent-coral" />
          <span>TripMate Loyalty Rewards</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Review 3 Times, Get <span className="text-accent-coral">20% OFF!</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          We reward our travelers for genuine community feedback. Share your Dubai journey, collect 3 verified reviews, and unlock 20% off your next stay at our partner hotel.
        </p>
      </div>

      {/* Main Reward Card */}
      <RewardProgressCard
        onBookPartnerHotel={() => setBookingModalOpen(true)}
      />

      {/* How the 4-Step Loyalty Journey Works */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-md border border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy">
            How to Unlock Your 20% Partner Hotel Voucher
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Follow this simple path to turn your feedback into direct hotel savings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '1',
              title: 'Book & Travel',
              desc: 'Book any flight, hotel, or package from Dhaka to Dubai through TripMate and enjoy your trip.'
            },
            {
              num: '2',
              title: 'Write a Review',
              desc: 'After your trip, log in and write an honest review of your hotel, sights, or tour service.'
            },
            {
              num: '3',
              title: 'Verification',
              desc: 'Our admin team reviews your feedback to ensure genuine traveler authenticity.'
            },
            {
              num: '4',
              title: 'Instant 20% Voucher',
              desc: 'Once your 3rd review is approved, your unique 20% discount code is generated automatically!'
            }
          ].map((step, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative">
              <span className="w-8 h-8 rounded-full bg-navy text-white text-xs font-black flex items-center justify-center mb-3">
                {step.num}
              </span>
              <h3 className="font-bold text-navy text-base mb-1.5">{step.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Hotel Highlight */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy text-white rounded-3xl p-6 md:p-10 shadow-xl border border-teal/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/20 text-teal text-xs font-bold uppercase mb-3">
              <Hotel className="w-4 h-4" />
              <span>Selected Partner Property</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              TripMate Dubai Partner Hotel (Demo)
            </h2>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6">
              Strategically located in Al Barsha within a 5-minute stroll to Mall of the Emirates and the Dubai Metro Red Line. Features rooftop swimming pool with Burj Al Arab views, international Halal restaurant, and spacious family suites.
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-xs mb-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal" />
                <span>Standard Rate: ৳7,500/night</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-coral font-bold" />
                <span>With 20% Voucher: ৳6,000/night</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal" />
                <span>Complimentary Breakfast</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal" />
                <span>Free Airport Shuttle Service</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-teal text-navy font-black text-xs md:text-sm hover:bg-teal-light transition-all shadow-md"
            >
              Book Partner Hotel with Voucher
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-coral" />
              <span>Program Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3 text-xs text-white/80">
              <div>
                <strong className="text-white block mb-0.5">Who is eligible for the 20% discount?</strong>
                Any registered customer who submits 3 reviews for completed bookings that are verified by our team.
              </div>
              <div>
                <strong className="text-white block mb-0.5">How long is the voucher valid?</strong>
                Each generated voucher code remains active for 12 months from issuance.
              </div>
              <div>
                <strong className="text-white block mb-0.5">Can I use the voucher for flight tickets?</strong>
                The 20% discount is currently exclusive to accommodation stays at our selected partner hotel in Dubai.
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-teal hover:underline"
              >
                <span>Go to Customer Dashboard to submit a review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialBookingType="HOTEL"
        initialItemName="TripMate Dubai Partner Hotel (Demo)"
        initialPriceBDT={7500}
        initialTravelers={2}
        initialRoute="Al Barsha, Dubai (Near Mall of the Emirates)"
        isPartnerHotel={true}
      />
    </div>
  );
}
