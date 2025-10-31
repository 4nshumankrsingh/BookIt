'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'All Experiences', href: '/', icon: Globe },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search logic will be implemented
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/60">
      <div className="bookit-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bookit-gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="bookit-heading-sm bookit-text-gradient">
                BookIt
              </span>
              <span className="bookit-caption -mt-1">Travel Experiences</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="bookit-btn-ghost relative px-4 py-2 rounded-lg font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                <Link href={item.href} className="flex items-center space-x-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  {item.name === 'Destinations' && (
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  )}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bookit-input pl-10 pr-4 w-full"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button asChild variant="ghost" className="bookit-btn-ghost">
              <Link href="/auth/signin" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button asChild className="bookit-btn-primary">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="bookit-btn-ghost md:hidden"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
            </Button>
            <MobileMenu />
          </div>
        </div>

        {/* Mobile Search Bar - Shows when searching */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bookit-input pl-10 pr-4 w-full"
            />
          </form>
        </div>
      </div>
    </header>
  );
}