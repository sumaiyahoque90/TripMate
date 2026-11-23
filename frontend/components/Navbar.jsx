'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plane, 
  MapPin, 
  Building2, 
  Package, 
  Calculator, 
  Gift, 
  Mail, 
  User, 
  LayoutDashboard, 
  Menu, 
  X, 
  Sparkles,
  LogOut,
  CalendarCheck
} from 'lucide-react';
import { authApi } from '../lib/api';

const Navbar = ({ onOpenBookingModal }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Flights', href: '/flights', icon: Plane },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Hotels', href: '/hotels', icon: Building2 },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'Smart Planner', href: '/planner', icon: Calculator, badge: 'Budget' },
    { name: 'Rewards', href: '/rewards', icon: Gift, badge: '20% OFF' },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/98 backdrop-blur-md shadow-md border-b-2 border-gray-100 py-3' : 'bg-white border-b-2 border-gray-100 py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087E8B] to-[#0fa392] flex items-center justify-center text-white shadow-lg shadow-[#087E8B]/25 group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[#123047] leading-none">
                Trip<span className="text-[#087E8B]">Mate</span>
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123047]/80 mt-1">
                Dhaka ➔ Dubai Travel Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-base font-bold transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'text-[#087E8B] bg-[#D9F3EF] font-black shadow-sm' 
                      : 'text-[#123047] hover:text-[#087E8B] hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#087E8B]" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full uppercase ${
                      link.badge === '20% OFF' 
                        ? 'bg-rose-500 text-white animate-pulse shadow-sm' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & User Account */}
          <div className="hidden lg:flex items-center gap-3.5">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {currentUser.role === 'ADMIN' ? (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123047] text-white text-sm font-extrabold hover:bg-[#0B1E2D] transition shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#D9F3EF]" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-[#123047] text-sm font-extrabold hover:bg-slate-200 transition border border-gray-200"
                  >
                    <User className="w-4 h-4 text-[#087E8B]" />
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'My Account'}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-[#123047] hover:bg-slate-100 transition border-2 border-gray-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white text-sm font-extrabold transition shadow-md shadow-[#087E8B]/20 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#123047] hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-gray-100 bg-white px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-bold text-[#123047] hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                {link.icon && <link.icon className="w-5 h-5 text-[#087E8B]" />}
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={currentUser.role === 'ADMIN' ? '/admin' : '/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-[#123047] text-white text-center font-bold text-sm rounded-xl"
              >
                Go to {currentUser.role === 'ADMIN' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center border-2 border-gray-200 text-[#123047] font-bold text-sm rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center bg-[#087E8B] text-white font-bold text-sm rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
