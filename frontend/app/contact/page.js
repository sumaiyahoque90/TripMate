'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '../../lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Dubai Vacation Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.submitContactMessage(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <MessageSquare className="w-4 h-4 text-ocean" />
          <span>Get in Touch with TripMate</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          We’re Here to Help You Travel
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Have questions about Dhaka to Dubai flights, custom holiday packages, or our 20% hotel discount? Our travel specialists in Dhaka and Dubai are ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-navy mb-6">Send Us a Direct Message</h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Thank You for Reaching Out!</h3>
              <p className="text-xs md:text-sm text-emerald-800 max-w-md mx-auto">
                Your message has been registered. One of our Dubai travel advisors will contact you shortly via email or WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: 'Dubai Vacation Inquiry', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-navy text-white text-xs font-bold rounded-xl"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="e.g. tanvir@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1712-345678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean bg-white"
                  >
                    <option value="Dubai Vacation Inquiry">Dubai Vacation Inquiry</option>
                    <option value="Dhaka to Dubai Flight Booking">Dhaka to Dubai Flight Booking</option>
                    <option value="Dubai Explorer Package Details">Dubai Explorer Package Details</option>
                    <option value="20% Partner Hotel Voucher">20% Partner Hotel Voucher</option>
                    <option value="UAE Tourist Visa Assistance">UAE Tourist Visa Assistance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your planned travel dates, number of travelers, budget expectations, or any specific requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-ocean hover:bg-ocean-dark text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-ocean/20 flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending Message...' : 'Send Message to Travel Desk'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Offices & Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dhaka Office Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-ocean text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Dhaka Headquarters</span>
            </div>
            <h3 className="text-lg font-bold text-navy">TripMate Bangladesh</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Level 7, Platinum Tower, Road 11, Block D, Banani / Gulshan, Dhaka 1213, Bangladesh.
            </p>
            <div className="text-xs text-gray-700 space-y-1 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-ocean" />
                <span>+880 2 988-7654 / +880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ocean" />
                <span>dhaka@tripmate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-ocean" />
                <span>Saturday – Thursday: 9:00 AM – 8:00 PM (BST)</span>
              </div>
            </div>
          </div>

          {/* Dubai Office Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-teal text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Dubai Operations Desk</span>
            </div>
            <h3 className="text-lg font-bold text-navy">TripMate UAE Operations</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Suite 1402, The Citadel Tower, Business Bay, Dubai, United Arab Emirates.
            </p>
            <div className="text-xs text-gray-700 space-y-1 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-ocean" />
                <span>+971 4 456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ocean" />
                <span>dubai@tripmate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-ocean" />
                <span>Sunday – Thursday: 9:00 AM – 6:00 PM (GST)</span>
              </div>
            </div>
          </div>

          {/* Emergency 24/7 Helpline */}
          <div className="bg-navy text-white rounded-3xl p-6 shadow-md border border-teal/20">
            <h4 className="text-sm font-bold text-teal flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-accent-coral" />
              <span>24/7 International Traveler Support</span>
            </h4>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              Already in Dubai or flying today? Reach our dedicated WhatsApp emergency team anytime for airport transfer coordination or hotel assistance.
            </p>
            <div className="font-mono text-sm font-bold text-white bg-white/10 px-3 py-2 rounded-xl text-center">
              WhatsApp: +880 1712-345678
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
