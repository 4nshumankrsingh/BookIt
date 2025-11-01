'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, Compass, Plane, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Flights', href: '/flights', icon: Plane },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Experiences', href: '/experiences', icon: Globe },
  ];

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            {/* Navigation Items */}
            <nav className="space-y-2 mb-8">
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href} className="flex items-center space-x-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-border pt-6">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.email}</span>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/profile" className="flex items-center space-x-3">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-base text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full py-3 text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/signin" className="flex items-center justify-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full py-3 text-base bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}