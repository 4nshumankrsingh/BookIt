import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Experience from '@/models/Experience';
import PromoCode from '@/models/PromoCode';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { experienceId, slotId, userInfo, participants, promoCode } = body;

    // Validate required fields
    if (!experienceId || !slotId || !userInfo || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get experience and slot
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const slot = experience.slots.id(slotId);
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    // Check availability
    if (slot.bookedParticipants + participants > slot.maxParticipants) {
      return NextResponse.json(
        { error: 'Not enough available spots' },
        { status: 400 }
      );
    }

    // Calculate price
    let totalPrice = slot.price * participants;
    let discountApplied = 0;
    let finalPrice = totalPrice;

    // Apply promo code if provided
    if (promoCode) {
      const promo = await PromoCode.findOne({ 
        code: promoCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
        usedCount: { $lt: '$usageLimit' }
      });

      if (promo && totalPrice >= promo.minAmount) {
        if (promo.discountType === 'percentage') {
          discountApplied = (totalPrice * promo.discountValue) / 100;
          if (promo.maxDiscount && discountApplied > promo.maxDiscount) {
            discountApplied = promo.maxDiscount;
          }
        } else {
          discountApplied = promo.discountValue;
        }
        finalPrice = totalPrice - discountApplied;
        
        // Update promo code usage
        promo.usedCount += 1;
        await promo.save();
      }
    }

    // Create booking
    const booking = new Booking({
      experienceId,
      slotId,
      userInfo,
      participants,
      totalPrice,
      discountApplied,
      finalPrice,
      promoCode: promoCode || null
    });

    await booking.save();

    // Update slot booked participants
    slot.bookedParticipants += participants;
    await experience.save();

    return NextResponse.json({ 
      success: true, 
      bookingId: booking._id,
      finalPrice 
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}