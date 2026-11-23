'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plane, 
  MapPin, 
  Phone, 
  Mail, 
  Gift, 
  ShieldCheck, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  ArrowRight,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#123047] text-gray-200 border-t-4 border-[#087E8B]">
      {/* Top Banner Feature Bar */}
      <div className="bg-[#0B1E2D] border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#087E8B]/25 flex items-center justify-center text-[#D9F3EF] flex-shrink-0">
                <Plane className="w-7 h-7 -rotate-45" />
              </div>
              <div>
                <h4 className="text-white font-black text-base">Dhaka ➔ Dubai Flight Booking</h4>
                <p className="text-gray-300 text-sm mt-0.5 font-medium">Direct quotes for DXB & DWC airports</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/25 flex items-center justify-center text-amber-300 flex-shrink-0">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-black text-base">Review 3 Times, Get 20% OFF</h4>
                <p className="text-gray-300 text-sm mt-0.5 font-medium">Designated Dubai partner hotel discount</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#087E8B]/25 flex items-center justify-center text-[#D9F3EF] flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-black text-base">Smart Budget Calculation</h4>
                <p className="text-gray-300 text-sm mt-0.5 font-medium">Transparent realistic cost estimations in BDT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087E8B] to-[#0fa392] flex items-center justify-center text-white shadow-lg">
                <Plane className="w-6 h-6 -rotate-45" />
              </div>
              <span className="font-heading font-black text-3xl text-white">
                Trip<span className="text-[#087E8B]">Mate</span>
              </span>
            </Link>

            <p className="text-base text-gray-300 leading-relaxed max-w-sm font-medium">
              Your Journey, Your Budget, Your Adventure. Fly to Dubai. Plan Your Stay. Explore More. Save More. Specializing in seamless international travel requests from Bangladesh.
            </p>

            <div className="flex items-center gap-3 pt-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#087E8B] flex items-center justify-center text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#087E8B] flex items-center justify-center text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#087E8B] flex items-center justify-center text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#087E8B] flex items-center justify-center text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#087E8B] flex items-center justify-center text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3.5">
            <h5 className="font-heading font-black text-white text-lg">Quick Links</h5>
            <Link href="/flights" className="text-gray-300 hover:text-white transition text-sm font-semibold">DAC ➔ DXB Flights</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Dubai Attractions</Link>
            <Link href="/hotels" className="text-gray-300 hover:text-white transition text-sm font-semibold">Dubai Hotels</Link>
            <Link href="/packages" className="text-gray-300 hover:text-white transition text-sm font-semibold">Dubai Explorer (5D/4N)</Link>
            <Link href="/planner" className="text-gray-300 hover:text-white transition text-sm font-semibold">Smart Budget Planner</Link>
            <Link href="/rewards" className="text-amber-300 hover:text-white transition text-sm font-bold">20% Partner Discount</Link>
          </div>

          {/* Top Sights */}
          <div className="flex flex-col gap-3.5">
            <h5 className="font-heading font-black text-white text-lg">Dubai Sights</h5>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Burj Khalifa "At The Top"</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Red Dunes Desert Safari</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Dubai Marina & Cruise</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Palm Jumeirah & Atlantis</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Dubai Miracle Garden</Link>
            <Link href="/destinations" className="text-gray-300 hover:text-white transition text-sm font-semibold">Museum of the Future</Link>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3.5">
            <h5 className="font-heading font-black text-white text-lg">Dhaka & Dubai Desks</h5>
            <div className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
              <MapPin className="w-5 h-5 text-[#087E8B] shrink-0 mt-0.5" />
              <span>Level 7, Platinum Tower, Banani, Dhaka 1213</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
              <Phone className="w-5 h-5 text-[#087E8B] shrink-0" />
              <span>+880 1712-345678 (24/7)</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
              <Mail className="w-5 h-5 text-[#087E8B] shrink-0" />
              <span>support@tripmate.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
              <Clock className="w-5 h-5 text-[#087E8B] shrink-0" />
              <span>Sat – Thu: 9 AM – 8 PM (BST)</span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} TripMate International. All rights reserved.</p>
          <p className="text-center md:text-right text-gray-400">
            * All flight schedules and package prices are demo estimates in Bangladeshi Taka (BDT).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
