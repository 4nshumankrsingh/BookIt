import { NextResponse } from 'next/server';
import flightAPI from '@/lib/flight-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const flightNumber = searchParams.get('flightNumber');
    const date = searchParams.get('date');

    // Validate required parameters
    if (!flightNumber || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters: flightNumber, date' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    console.log(`Fetching status for flight ${flightNumber} on ${date}`);

    // Get flight status from the API (with Redis caching)
    const flightStatus = await flightAPI.getFlightStatus(flightNumber, date, {
      withAircraftImage: false,
      withLocation: false
    });

    // Format the response
    const formattedStatus = {
      flightNumber: flightNumber,
      date: date,
      airline: flightStatus.airline?.name || 'Unknown',
      status: flightStatus.status || 'Scheduled',
      departure: {
        airport: flightStatus.departure?.airport?.iata || 'Unknown',
        scheduled: flightStatus.departure?.scheduledTime || '',
        terminal: flightStatus.departure?.terminal || 'TBA',
        gate: flightStatus.departure?.gate || 'TBA'
      },
      arrival: {
        airport: flightStatus.arrival?.airport?.iata || 'Unknown',
        scheduled: flightStatus.arrival?.scheduledTime || '',
        terminal: flightStatus.arrival?.terminal || 'TBA',
        gate: flightStatus.arrival?.gate || 'TBA'
      },
      aircraft: flightStatus.aircraft?.model || 'Unknown',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        flight: formattedStatus,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Flight status API error:', error);
    
    // Check if it's a 404 error (flight not found)
    if (error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Flight not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch flight status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}