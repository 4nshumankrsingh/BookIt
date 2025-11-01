'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AirportSelector({ value, onChange, placeholder = "Search airports..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Popular airports for quick selection
  const popularAirports = [
    { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
    { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
    { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
    { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
  ];

  useEffect(() => {
    if (value) {
      const airport = popularAirports.find(ap => ap.iata === value);
      if (airport) {
        setSearchTerm(`${airport.iata} - ${airport.city}`);
      }
    }
  }, [value]);

  const handleSearch = async (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - will be replaced with actual airport search in Phase 6
      const filtered = popularAirports.filter(airport =>
        airport.iata.toLowerCase().includes(term.toLowerCase()) ||
        airport.city.toLowerCase().includes(term.toLowerCase()) ||
        airport.name.toLowerCase().includes(term.toLowerCase()) ||
        airport.country.toLowerCase().includes(term.toLowerCase())
      );
      
      setSuggestions(filtered.slice(0, 8));
    } catch (error) {
      console.error('Airport search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
    setIsOpen(true);
  };

  const handleSelect = (airport) => {
    onChange(airport.iata);
    setSearchTerm(`${airport.iata} - ${airport.city}`);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    } else {
      setSuggestions(popularAirports.slice(0, 6));
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for click events
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-10 pr-4 w-full"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 max-h-80 overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Searching airports...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((airport) => (
                  <Button
                    key={airport.iata}
                    variant="ghost"
                    onClick={() => handleSelect(airport)}
                    className="w-full justify-start h-auto p-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{airport.iata}</span>
                          <span className="text-sm text-gray-600 truncate">{airport.city}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{airport.name}</p>
                        <p className="text-xs text-gray-400">{airport.country}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-4 text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No airports found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 px-2 py-1">Popular Airports</p>
                {popularAirports.slice(0, 6).map((airport) => (
                  <Button
                    key={airport.iata}
                    variant="ghost"
                    onClick={() => handleSelect(airport)}
                    className="w-full justify-start h-auto p-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{airport.iata}</span>
                          <span className="text-sm text-gray-600">{airport.city}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{airport.name}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}