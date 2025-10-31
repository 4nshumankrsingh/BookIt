'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, Globe, MapPin, Calendar, Star } from 'lucide-react';

export default function MobileMenu() {
  const navigationItems = [
    { name: 'All Experiences', href: '/', icon: Globe },
    { name: 'Popular Destinations', href: '/destinations', icon: MapPin },
    { name: 'Upcoming Tours', href: '/tours', icon: Calendar },
    { name: 'Top Rated', href: '/top-rated', icon: Star },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden bookit-btn-ghost">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bookit-card w-full sm:max-w-md bookit-space-y-lg">
        <SheetHeader className="text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bookit-gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <SheetTitle className="bookit-text-gradient text-2xl">BookIt</SheetTitle>
          </div>
          <p className="text-muted-foreground bookit-body-sm">Travel Experiences</p>
        </SheetHeader>

        <nav className="bookit-space-y-sm">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="w-full justify-start bookit-btn-ghost text-lg p-4 h-auto"
              >
                <Link href={item.href} className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-bookit-500" />
                  <span>{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border bookit-space-y-sm">
          <Button asChild className="w-full bookit-btn-primary">
            <Link href="/auth/signin" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full bookit-btn-outline">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-muted-foreground bookit-body-sm text-center">
            Need help?{' '}
            <Link href="/contact" className="text-bookit-500 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}