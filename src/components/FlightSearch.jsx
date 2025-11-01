'use client';
import { useState } from 'react';
import { Search, Plane, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AirportSelector from './AirportSelector';

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'one-way'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Flight search logic will be implemented in Phase 6
      console.log('Searching flights with params:', searchParams);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to flights page with search parameters
      const queryParams = new URLSearchParams(searchParams);
      window.location.href = `/flights?${queryParams.toString()}`;
    } catch (error) {
      console.error('Flight search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { code: 'JFK', name: 'New York', country: 'USA' },
    { code: 'LHR', name: 'London', country: 'UK' },
    { code: 'CDG', name: 'Paris', country: 'France' },
    { code: 'DXB', name: 'Dubai', country: 'UAE' },
    { code: 'SIN', name: 'Singapore', country: 'Singapore' },
    { code: 'BKK', name: 'Bangkok', country: 'Thailand' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <Plane className="w-6 h-6 mr-2 text-blue-600" />
            Find Your Perfect Flight
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type Selection */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={searchParams.tripType === 'one-way' ? 'default' : 'outline'}
                onClick={() => handleInputChange('tripType', 'one-way')}
                className="flex-1"
              >
                One Way
              </Button>
              <Button
                type="button"
                variant={searchParams.tripType === 'round-trip' ? 'default' : 'outline'}
                onClick={() => handleInputChange('tripType', 'round-trip')}
                className="flex-1"
              >
                Round Trip
              </Button>
              <Button
                type="button"
                variant={searchParams.tripType === 'multi-city' ? 'default' : 'outline'}
                onClick={() => handleInputChange('tripType', 'multi-city')}
                className="flex-1"
              >
                Multi City
              </Button>
            </div>

            {/* Airport Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  From
                </label>
                <AirportSelector
                  value={searchParams.from}
                  onChange={(value) => handleInputChange('from', value)}
                  placeholder="Departure airport"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  To
                </label>
                <AirportSelector
                  value={searchParams.to}
                  onChange={(value) => handleInputChange('to', value)}
                  placeholder="Arrival airport"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Departure Date
                </label>
                <Input
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              
              {searchParams.tripType === 'round-trip' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Return Date
                  </label>
                  <Input
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Passengers and Search Button */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Passengers
                </label>
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(value) => handleInputChange('passengers', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !searchParams.from || !searchParams.to || !searchParams.departureDate}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search Flights
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Popular Destinations */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularDestinations.map((destination) => (
                <Button
                  key={destination.code}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleInputChange('to', destination.code);
                  }}
                  className="flex flex-col items-center justify-center p-3 h-auto text-xs hover:bg-blue-50 hover:border-blue-200"
                >
                  <span className="font-semibold text-gray-800">{destination.code}</span>
                  <span className="text-gray-600 truncate">{destination.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}