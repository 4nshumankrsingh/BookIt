'use client';
import { useState } from 'react';
import { Plus, Minus, Search, Plane, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AirportSelector from './AirportSelector';

export default function MultiCitySearch({ onSearch }) {
  const [segments, setSegments] = useState([
    { id: 1, from: '', to: '', date: '' }
  ]);
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);

  const addSegment = () => {
    if (segments.length < 6) {
      const lastSegment = segments[segments.length - 1];
      const nextDate = lastSegment.date ? 
        new Date(new Date(lastSegment.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
        '';
      
      setSegments(prev => [
        ...prev,
        { id: prev.length + 1, from: '', to: '', date: nextDate }
      ]);
    }
  };

  const removeSegment = (id) => {
    if (segments.length > 1) {
      setSegments(prev => prev.filter(segment => segment.id !== id));
    }
  };

  const updateSegment = (id, field, value) => {
    setSegments(prev => prev.map(segment => 
      segment.id === id ? { ...segment, [field]: value } : segment
    ));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate all segments
    const isValid = segments.every(segment => 
      segment.from && segment.to && segment.date
    );

    if (!isValid) {
      alert('Please fill all fields for each segment');
      return;
    }

    setLoading(true);

    try {
      const searchParams = {
        tripType: 'multi-city',
        passengers,
        segments: segments.map(segment => ({
          from: segment.from,
          to: segment.to,
          date: segment.date
        }))
      };

      if (onSearch) {
        onSearch(searchParams);
      }
    } catch (error) {
      console.error('Multi-city search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = (index) => {
    if (index === 0) return new Date().toISOString().split('T')[0];
    
    const prevSegment = segments[index - 1];
    return prevSegment.date || new Date().toISOString().split('T')[0];
  };

  const popularMultiCityRoutes = [
    {
      name: 'Delhi → Dubai → Paris',
      description: 'Middle East & Europe Explorer',
      price: '₹89,999'
    },
    {
      name: 'Mumbai → Singapore → Bali',
      description: 'Asian Tropical Adventure',
      price: '₹67,999'
    },
    {
      name: 'Bangalore → Bangkok → Tokyo',
      description: 'East Asian Circuit',
      price: '₹78,999'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center text-xl">
          <Plane className="w-6 h-6 mr-2" />
          Multi-City Flight Search
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSegment}
            disabled={segments.length >= 6}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add City
          </Button>
          {segments.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeSegment(segments[segments.length - 1].id)}
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        {/* Flight Segments */}
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <Card key={segment.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    Flight Segment {index + 1}
                  </h3>
                  {segments.length > 1 && index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSegment(segment.id)}
                      className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* From Airport */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      From
                    </label>
                    <AirportSelector
                      value={segment.from}
                      onChange={(value) => updateSegment(segment.id, 'from', value)}
                      placeholder="Departure airport"
                    />
                  </div>

                  {/* To Airport */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      To
                    </label>
                    <AirportSelector
                      value={segment.to}
                      onChange={(value) => updateSegment(segment.id, 'to', value)}
                      placeholder="Arrival airport"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date
                    </label>
                    <Input
                      type="date"
                      value={segment.date}
                      onChange={(e) => updateSegment(segment.id, 'date', e.target.value)}
                      min={getMinDate(index)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Connection Info */}
                {index < segments.length - 1 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Next: Continue to {segments[index + 1].to || 'next destination'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Passengers and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Passengers
            </label>
            <Select
              value={passengers.toString()}
              onValueChange={(value) => setPassengers(parseInt(value))}
            >
              <SelectTrigger className="w-full md:w-48">
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
            disabled={loading || segments.some(segment => !segment.from || !segment.to || !segment.date)}
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
                Search Multi-City Flights
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Popular Multi-City Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Multi-City Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularMultiCityRoutes.map((route, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left hover:bg-blue-50 hover:border-blue-200"
                onClick={() => {
                  // Set up the popular route
                  const cities = route.name.split(' → ');
                  const newSegments = cities.slice(0, -1).map((city, idx) => ({
                    id: idx + 1,
                    from: city,
                    to: cities[idx + 1],
                    date: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }));
                  setSegments(newSegments);
                }}
              >
                <div className="w-full">
                  <div className="font-semibold text-gray-900 mb-1">{route.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{route.description}</div>
                  <div className="text-lg font-bold text-blue-600">{route.price}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Multi-City Travel Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Plan at least 2-3 days in each city for a comfortable experience</li>
                <li>• Consider visa requirements for each destination</li>
                <li>• Book connecting flights with adequate layover time</li>
                <li>• Pack light to make multiple stops easier</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}