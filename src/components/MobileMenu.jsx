'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Globe, MapPin, Plane, HelpCircle } from 'lucide-react';

export default function MobileMenu() {
  const navigationItems = [
    { name: 'Experiences', href: '/', icon: Globe },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Flights', href: '/flights', icon: Plane },
    { name: 'Help Center', href: '/help', icon: HelpCircle },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="text-left pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <SheetTitle className="text-xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nexis
              </SheetTitle>
              <p className="text-sm text-muted-foreground">Travel & Experiences</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="w-full justify-start text-base p-4 h-auto hover:bg-accent"
              >
                <Link href={item.href} className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <span>{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border space-y-3">
          <Button asChild className="w-full bg-linear-to-br from-blue-600 to-purple-600 text-white">
            <Link href="/auth/signin" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}