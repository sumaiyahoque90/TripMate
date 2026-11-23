'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, MapPin, Tag, Phone, Mail, User, 
  CheckCircle, AlertCircle, ArrowRight, Sparkles, Plane, Hotel, Clock 
} from 'lucide-react';
import api from '../../lib/api';

export default function StandaloneBookingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bookingType: 'PACKAGE',
    itemName: 'Dhaka to Dubai – Dubai Explorer',
    route: 'Dhaka (DAC) ➔ Dubai (DXB)',
    destination: 'Dubai, UAE',
    travelDate: '',
    returnDate: '',
    travelers: 2,
    voucherCode: '',
    specialRequests: ''
  });

  const [basePriceBDT, setBasePriceBDT] = useState(85000);
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('tripmate_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setFormData(prev => ({
            ...prev,
            fullName: user.name || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone
          }));
        } catch (e) {}
      }
    }
  }, []);

  const rawTotal = basePriceBDT * (formData.travelers || 1);
  const discountPercent = voucherApplied ? (voucherApplied.discountPercent || 20) : 0;
  const discountAmount = voucherApplied ? Math.round((rawTotal * discountPercent) / 100) : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyVoucher = async () => {
    if (!formData.voucherCode.trim()) return;
    setValidatingVoucher(true);
    setVoucherError('');
    try {
      const res = await api.validateVoucher(formData.voucherCode.trim());
      if (res.valid) {
        setVoucherApplied(res.voucher);
        setVoucherError('');
      } else {
        setVoucherError(res.message || 'Invalid or expired voucher');
        setVoucherApplied(null);
      }
    } catch (err) {
      setVoucherError(err.message || 'Error validating voucher');
      setVoucherApplied(null);
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleServiceChange = (serviceType) => {
    if (serviceType === 'PACKAGE') {
      setFormData(prev => ({ ...prev, bookingType: 'PACKAGE', itemName: 'Dhaka to Dubai – Dubai Explorer' }));
      setBasePriceBDT(85000);
    } else if (serviceType === 'FLIGHT') {
      setFormData(prev => ({ ...prev, bookingType: 'FLIGHT', itemName: 'DAC to DXB Flight Booking' }));
      setBasePriceBDT(48000);
    } else if (serviceType === 'HOTEL') {
      setFormData(prev => ({ ...prev, bookingType: 'HOTEL', itemName: 'TripMate Dubai Partner Hotel (Demo)' }));
      setBasePriceBDT(7500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.travelDate) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookingType: formData.bookingType,
        destination: formData.destination,
        route: formData.route,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        travelDate: formData.travelDate,
        returnDate: formData.returnDate || null,
        travelers: parseInt(formData.travelers, 10) || 1,
        selectedItem: formData.itemName,
        totalAmountBDT: finalTotal,
        voucherCode: voucherApplied ? voucherApplied.code : null,
        discountAmountBDT: discountAmount,
        specialRequests: formData.specialRequests
      };

      const result = await api.createBooking(payload);
      setConfirmedBooking(result.data || {
        referenceNumber: 'TM-DXB-' + Math.floor(100000 + Math.random() * 900000),
        ...payload,
        status: 'CONFIRMED_DEMO'
      });
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-4 h-4 text-ocean" />
          <span>TripMate Reservation Desk</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Reserve Your Dubai Journey
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Submit your travel booking request. Instant demo reservation references and vouchers are issued with zero advance payment card required.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
        {confirmedBooking ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950">Booking Confirmed (Demo)</h2>
            <p className="text-xs text-gray-500">Reference: <strong className="font-mono text-ocean">{confirmedBooking.referenceNumber}</strong></p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left text-xs md:text-sm space-y-2 border border-gray-200">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Service:</span>
                <span className="font-bold text-navy">{confirmedBooking.selectedItem || confirmedBooking.bookingType}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Route:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.route}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Lead Passenger:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Travel Date:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.travelDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Travelers:</span>
                <span className="font-bold text-gray-800">{confirmedBooking.travelers} Persons</span>
              </div>
              <div className="flex justify-between pt-2 text-base">
                <span className="font-black text-navy">Total Demo Cost:</span>
                <span className="font-black text-ocean">৳{confirmedBooking.totalAmountBDT?.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              className="px-6 py-2.5 bg-navy text-white text-xs font-bold rounded-xl"
            >
              Make Another Booking
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Service Selector Tabs */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Select Service Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'PACKAGE', label: 'Tour Package (5D/4N)', icon: Sparkles },
                  { id: 'FLIGHT', label: 'DAC ➔ DXB Flights', icon: Plane },
                  { id: 'HOTEL', label: 'Dubai Hotel Stay', icon: Hotel }
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleServiceChange(s.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        formData.bookingType === s.id
                          ? 'border-ocean bg-ocean/5 text-ocean font-bold ring-2 ring-ocean/20'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number (BD) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1712-345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Travelers *</label>
                <select
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person (Solo)' : 'Persons'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Travel Date *</label>
                <input
                  type="date"
                  required
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Return Date</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>
            </div>

            {/* 20% Discount Voucher Input */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <label className="text-xs font-bold text-navy block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-accent-coral" />
                <span>Have a 20% Loyalty Voucher Code?</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.voucherCode}
                  onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. TRIPMATE20-DXB24"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono uppercase focus:ring-2 focus:ring-ocean"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  disabled={validatingVoucher || !formData.voucherCode.trim()}
                  className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-bold disabled:opacity-50"
                >
                  {validatingVoucher ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {voucherApplied && (
                <p className="text-xs text-emerald-700 font-semibold mt-1.5">
                  ✓ 20% discount applied!
                </p>
              )}
              {voucherError && (
                <p className="text-xs text-rose-600 mt-1.5">
                  {voucherError}
                </p>
              )}
            </div>

            {/* Summary Box */}
            <div className="bg-navy text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/70 block">Estimated Demo Total ({formData.travelers} Persons):</span>
                <span className="text-3xl font-black text-teal">৳{finalTotal.toLocaleString()}</span>
                {voucherApplied && <span className="text-xs text-emerald-300 block">Includes 20% Loyalty Savings!</span>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-ocean hover:bg-ocean-dark text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-ocean/30 flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Confirm Demo Reservation'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
