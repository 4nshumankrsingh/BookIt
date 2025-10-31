'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, User, Plane, Globe, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'Experiences', href: '/', icon: Globe },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Flights', href: '/flights', icon: Plane },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search logic will be implemented
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/60">
      <div className="bookit-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Nexis */}
<Link href="/" className="flex items-center space-x-3 group shrink-0">
  <Compass className="w-8 h-8 text-blue-600" />
  <div className="flex flex-col">
    <span className="text-xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Nexis
    </span>
    <span className="text-xs text-muted-foreground -mt-1">Travel & Experiences</span>
  </div>
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mx-8">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="relative px-6 py-2 rounded-lg font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                <Link href={item.href} className="flex items-center space-x-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations, experiences, flights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full border-border focus:border-blue-500 transition-colors"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4 shrink-0 ml-8">
            <Button 
              asChild 
              variant="ghost" 
              className="text-foreground/80 hover:text-foreground hover:bg-accent px-4 py-2"
            >
              <Link href="/auth/signin" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button 
              asChild 
              className="bg-linear-to-br from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 px-6 py-2"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-3 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => document.getElementById('mobile-search')?.focus()}
            >
              <Search className="w-5 h-5" />
            </Button>
            <MobileMenu />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4 border-t border-border mt-2 pt-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="mobile-search"
              type="text"
              placeholder="Search destinations, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full border-border"
            />
          </form>
        </div>
      </div>
    </header>
  );
}