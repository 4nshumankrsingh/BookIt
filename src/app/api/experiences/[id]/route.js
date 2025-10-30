import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const experience = await Experience.findById(params.id).lean();
    
    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    if (!experience.isActive) {
      return NextResponse.json(
        { error: 'Experience is not available' },
        { status: 410 }
      );
    }

    // Filter available slots
    const availableSlots = experience.slots
      .filter(slot => 
        slot.isAvailable && 
        slot.bookedParticipants < slot.maxParticipants &&
        new Date(slot.date) >= new Date()
      )
      .map(slot => ({
        _id: slot._id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxParticipants: slot.maxParticipants,
        bookedParticipants: slot.bookedParticipants,
        availableSpots: slot.maxParticipants - slot.bookedParticipants,
        price: slot.price,
        isAvailable: slot.isAvailable
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Group slots by date for easier frontend handling
    const slotsByDate = availableSlots.reduce((acc, slot) => {
      const dateKey = new Date(slot.date).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {});

    // Transform experience data
    const transformedExperience = {
      _id: experience._id,
      title: experience.title,
      description: experience.description,
      image: experience.image,
      location: experience.location,
      duration: experience.duration,
      category: experience.category,
      rating: experience.rating,
      reviewCount: experience.reviewCount,
      basePrice: experience.basePrice,
      included: experience.included || [],
      highlights: experience.highlights || [],
      meetingPoint: experience.meetingPoint,
      availableSlots,
      slotsByDate,
      hasAvailableSlots: availableSlots.length > 0
    };

    return NextResponse.json(transformedExperience);
  } catch (error) {
    console.error('Failed to fetch experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}