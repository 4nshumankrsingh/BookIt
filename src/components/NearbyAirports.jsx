'use client';
import { useState, useEffect } from 'react';
import { MapPin, Plane, Navigation, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function NearbyAirports({ location, onAirportSelect }) {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for nearby airports - in Phase 7 this will use real geolocation
  const mockAirports = [
    {
      iata: 'DEL',
      name: 'Indira Gandhi International Airport',
      city: 'Delhi',
      distance: '15 km',
      driveTime: '30 min',
      type: 'International'
    },
    {
      iata: 'BOM',
      name: 'Chhatrapati Shivaji Maharaj International Airport',
      city: 'Mumbai',
      distance: '18 km',
      driveTime: '35 min',
      type: 'International'
    },
    {
      iata: 'BLR',
      name: 'Kempegowda International Airport',
      city: 'Bengaluru',
      distance: '35 km',
      driveTime: '45 min',
      type: 'International'
    },
    {
      iata: 'MAA',
      name: 'Chennai International Airport',
      city: 'Chennai',
      distance: '20 km',
      driveTime: '40 min',
      type: 'International'
    },
    {
      iata: 'HYD',
      name: 'Rajiv Gandhi International Airport',
      city: 'Hyderabad',
      distance: '25 km',
      driveTime: '35 min',
      type: 'International'
    }
  ];

  useEffect(() => {
    const fetchNearbyAirports = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In Phase 7, this will make actual API call to:
        // GET /api/airports/search/location?lat=...&lon=...&radiusKm=100
        setAirports(mockAirports);
      } catch (err) {
        setError('Failed to load nearby airports');
        console.error('Error fetching nearby airports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyAirports();
  }, [location]);

  const handleAirportClick = (airport) => {
    if (onAirportSelect) {
      onAirportSelect(airport.iata);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            Nearby Airports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nearby Airports</CardTitle>
          <CardDescription>Unable to load airport information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Nearby Airports
        </CardTitle>
        <CardDescription>
          Major airports near your experience location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {airports.map((airport) => (
            <Button
              key={airport.iata}
              variant="outline"
              className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200"
              onClick={() => handleAirportClick(airport)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">{airport.iata}</span>
                    <Badge variant="secondary" className="text-xs">
                      {airport.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{airport.name}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {airport.distance}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {airport.driveTime}
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Select an airport to search for flights to this destination
          </p>
        </div>
      </CardContent>
    </Card>
  );
}