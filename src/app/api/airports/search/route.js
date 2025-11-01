import { NextResponse } from 'next/server';
import flightAPI from '@/lib/flight-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radiusKm = searchParams.get('radiusKm') || 50;
    const limit = searchParams.get('limit') || 10;

    // Validate parameters
    if (!query && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Missing search parameters: either q (query) or both lat and lon are required' },
        { status: 400 }
      );
    }

    let airports = [];

    if (lat && lon) {
      // Search by location
      const locationResults = await flightAPI.searchAirportsByLocation(
        parseFloat(lat),
        parseFloat(lon),
        {
          radiusKm: parseInt(radiusKm),
          limit: parseInt(limit)
        }
      );
      airports = locationResults;
    } else if (query) {
      // For now, we'll use mock data since the API doesn't have text search
      // In Phase 6, we'll implement proper text search
      airports = await mockAirportSearch(query, parseInt(limit));
    }

    // Format the response
    const formattedAirports = airports.map(airport => ({
      iata: airport.iata,
      icao: airport.icao,
      name: airport.name,
      city: airport.municipality || airport.city,
      country: airport.country,
      latitude: airport.location?.lat || airport.lat,
      longitude: airport.location?.lon || airport.lon,
      timezone: airport.timezone
    }));

    return NextResponse.json({
      success: true,
      data: {
        airports: formattedAirports,
        total: formattedAirports.length,
        query: { query, lat, lon, radiusKm, limit }
      }
    });

  } catch (error) {
    console.error('Airport search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to search airports',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Mock airport search function (will be replaced with actual API in Phase 6)
async function mockAirportSearch(query, limit) {
  const mockAirports = [
    {
      iata: 'JFK',
      icao: 'KJFK',
      name: 'John F Kennedy International Airport',
      municipality: 'New York',
      country: 'United States',
      location: { lat: 40.63980103, lon: -73.77890015 },
      timezone: 'America/New_York'
    },
    {
      iata: 'LAX',
      icao: 'KLAX',
      name: 'Los Angeles International Airport',
      municipality: 'Los Angeles',
      country: 'United States',
      location: { lat: 33.94250107, lon: -118.4079971 },
      timezone: 'America/Los_Angeles'
    },
    {
      iata: 'LHR',
      icao: 'EGLL',
      name: 'London Heathrow Airport',
      municipality: 'London',
      country: 'United Kingdom',
      location: { lat: 51.4706, lon: -0.461941 },
      timezone: 'Europe/London'
    },
    {
      iata: 'CDG',
      icao: 'LFPG',
      name: 'Charles de Gaulle Airport',
      municipality: 'Paris',
      country: 'France',
      location: { lat: 49.012798, lon: 2.55 },
      timezone: 'Europe/Paris'
    },
    {
      iata: 'DXB',
      icao: 'OMDB',
      name: 'Dubai International Airport',
      municipality: 'Dubai',
      country: 'United Arab Emirates',
      location: { lat: 25.25279999, lon: 55.36439896 },
      timezone: 'Asia/Dubai'
    },
    {
      iata: 'SIN',
      icao: 'WSSS',
      name: 'Singapore Changi Airport',
      municipality: 'Singapore',
      country: 'Singapore',
      location: { lat: 1.35019, lon: 103.994003 },
      timezone: 'Asia/Singapore'
    },
    {
      iata: 'BKK',
      icao: 'VTBS',
      name: 'Suvarnabhumi Airport',
      municipality: 'Bangkok',
      country: 'Thailand',
      location: { lat: 13.68109989, lon: 100.7470016 },
      timezone: 'Asia/Bangkok'
    },
    {
      iata: 'DEL',
      icao: 'VIDP',
      name: 'Indira Gandhi International Airport',
      municipality: 'Delhi',
      country: 'India',
      location: { lat: 28.5665, lon: 77.103104 },
      timezone: 'Asia/Kolkata'
    }
  ];

  const filtered = mockAirports.filter(airport =>
    airport.iata.toLowerCase().includes(query.toLowerCase()) ||
    airport.name.toLowerCase().includes(query.toLowerCase()) ||
    airport.municipality.toLowerCase().includes(query.toLowerCase()) ||
    airport.country.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.slice(0, limit);
}