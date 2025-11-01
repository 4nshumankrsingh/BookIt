import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FlightAlert from '@/models/FlightAlert';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const alerts = await FlightAlert.find({ userId: user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching flight alerts:', error);
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
    
    const alert = new FlightAlert({
      userId: user.id,
      ...body,
      status: 'active',
      'priceThresholds.initial': body.priceThresholds?.target || body.targetPrice,
      'priceThresholds.current': body.priceThresholds?.target || body.targetPrice
    });

    await alert.save();

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error creating flight alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}