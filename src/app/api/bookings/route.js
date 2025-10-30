import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Experience from '@/models/Experience';
import PromoCode from '@/models/PromoCode';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { 
      experienceId, 
      slotId, 
      userInfo, 
      participants, 
      promoCode,
      userId 
    } = body;

    // Validate required fields
    if (!experienceId || !slotId || !userInfo || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user info
    const { name, email, phone } = userInfo;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Complete user information is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get experience and validate
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    if (!experience.isActive) {
      return NextResponse.json(
        { error: 'Experience is no longer available' },
        { status: 410 }
      );
    }

    // Find the specific slot
    const slot = experience.slots.id(slotId);
    if (!slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    if (!slot.isAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 410 }
      );
    }

    // Check availability - prevent double booking
    if (slot.bookedParticipants + participants > slot.maxParticipants) {
      return NextResponse.json(
        { error: 'Not enough available spots for this time slot' },
        { status: 400 }
      );
    }

    // Calculate base price
    let totalPrice = slot.price * participants;
    let discountApplied = 0;
    let finalPrice = totalPrice;
    let validatedPromo = null;

    // Apply promo code validation if provided
    if (promoCode) {
      const promoValidationResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/promo/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promoCode, amount: totalPrice }),
      });

      const promoResult = await promoValidationResponse.json();

      if (promoResult.valid) {
        discountApplied = promoResult.discount;
        finalPrice = promoResult.finalAmount;
        validatedPromo = promoResult.promo;
        
        // Update promo code usage count
        await PromoCode.findOneAndUpdate(
          { code: promoCode.toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      } else {
        return NextResponse.json(
          { error: promoResult.error || 'Invalid promo code' },
          { status: 400 }
        );
      }
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        phone,
        preferences: {
          categories: [experience.category],
          notifications: { email: true, sms: false }
        }
      });
      await user.save();
    }

    // Create booking
    const booking = new Booking({
      experienceId,
      slotId,
      userId: user._id,
      userInfo: { name, email, phone },
      participants,
      totalPrice,
      discountApplied,
      finalPrice,
      promoCode: promoCode || null,
      status: 'confirmed'
    });

    await booking.save();

    // Update slot booked participants
    slot.bookedParticipants += participants;
    
    // Mark slot as unavailable if fully booked
    if (slot.bookedParticipants >= slot.maxParticipants) {
      slot.isAvailable = false;
    }
    
    await experience.save();

    // Update user's bookings
    user.bookings.push(booking._id);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        experience: {
          title: experience.title,
          date: slot.date,
          startTime: slot.startTime,
          meetingPoint: experience.meetingPoint
        },
        userInfo,
        participants,
        totalPrice,
        discountApplied,
        finalPrice,
        promoCode: validatedPromo,
        status: booking.status
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const bookings = await Booking.find({ userId: user._id })
      .populate('experienceId', 'title image location duration')
      .sort({ createdAt: -1 })
      .lean();

    const transformedBookings = bookings.map(booking => {
      const experience = booking.experienceId;
      return {
        id: booking._id,
        bookingReference: booking.bookingReference,
        experience: {
          title: experience.title,
          image: experience.image,
          location: experience.location,
          duration: experience.duration
        },
        userInfo: booking.userInfo,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        discountApplied: booking.discountApplied,
        finalPrice: booking.finalPrice,
        status: booking.status,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      };
    });

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}