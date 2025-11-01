import { NextResponse } from 'next/server';
import flightAPI from '@/lib/flight-api';

// Price calculation in INR (Indian Rupees)
function calculatePrice(durationMinutes, passengers) {
  // Base price in INR for domestic flights
  const basePrice = 3500; // ₹3,500 instead of $100
  const pricePerMinute = 25; // ₹25 per minute instead of $0.5
  
  const total = (basePrice + (durationMinutes * pricePerMinute)) * passengers;
  
  // Add some random variation (±₹500)
  const variation = Math.random() * 1000 - 500;
  
  return Math.round(total + variation);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const passengers = parseInt(searchParams.get('passengers')) || 1;

    // Validate required parameters
    if (!from || !to || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to, date' },
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

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      return NextResponse.json(
        { error: 'Date cannot be in the past' },
        { status: 400 }
      );
    }

    console.log(`Searching flights from ${from} to ${to} on ${date}`);

    // Search for flights using the flight API (with Redis caching)
    const flights = await flightAPI.searchFlights(from, to, date);

    // Format the response with INR prices
    const formattedFlights = flights.map((flight, index) => {
      const departure = flight.departure;
      const arrival = flight.arrival;
      
      return {
        id: `flight-${index}-${Date.now()}`,
        airline: departure.airline?.name || 'Unknown Airline',
        flightNumber: departure.number,
        aircraft: departure.aircraft?.model || 'Unknown',
        
        departure: {
          airport: from,
          time: departure.departure.scheduledTimeUtc,
          terminal: departure.departure.terminal || 'T1',
          gate: departure.departure.gate || '—'
        },
        
        arrival: {
          airport: to,
          time: arrival.arrival.scheduledTimeUtc,
          terminal: arrival.arrival.terminal || 'T1',
          gate: arrival.arrival.gate || '—'
        },
        
        duration: flight.duration,
        price: calculatePrice(flight.duration.totalMinutes, passengers),
        seatsAvailable: Math.floor(Math.random() * 50) + 10, // Mock data
        bookingClass: 'Economy'
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        searchParams: { from, to, date, passengers },
        flights: formattedFlights,
        total: formattedFlights.length,
        currency: 'INR',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Flight search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to search flights',
        details: error.message 
      },
      { status: 500 }
    );
  }
}