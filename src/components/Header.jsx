'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BookIt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
              Experiences
            </Link>
            <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1 smooth-transition">
              <span>Destinations</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1 smooth-transition">
              <span>Activities</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-medium smooth-transition">
              Deals & Offers
            </button>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium smooth-transition">
              Sign In
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 smooth-transition font-semibold">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 fade-in">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-blue-600 font-semibold">
                Experiences
              </Link>
              <button className="text-gray-700 hover:text-blue-600 font-medium text-left">
                Destinations
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium text-left">
                Activities
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium text-left">
                Deals & Offers
              </button>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button className="text-gray-700 font-medium text-left">
                  Sign In
                </button>
                <button className="bg-blue-600 text-white py-2 rounded-lg font-semibold">
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;