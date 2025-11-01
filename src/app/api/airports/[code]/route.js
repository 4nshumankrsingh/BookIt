import { NextResponse } from 'next/server';
import flightAPI from '@/lib/flight-api';

export async function GET(request, { params }) {
  try {
    const { code } = params;

    // Validate airport code
    if (!code || code.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid airport code. Must be 3-letter IATA code.' },
        { status: 400 }
      );
    }

    console.log(`Fetching details for airport: ${code}`);

    // Get airport details from the API
    const airportDetails = await flightAPI.getAirportByCode(code.toUpperCase());

    // Format the response
    const formattedAirport = {
      iata: airportDetails.iata,
      icao: airportDetails.icao,
      name: airportDetails.name,
      city: airportDetails.municipality,
      country: airportDetails.country,
      location: {
        lat: airportDetails.location?.lat,
        lon: airportDetails.location?.lon
      },
      timezone: airportDetails.timezone,
      website: airportDetails.url,
      phone: airportDetails.phone,
      elevation: airportDetails.elevation,
      runways: airportDetails.runways,
      terminals: airportDetails.terminals,
      statistics: airportDetails.statistics
    };

    return NextResponse.json({
      success: true,
      data: {
        airport: formattedAirport,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Airport details API error:', error);
    
    // Check if it's a 404 error (airport not found)
    if (error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Airport not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch airport details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}