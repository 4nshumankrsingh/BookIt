import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FlightAlert from '@/models/FlightAlert';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const alert = await FlightAlert.findOne({ _id: params.id, userId: user.id });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching flight alert:', error);
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
    
    const alert = await FlightAlert.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      body,
      { new: true }
    );

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error updating flight alert:', error);
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

    const alert = await FlightAlert.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}