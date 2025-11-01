'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, MapPin, User, Plane, Globe, Compass, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Flights', href: '/flights', icon: Plane },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Experiences', href: '/experiences', icon: Globe },
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to verify session
        const userData = localStorage.getItem('nexis-user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexis-user');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/60">
      <div className="nexis-container">
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
            {loading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Button 
                  asChild 
                  variant="ghost" 
                  className="text-foreground/80 hover:text-foreground hover:bg-accent px-4 py-2"
                >
                  <Link href="/profile" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent px-4 py-2 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
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
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 px-6 py-2"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
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
            <MobileMenu user={user} onLogout={handleLogout} />
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