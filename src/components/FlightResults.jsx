'use client';
import { useState } from 'react';
import { Plane, Clock, MapPin, Calendar, Users, IndianRupee, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function FlightResults({ flights, searchParams, onFlightSelect }) {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    if (onFlightSelect) {
      onFlightSelect(flight);
    }
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDuration = (duration) => {
    if (duration.hours === 0) {
      return `${duration.minutes}m`;
    } else if (duration.minutes === 0) {
      return `${duration.hours}h`;
    } else {
      return `${duration.hours}h ${duration.minutes}m`;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!flights || flights.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">No Flights Found</CardTitle>
          <CardDescription>
            We couldn't find any flights matching your search criteria. 
            Try adjusting your dates or airports.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{searchParams.from}</div>
                <div className="text-sm text-gray-500">Departure</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <Plane className="w-4 h-4 text-gray-400 transform rotate-45" />
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{searchParams.to}</div>
                <div className="text-sm text-gray-500">Arrival</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatDate(searchParams.date)}</div>
              <div className="text-sm text-gray-500">
                {searchParams.passengers} {searchParams.passengers === 1 ? 'passenger' : 'passengers'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Results */}
      <div className="space-y-3">
        {flights.map((flight) => (
          <Card 
            key={flight.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedFlight?.id === flight.id 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'hover:shadow-md hover:border-gray-300'
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Flight Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-6">
                    {/* Airline and Times */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{flight.airline}</div>
                        <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="font-bold text-xl">{formatTime(flight.departure.time)}</div>
                        <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                        <div className="text-xs text-gray-500">
                          Term {flight.departure.terminal} • Gate {flight.departure.gate}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formatDuration(flight.duration)}</span>
                        </div>
                        <div className="w-24 h-0.5 bg-gray-300"></div>
                        <div className="text-xs text-gray-500 mt-1">Direct</div>
                      </div>

                      <div className="text-center">
                        <div className="font-bold text-xl">{formatTime(flight.arrival.time)}</div>
                        <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                        <div className="text-xs text-gray-500">
                          Term {flight.arrival.terminal} • Gate {flight.arrival.gate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="text-right">
                  <div className="flex items-baseline justify-end space-x-1 mb-2">
                    <IndianRupee className="w-4 h-4 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(flight.price).replace('₹', '')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">per person</div>
                  
                  <Badge variant="secondary" className="mb-2">
                    {flight.seatsAvailable} seats left
                  </Badge>
                  
                  <Button 
                    variant={selectedFlight?.id === flight.id ? "default" : "outline"}
                    className="mt-2"
                  >
                    {selectedFlight?.id === flight.id ? 'Selected' : 'Select Flight'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-green-500" />
                    Free cancellation
                  </div>
                  <div>•</div>
                  <div>{flight.aircraft}</div>
                  <div>•</div>
                  <div>{flight.bookingClass}</div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Flight ID: {flight.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Flight Summary */}
      {selectedFlight && (
        <Card className="sticky bottom-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-900">
                  {selectedFlight.airline} • {selectedFlight.flightNumber}
                </div>
                <div className="text-sm text-blue-700">
                  {formatTime(selectedFlight.departure.time)} → {formatTime(selectedFlight.arrival.time)} • {formatDuration(selectedFlight.duration)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end space-x-1">
                  <IndianRupee className="w-4 h-4 text-blue-900" />
                  <span className="text-xl font-bold text-blue-900">
                    {formatPrice(selectedFlight.price).replace('₹', '')}
                  </span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 mt-2">
                  Continue to Booking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}