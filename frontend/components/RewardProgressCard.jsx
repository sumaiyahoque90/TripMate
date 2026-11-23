'use client';

import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle2, Clock, Sparkles, Copy, Check, Hotel, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import api from '../lib/api';

export default function RewardProgressCard({ 
  onBookPartnerHotel,
  initialData = null,
  compact = false 
}) {
  const [rewardData, setRewardData] = useState(initialData || {
    approvedReviewsCount: 2,
    reviewsNeededForDiscount: 3,
    progressPercentage: 66,
    hasUnlockedDiscount: false,
    activeVouchers: []
  });
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData && typeof window !== 'undefined') {
      const token = localStorage.getItem('tripmate_token');
      if (token) {
        api.getMyRewards()
          .then(data => {
            if (data && data.data) {
              setRewardData(data.data);
            }
          })
          .catch(() => {
            // Default demo state for unauthenticated preview
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [initialData]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const approved = rewardData.approvedReviewsCount || 0;
  const needed = rewardData.reviewsNeededForDiscount || 3;
  const remaining = Math.max(0, needed - approved);
  const isUnlocked = rewardData.hasUnlockedDiscount || approved >= needed;
  const activeVouchers = rewardData.activeVouchers || [];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123047] via-[#1B4565] to-[#0B1E2D] text-white p-6 md:p-10 shadow-2xl border-2 border-[#087E8B]/40">
      {/* Background Decorative Rings */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#087E8B]/25 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#D9F3EF]/20 blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9F3EF]/20 border border-[#D9F3EF]/40 text-[#D9F3EF] text-xs md:text-sm font-black tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>TripMate Loyalty Rewards</span>
        </div>
        <span className="text-xs md:text-sm text-white/90 font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D9F3EF]" /> Verified Traveler Exclusive
        </span>
      </div>

      {/* Title & Promotion */}
      <div className="mb-8 relative z-10">
        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          Review 3 Times, Get <span className="text-amber-300 bg-amber-400/20 px-3 py-1 rounded-xl border border-amber-300/40">20% OFF!</span>
        </h3>
        <p className="text-white/90 text-base md:text-lg mt-3 max-w-3xl leading-relaxed font-medium">
          Share your authentic travel experience after completed trips. Collect 3 verified reviews to instantly unlock an exclusive 20% discount voucher redeemable at our selected <strong className="text-[#D9F3EF] font-black">TripMate Dubai Partner Hotel (Demo)</strong>.
        </p>
      </div>

      {/* Visual 3-Step Milestone Tracker */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-8 border border-white/15">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs md:text-sm uppercase tracking-wider text-[#D9F3EF] font-black">Loyalty Milestone Progress</span>
          <span className="text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full bg-white/20 text-white">
            {approved} of {needed} Reviews Approved
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-8">
          <div 
            className="bg-gradient-to-r from-[#D9F3EF] to-[#087E8B] h-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, (approved / needed) * 100)}%` }}
          />
        </div>

        {/* 3 Step Nodes */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[1, 2, 3].map((stepNum) => {
            const isCompleted = approved >= stepNum;
            const isNext = approved === stepNum - 1;
            return (
              <div key={stepNum} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-base md:text-lg mb-2.5 transition-transform duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-400/30' 
                      : isNext 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/30 animate-pulse'
                        : 'bg-white/20 text-white/50 border-2 border-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                  ) : isNext ? (
                    <Clock className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span className="text-xs md:text-sm font-black text-white">Review #{stepNum}</span>
                <span className={`text-xs mt-1 font-bold ${
                  isCompleted ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-white/40'
                }`}>
                  {isCompleted ? 'Verified ✓' : isNext ? 'Ready to Review' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Reward Voucher Area or Motivational Banner */}
      <div className="relative z-10">
        {isUnlocked || activeVouchers.length > 0 ? (
          <div className="bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-6 mb-6 shadow-inner">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-emerald-300 font-black text-base uppercase tracking-wide">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Congratulations! 20% Voucher Unlocked</span>
                </div>
                <p className="text-white/95 text-sm md:text-base mt-1.5 font-medium">
                  You earned a 20% discount on your next stay at <strong className="text-white font-black">TripMate Dubai Partner Hotel (Demo)</strong>.
                </p>
                {activeVouchers.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {activeVouchers.map((v) => (
                      <div key={v.id || v.code} className="inline-flex items-center gap-2.5 bg-black/50 border-2 border-emerald-400 rounded-xl px-4 py-2 font-mono text-base font-black text-emerald-200">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span>{v.code}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(v.code)}
                          className="ml-1.5 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-emerald-300"
                          title="Copy Voucher Code"
                        >
                          {copiedCode === v.code ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-2.5 bg-black/50 border-2 border-emerald-400 rounded-xl px-4 py-2 font-mono text-base font-black text-emerald-200">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>TRIPMATE20-DXB24</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('TRIPMATE20-DXB24')}
                      className="ml-1.5 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-emerald-300"
                    >
                      {copiedCode === 'TRIPMATE20-DXB24' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link
                  href="/hotels?partner=true"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white font-black text-sm md:text-base transition-all shadow-lg"
                >
                  <Hotel className="w-5 h-5" />
                  <span>Book Partner Hotel (20% OFF)</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white/10 rounded-2xl p-5 border border-white/15">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#D9F3EF]/20 flex items-center justify-center text-[#D9F3EF] shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <p className="text-sm md:text-base text-white/95 font-medium">
                You are <strong className="text-amber-300 font-black">{remaining} more {remaining === 1 ? 'review' : 'reviews'}</strong> away from unlocking the 20% discount on our Dubai Partner Hotel!
              </p>
            </div>
            <Link
              href="/dashboard#my-reviews"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-black whitespace-nowrap transition-colors"
            >
              <span>Submit a Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Terms footnote */}
      <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-white/70 font-medium">
        <span>* Valid for verified customers on completed bookings. One 20% voucher per 3 approved reviews.</span>
        <span>Demo Promotion for TripMate Travelers</span>
      </div>
    </div>
  );
}
