import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FlightBooking from '@/models/FlightBooking';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const flightBooking = new FlightBooking({
      userId: user.id,
      ...body,
      paymentStatus: 'paid'
    });

    await flightBooking.save();

    return NextResponse.json({ 
      success: true, 
      booking: flightBooking 
    });
  } catch (error) {
    console.error('Error creating flight booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await FlightBooking.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching flight bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}