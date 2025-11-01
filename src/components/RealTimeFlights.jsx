'use client';
import { useState, useEffect, useRef } from 'react';
import { Plane, Clock, MapPin, Wifi, WifiOff, RefreshCw, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RealTimeFlights({ airportCode, initialData = null, autoRefresh = true }) {
  const [flights, setFlights] = useState(initialData || { arrivals: [], departures: [] });
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [view, setView] = useState('departures'); // 'departures' or 'arrivals'
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time', 'airline', 'status'
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const eventSourceRef = useRef(null);

  const fetchRealTimeFlights = async () => {
    if (!airportCode) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/flights/airports/${airportCode}/realtime`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flight data');
      }
      
      const data = await response.json();
      setFlights(data);
      setLastUpdated(new Date());
      setConnectionStatus('connected');
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
      console.error('Error fetching real-time flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupSSE = () => {
    if (!airportCode || !autoRefresh) return;

    try {
      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Setup new SSE connection
      eventSourceRef.current = new EventSource(
        `/api/flights/airports/${airportCode}/stream`
      );

      eventSourceRef.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('SSE connection opened');
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data);
          setFlights(prev => ({
            arrivals: update.arrivals || prev.arrivals,
            departures: update.departures || prev.departures
          }));
          setLastUpdated(new Date());
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        setConnectionStatus('error');
        console.error('SSE error:', error);
      };

    } catch (sseError) {
      console.error('SSE setup failed:', sseError);
      // Fall back to polling
      setConnectionStatus('polling');
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchRealTimeFlights();
    }
    
    if (autoRefresh) {
      setupSSE();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [airportCode, autoRefresh]);

  const handleManualRefresh = () => {
    fetchRealTimeFlights();
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower?.includes('landed') || statusLower?.includes('arrived')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower?.includes('boarding') || statusLower?.includes('final')) {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower?.includes('delayed') || statusLower?.includes('late')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower?.includes('cancelled')) {
      return 'bg-red-100 text-red-800';
    } else if (statusLower?.includes('scheduled') || statusLower?.includes('ontime')) {
      return 'bg-gray-100 text-gray-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '--:--';
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatStatus = (status) => {
    if (!status) return 'Scheduled';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFlightList = () => {
    const list = view === 'departures' ? flights.departures : flights.arrivals;
    
    let filtered = list;
    
    // Apply filter
    if (filter) {
      filtered = filtered.filter(flight => 
        flight.flightNumber?.toLowerCase().includes(filter.toLowerCase()) ||
        flight.airline?.toLowerCase().includes(filter.toLowerCase()) ||
        (view === 'departures' 
          ? flight.destination?.toLowerCase().includes(filter.toLowerCase())
          : flight.origin?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'airline':
          return (a.airline || '').localeCompare(b.airline || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'time':
        default:
          const timeA = new Date(view === 'departures' ? a.departureTime : a.arrivalTime);
          const timeB = new Date(view === 'departures' ? b.departureTime : b.arrivalTime);
          return timeA - timeB;
      }
    });
    
    return filtered.slice(0, 50); // Limit to 50 flights
  };

  const flightList = getFlightList();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Plane className="w-5 h-5 mr-2" />
              Real-Time Flights
              {airportCode && <Badge variant="outline" className="ml-2">{airportCode}</Badge>}
            </CardTitle>
            <CardDescription>
              Live {view} information {airportCode && `for ${airportCode}`}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <Badge 
              variant={
                connectionStatus === 'connected' ? 'default' :
                connectionStatus === 'error' ? 'destructive' : 'secondary'
              }
              className="flex items-center"
            >
              {connectionStatus === 'connected' ? (
                <Wifi className="w-3 h-3 mr-1" />
              ) : (
                <WifiOff className="w-3 h-3 mr-1" />
              )}
              {connectionStatus}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* View Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === 'departures' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('departures')}
              className="flex-1"
            >
              Departures
            </Button>
            <Button
              variant={view === 'arrivals' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('arrivals')}
              className="flex-1"
            >
              Arrivals
            </Button>
          </div>
          
          {/* Search Filter */}
          <Input
            placeholder={`Search ${view}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1"
          />
          
          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="airline">Airline</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading && !flights ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading flight data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <WifiOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Failed to load flight data</p>
            <Button variant="outline" onClick={fetchRealTimeFlights} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Flight</th>
                  <th className="text-left p-3 font-medium">
                    {view === 'departures' ? 'Destination' : 'Origin'}
                  </th>
                  <th className="text-left p-3 font-medium">Scheduled</th>
                  <th className="text-left p-3 font-medium">Estimated</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flightList.map((flight, index) => (
                  <tr key={flight.flightNumber || index} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{flight.airline}</div>
                      <div className="text-gray-500 text-xs">{flight.flightNumber}</div>
                    </td>
                    <td className="p-3">
                      {view === 'departures' ? flight.destination : flight.origin}
                    </td>
                    <td className="p-3">
                      {formatTime(view === 'departures' ? flight.departureTime : flight.arrivalTime)}
                    </td>
                    <td className="p-3">
                      {formatTime(
                        view === 'departures' 
                          ? flight.estimatedDeparture 
                          : flight.estimatedArrival
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(flight.status)}>
                        {formatStatus(flight.status)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {flight.gate || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {flightList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No {view} found</p>
                {filter && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setFilter('')}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Last Updated */}
        {lastUpdated && (
          <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>
              Live updates • {autoRefresh ? 'Auto-refresh enabled' : 'Manual refresh'}
            </span>
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}