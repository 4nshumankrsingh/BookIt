'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, Menu, X, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookIt
              </span>
              <div className="text-xs text-gray-500 -mt-1">Travel Experiences</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 transition-colors duration-200"
            >
              Experiences
            </Link>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1 transition-colors duration-200">
              <span>Destinations</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1 transition-colors duration-200">
              <span>Activities</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Deals & Offers
            </Button>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Sign In
            </Button>
            <Button className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold shadow-md">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden p-2">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Navigation Header */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      BookIt
                    </span>
                    <div className="text-xs text-gray-500 -mt-1">Travel Experiences</div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1">
                  <div className="space-y-6">
                    <Link 
                      href="/" 
                      className="block text-blue-600 font-semibold text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Experiences
                    </Link>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 text-lg p-0 h-auto font-normal">
                      Destinations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 text-lg p-0 h-auto font-normal">
                      Activities
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 text-lg p-0 h-auto font-normal">
                      Deals & Offers
                    </Button>
                  </div>
                </nav>

                {/* Mobile User Actions */}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <Button variant="outline" className="w-full justify-center">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="w-full justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;