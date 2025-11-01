import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import notificationService, { NOTIFICATION_TYPES } from '@/lib/notifications';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, this would fetch from a notifications collection
    // For now, return mock data
    const notifications = [
      {
        id: '1',
        type: NOTIFICATION_TYPES.PRICE_ALERT,
        title: 'Price Drop Alert',
        message: 'Flight prices to Paris have dropped by 15%',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        data: {
          route: { from: 'DEL', to: 'CDG' },
          oldPrice: 45000,
          newPrice: 38250,
          savings: 6750
        }
      },
      {
        id: '2',
        type: NOTIFICATION_TYPES.FLIGHT_STATUS,
        title: 'Flight Status Update',
        message: 'AI 101 to New York is now boarding',
        read: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        data: {
          flight: 'AI 101',
          status: 'boarding',
          gate: 'B12'
        }
      }
    ];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
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
    const { type, data, channels } = body;

    // Send notification
    const results = await notificationService.sendNotification(
      user,
      type,
      data,
      channels
    );

    return NextResponse.json({ 
      success: true, 
      results 
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    // In a real implementation, this would update notifications in the database
    // For now, return success
    return NextResponse.json({ 
      success: true, 
      message: 'Notifications updated successfully' 
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}