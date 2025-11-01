'use client';
import { useState, useEffect } from 'react';
import { Plane, Clock, MapPin, Calendar, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function FlightStatus({ flightNumber, date, autoRefresh = true }) {
  const [flightStatus, setFlightStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchFlightStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/flights/status?flightNumber=${flightNumber}&date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flight status');
      }
      
      const data = await response.json();
      setFlightStatus(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching flight status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightStatus();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchFlightStatus, 60000); // Refresh every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [flightNumber, date, autoRefresh]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'active':
      case 'in flight':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'landed':
      case 'arrived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '--:--';
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return '--';
    return new Date(dateTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading flight status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-lg mb-2">Unable to Load Status</CardTitle>
          <CardDescription className="mb-4">
            {error}
          </CardDescription>
          <Button onClick={fetchFlightStatus}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!flightStatus) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-lg mb-2">No Flight Data</CardTitle>
          <CardDescription>
            Flight status information is not available.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Plane className="w-5 h-5 mr-2" />
              {flightStatus.airline} {flightStatus.flightNumber}
            </CardTitle>
            <CardDescription>
              {flightStatus.departure?.airport?.name} → {flightStatus.arrival?.airport?.name}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(flightStatus.status)}>
            {flightStatus.status || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Flight Route */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatTime(flightStatus.departure?.scheduledTime)}
            </div>
            <div className="text-sm text-gray-600">
              {flightStatus.departure?.airport?.iata}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(flightStatus.departure?.scheduledTime)}
            </div>
          </div>
          
          <div className="flex-1 px-4">
            <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {flightStatus.duration?.hours}h {flightStatus.duration?.minutes}m
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-0.5 bg-gray-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Plane className="w-4 h-4 text-blue-600 transform rotate-45" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatTime(flightStatus.arrival?.scheduledTime)}
            </div>
            <div className="text-sm text-gray-600">
              {flightStatus.arrival?.airport?.iata}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(flightStatus.arrival?.scheduledTime)}
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Terminal:</strong>{' '}
            {flightStatus.departure?.terminal || '--'} → {flightStatus.arrival?.terminal || '--'}
          </div>
          <div>
            <strong>Gate:</strong>{' '}
            {flightStatus.departure?.gate || '--'} → {flightStatus.arrival?.gate || '--'}
          </div>
          <div>
            <strong>Aircraft:</strong> {flightStatus.aircraft || '--'}
          </div>
          <div>
            <strong>Distance:</strong> {flightStatus.distance?.km ? `${flightStatus.distance.km} km` : '--'}
          </div>
        </div>

        {/* Real-time Updates */}
        {(flightStatus.departure?.actualTime || flightStatus.arrival?.actualTime) && (
          <div className="border-t pt-3">
            <h4 className="font-semibold mb-2">Real-time Updates</h4>
            {flightStatus.departure?.actualTime && (
              <div className="text-sm">
                <strong>Actual Departure:</strong>{' '}
                {formatTime(flightStatus.departure.actualTime)}
                {flightStatus.departure.actualTime !== flightStatus.departure.scheduledTime && (
                  <Badge variant="outline" className="ml-2">
                    {new Date(flightStatus.departure.actualTime) > new Date(flightStatus.departure.scheduledTime) 
                      ? 'Delayed' 
                      : 'Early'}
                  </Badge>
                )}
              </div>
            )}
            {flightStatus.arrival?.actualTime && (
              <div className="text-sm">
                <strong>Actual Arrival:</strong>{' '}
                {formatTime(flightStatus.arrival.actualTime)}
                {flightStatus.arrival.actualTime !== flightStatus.arrival.scheduledTime && (
                  <Badge variant="outline" className="ml-2">
                    {new Date(flightStatus.arrival.actualTime) > new Date(flightStatus.arrival.scheduledTime) 
                      ? 'Delayed' 
                      : 'Early'}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <div className="flex items-center">
              <Wifi className="w-3 h-3 mr-1" />
              Live updates {autoRefresh && '• Auto-refresh every minute'}
            </div>
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}