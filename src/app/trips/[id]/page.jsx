'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Plane, IndianRupee, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import FlightStatus from '@/components/FlightStatus';

export default function TripDetailsPage() {
  const params = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTrip();
    }
  }, [params.id]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTrip(data);
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading trip details...</div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <CardTitle className="text-xl mb-2">Trip Not Found</CardTitle>
              <CardDescription className="mb-6">
                The trip you're looking for doesn't exist.
              </CardDescription>
              <Button asChild>
                <Link href="/trips">
                  Back to Trips
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="outline">
            <Link href="/trips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
          <Badge className={getStatusColor(trip.status)}>
            {trip.status}
          </Badge>
        </div>

        {/* Trip Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{trip.destination}</span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {trip.travelers.length} travelers
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {trip.durationDays} days
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {trip.totalCost?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flights Section */}
            {trip.flights && (trip.flights.outgoing.length > 0 || trip.flights.returning.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plane className="w-5 h-5 mr-2" />
                    Flights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Outgoing Flights */}
                  {trip.flights.outgoing.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">Outgoing Flight</h3>
                      {trip.flights.outgoing.map((flight, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold">{flight.airline} {flight.flightNumber}</div>
                              <div className="text-sm text-gray-600">{flight.aircraft} • {flight.bookingClass}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold flex items-center justify-end">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {flight.price?.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">per person</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-xl font-bold">{formatTime(flight.departure.time)}</div>
                              <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                              <div className="text-xs text-gray-500">
                                Term {flight.departure.terminal} • Gate {flight.departure.gate}
                              </div>
                            </div>
                            
                            <div className="flex-1 px-4 text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                {flight.duration.hours}h {flight.duration.minutes}m
                              </div>
                              <div className="relative">
                                <div className="w-full h-0.5 bg-gray-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Plane className="w-3 h-3 text-blue-600 transform rotate-45" />
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Direct</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-xl font-bold">{formatTime(flight.arrival.time)}</div>
                              <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                              <div className="text-xs text-gray-500">
                                Term {flight.arrival.terminal} • Gate {flight.arrival.gate}
                              </div>
                            </div>
                          </div>

                          {/* Flight Status */}
                          <div className="mt-4">
                            <FlightStatus 
                              flightNumber={flight.flightNumber}
                              date={flight.departure.time}
                              autoRefresh={trip.status === 'in-progress'}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Returning Flights */}
                  {trip.flights.returning.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">Return Flight</h3>
                      {trip.flights.returning.map((flight, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold">{flight.airline} {flight.flightNumber}</div>
                              <div className="text-sm text-gray-600">{flight.aircraft} • {flight.bookingClass}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold flex items-center justify-end">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {flight.price?.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">per person</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-xl font-bold">{formatTime(flight.departure.time)}</div>
                              <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                              <div className="text-xs text-gray-500">
                                Term {flight.departure.terminal} • Gate {flight.departure.gate}
                              </div>
                            </div>
                            
                            <div className="flex-1 px-4 text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                {flight.duration.hours}h {flight.duration.minutes}m
                              </div>
                              <div className="relative">
                                <div className="w-full h-0.5 bg-gray-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Plane className="w-3 h-3 text-blue-600 transform rotate-45" />
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Direct</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-xl font-bold">{formatTime(flight.arrival.time)}</div>
                              <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                              <div className="text-xs text-gray-500">
                                Term {flight.arrival.terminal} • Gate {flight.arrival.gate}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Experiences Section */}
            {trip.experiences && trip.experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trip.experiences.map((experience, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{experience.experienceId?.title || 'Experience'}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(experience.date)} • {experience.participants} participants
                            </div>
                          </div>
                          <Badge variant="outline">{experience.status}</Badge>
                        </div>
                        <Button asChild variant="outline" className="mt-3">
                          <Link href={`/bookings/${experience.bookingId}`}>
                            View Booking Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Travelers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Travelers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trip.travelers.map((traveler, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-semibold">{traveler.name}</div>
                      <div className="text-gray-600">{traveler.email}</div>
                      {traveler.phone && (
                        <div className="text-gray-600">{traveler.phone}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trip Notes */}
            {trip.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{trip.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Flights:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1" />
                    {(trip.flights?.totalFlightPrice || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Experiences:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1" />
                    {(trip.totalExperiencesCost || 0).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {trip.totalCost?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Trip Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/flights?tripId=${trip._id}`}>
                    Add More Flights
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/destinations?location=${encodeURIComponent(trip.destination)}`}>
                    Find Experiences
                  </Link>
                </Button>
                {trip.documents && trip.documents.length > 0 && (
                  <Button variant="outline" className="w-full">
                    Download Documents
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}