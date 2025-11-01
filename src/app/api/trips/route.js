import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trips = await Trip.find({ userId: user.id })
      .populate('experiences.experienceId')
      .populate('experiences.bookingId')
      .sort({ createdAt: -1 });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const trip = new Trip({
      userId: user.id,
      ...body,
      status: 'planning'
    });

    await trip.save();
    await trip.populate('experiences.experienceId');
    await trip.populate('experiences.bookingId');

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}