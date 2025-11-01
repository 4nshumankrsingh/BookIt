import { NextResponse } from 'next/server';
import flightAPI from '@/lib/flight-api';
import redisCache, { cacheKeys, CACHE_TTL } from '@/lib/redis';

export async function GET(request, { params }) {
  try {
    const airportCode = params.code.toUpperCase();
    
    // Try to get from cache first
    const cachedData = await redisCache.get(cacheKeys.flightSearch(airportCode, 'realtime'));
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch real-time flight data
    const [departures, arrivals] = await Promise.all([
      flightAPI.getAirportFlights(airportCode, { 
        direction: 'Departure',
        durationMinutes: 720 // 12 hours
      }),
      flightAPI.getAirportFlights(airportCode, { 
        direction: 'Arrival',
        durationMinutes: 720 // 12 hours
      })
    ]);

    const realtimeData = {
      departures: departures.departures?.map(flight => ({
        flightNumber: flight.number,
        airline: flight.airline?.name,
        destination: flight.arrival?.airport?.name,
        departureTime: flight.departure?.scheduledTime,
        estimatedDeparture: flight.departure?.estimatedTime,
        status: flight.status,
        gate: flight.departure?.gate,
        terminal: flight.departure?.terminal
      })) || [],
      arrivals: arrivals.arrivals?.map(flight => ({
        flightNumber: flight.number,
        airline: flight.airline?.name,
        origin: flight.departure?.airport?.name,
        arrivalTime: flight.arrival?.scheduledTime,
        estimatedArrival: flight.arrival?.estimatedTime,
        status: flight.status,
        gate: flight.arrival?.gate,
        terminal: flight.arrival?.terminal
      })) || [],
      lastUpdated: new Date().toISOString()
    };

    // Cache for 2 minutes for real-time data
    await redisCache.set(
      cacheKeys.flightSearch(airportCode, 'realtime'),
      realtimeData,
      120
    );

    return NextResponse.json(realtimeData);
  } catch (error) {
    console.error('Error fetching real-time flights:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch real-time flight data',
      departures: [],
      arrivals: []
    }, { status: 500 });
  }
}