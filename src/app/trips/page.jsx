'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Calendar, Users, Plane, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TripPlanner from '@/components/TripPlanner';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanner, setShowPlanner] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [newTrip, ...prev]);
    setShowPlanner(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading your trips...</div>
        </div>
      </div>
    );
  }

  if (showPlanner) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => setShowPlanner(false)}
            className="mb-6"
          >
            ← Back to Trips
          </Button>
          <TripPlanner onTripCreated={handleTripCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">Manage and view all your travel plans</p>
          </div>
          <Button onClick={() => setShowPlanner(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Plan New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Trips Yet</CardTitle>
              <CardDescription className="mb-6">
                Start planning your next adventure by creating a new trip.
              </CardDescription>
              <Button onClick={() => setShowPlanner(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Plan Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{trip.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {trip.destination}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      {formatDate(trip.startDate)}
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      {formatDate(trip.endDate)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                      {trip.travelers.length} travelers
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      {trip.durationDays} days
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div>
                      <span className="font-semibold">₹{trip.totalCost?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {trip.flights?.outgoing?.length > 0 && (
                        <Plane className="w-4 h-4 text-green-500" />
                      )}
                      <span>{trip.experiences?.length || 0} experiences</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-4">
                    <Link href={`/trips/${trip._id}`}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}