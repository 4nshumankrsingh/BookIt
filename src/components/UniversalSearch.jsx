'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Plane, MapPin, Globe, Building, Mountain, Waves, Castle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function UniversalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const popularSearches = [
    { type: 'destination', name: 'Bali, Indonesia', icon: '🏝️', category: 'Beach' },
    { type: 'destination', name: 'Paris, France', icon: '🗼', category: 'City' },
    { type: 'destination', name: 'Tokyo, Japan', icon: '🗾', category: 'City' },
    { type: 'destination', name: 'Swiss Alps', icon: '⛰️', category: 'Mountain' },
    { type: 'flight', name: 'Delhi to Goa', icon: '✈️', category: 'Domestic' },
    { type: 'flight', name: 'Mumbai to Dubai', icon: '✈️', category: 'International' },
    { type: 'experience', name: 'Taj Mahal Tour', icon: '🏛️', category: 'Cultural' },
    { type: 'experience', name: 'Goa Beach Activities', icon: '🏄', category: 'Adventure' },
  ];

  const categories = [
    { id: 'beach', name: 'Beach', icon: Waves, color: 'text-blue-500' },
    { id: 'mountain', name: 'Mountain', icon: Mountain, color: 'text-green-500' },
    { id: 'city', name: 'City', icon: Building, color: 'text-purple-500' },
    { id: 'historical', name: 'Historical', icon: Castle, color: 'text-orange-500' },
  ];

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simulate API search
    const timeoutId = setTimeout(() => {
      const filtered = popularSearches.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6);
      
      setSuggestions(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelect = (item) => {
    setSearchTerm(item.name);
    setIsOpen(false);
    
    // Navigate based on type
    if (item.type === 'destination') {
      router.push(`/destinations?search=${encodeURIComponent(item.name)}`);
    } else if (item.type === 'flight') {
      const [from, to] = item.name.split(' to ');
      router.push(`/flights?from=${from}&to=${to}&date=${getNextWeekDate()}`);
    } else if (item.type === 'experience') {
      router.push(`/experiences?search=${encodeURIComponent(item.name)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/destinations?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    } else {
      setSuggestions(popularSearches.slice(0, 4));
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  };

  const handleCategorySelect = (category) => {
    router.push(`/destinations?category=${category.id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search destinations, flights, experiences..."
            className="pl-12 pr-24 py-6 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Search Suggestions */}
        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-xl">
            <CardContent className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 px-2">Search Results</p>
                  {suggestions.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleSelect(item)}
                      className="w-full justify-start h-auto p-3 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="text-center py-4 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No results found for "{searchTerm}"</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quick Categories */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-3">Browse Categories</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant="outline"
                            onClick={() => handleCategorySelect(category)}
                            className="flex flex-col items-center justify-center h-16 p-2 hover:bg-blue-50 hover:border-blue-200"
                          >
                            <IconComponent className={`w-5 h-5 ${category.color} mb-1`} />
                            <span className="text-xs">{category.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popular Searches */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Popular Searches</p>
                    <div className="space-y-1">
                      {popularSearches.slice(0, 4).map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => handleSelect(item)}
                          className="w-full justify-start h-auto p-2 text-left hover:bg-gray-50 text-sm"
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>

      {/* Quick Stats */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-2 text-blue-500" />
          <span>50+ Destinations</span>
        </div>
        <div className="flex items-center">
          <Plane className="w-4 h-4 mr-2 text-green-500" />
          <span>500+ Flights Daily</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
          <span>1000+ Experiences</span>
        </div>
      </div>
    </div>
  );
}