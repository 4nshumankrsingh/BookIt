import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await Trip.findOne({ _id: params.id, userId: user.id })
      .populate('experiences.experienceId')
      .populate('experiences.bookingId');

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const trip = await Trip.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      body,
      { new: true }
    ).populate('experiences.experienceId').populate('experiences.bookingId');

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await Trip.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}