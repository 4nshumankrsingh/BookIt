'use client';
import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, Search, IndianRupee, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import FlightSearch from '@/components/FlightSearch';
import FlightResults from '@/components/FlightResults';
import MultiCitySearch from '@/components/MultiCitySearch';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function FlightsPage() {
  const [searchType, setSearchType] = useState('one-way');
  const [searchParams, setSearchParams] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    // Check for URL parameters for pre-filled search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') && urlParams.get('to') && urlParams.get('date')) {
      const params = {
        from: urlParams.get('from'),
        to: urlParams.get('to'),
        date: urlParams.get('date'),
        passengers: parseInt(urlParams.get('passengers')) || 1,
        tripType: urlParams.get('tripType') || 'one-way'
      };
      setSearchParams(params);
      handleFlightSearch(params);
    }
  }, []);

  const handleFlightSearch = async (params) => {
    setSearchParams(params);
    setLoading(true);
    setSelectedFlight(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/flights/search?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setFlights(data.data.flights);
      } else {
        setFlights([]);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
  };

  const popularRoutes = [
    { from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', price: '₹4,299' },
    { from: 'BOM', to: 'BLR', fromCity: 'Mumbai', toCity: 'Bangalore', price: '₹3,899' },
    { from: 'DEL', to: 'BLR', fromCity: 'Delhi', toCity: 'Bangalore', price: '₹5,199' },
    { from: 'BLR', to: 'MAA', fromCity: 'Bangalore', toCity: 'Chennai', price: '₹2,999' },
    { from: 'DEL', to: 'HYD', fromCity: 'Delhi', toCity: 'Hyderabad', price: '₹4,599' },
    { from: 'BOM', to: 'GOI', fromCity: 'Mumbai', toCity: 'Goa', price: '₹3,499' },
  ];

  const airlines = [
    { code: 'AI', name: 'Air India', logo: '🛩️' },
    { code: '6E', name: 'IndiGo', logo: '✈️' },
    { code: 'SG', name: 'SpiceJet', logo: '🔥' },
    { code: 'UK', name: 'Vistara', logo: '⭐' },
    { code: 'G8', name: 'Go First', logo: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="nexis-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Flights
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Find the best deals on domestic and international flights
            </p>
          </div>
        </div>
      </section>

      <div className="nexis-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Search & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Type Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={searchType === 'one-way' ? 'default' : 'outline'}
                    onClick={() => setSearchType('one-way')}
                    className="w-full justify-start"
                  >
                    One Way
                  </Button>
                  <Button
                    variant={searchType === 'round-trip' ? 'default' : 'outline'}
                    onClick={() => setSearchType('round-trip')}
                    className="w-full justify-start"
                  >
                    Round Trip
                  </Button>
                  <Button
                    variant={searchType === 'multi-city' ? 'default' : 'outline'}
                    onClick={() => setSearchType('multi-city')}
                    className="w-full justify-start"
                  >
                    Multi City
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Airlines</label>
                  <div className="space-y-2">
                    {airlines.map(airline => (
                      <div key={airline.code} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`airline-${airline.code}`}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`airline-${airline.code}`} className="ml-2 text-sm flex items-center">
                          <span className="mr-2">{airline.logo}</span>
                          {airline.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-2 block">Stops</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="stops" id="direct" className="text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="direct" className="ml-2 text-sm">Direct</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="stops" id="one-stop" className="text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="one-stop" className="ml-2 text-sm">1 Stop</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="stops" id="any" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                      <label htmlFor="any" className="ml-2 text-sm">Any</label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">₹2,000</span>
                      <span className="text-sm text-gray-600">₹20,000</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="20000"
                      step="1000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularRoutes.map((route, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50"
                      onClick={() => handleFlightSearch({
                        from: route.from,
                        to: route.to,
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        passengers: 1,
                        tripType: 'one-way'
                      })}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-semibold text-sm">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-xs text-gray-600">
                            {route.fromCity} to {route.toCity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600 text-sm">{route.price}</div>
                          <div className="text-xs text-gray-500">one way</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Form */}
            <Card>
              <CardContent className="p-6">
                {searchType === 'multi-city' ? (
                  <MultiCitySearch onSearch={handleFlightSearch} />
                ) : (
                  <FlightSearch 
                    onSearch={handleFlightSearch}
                    defaultParams={searchParams}
                    tripType={searchType}
                  />
                )}
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchParams && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Flight Results</CardTitle>
                      <CardDescription>
                        {flights.length} flights found from {searchParams.from} to {searchParams.to}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {new Date(searchParams.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <LoadingSpinner size="large" text="Searching for flights..." />
                    </div>
                  ) : (
                    <FlightResults
                      flights={flights}
                      searchParams={searchParams}
                      onFlightSelect={handleFlightSelect}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Why Book With Us */}
            {!searchParams && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">Best Price Guarantee</CardTitle>
                    <CardDescription>
                      Found a lower price? We'll match it and give you 10% off the difference.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">Secure Booking</CardTitle>
                    <CardDescription>
                      Your personal and payment information is protected with bank-level security.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">24/7 Support</CardTitle>
                    <CardDescription>
                      Our travel experts are available round the clock to assist you.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}