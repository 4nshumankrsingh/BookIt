import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';
import { geocodeAddress } from '@/lib/geocode';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Get experiences with available slots
    const experiences = await Experience.find(filter)
      .select('title description image location duration category rating reviewCount basePrice slots')
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter experiences that have available slots and transform the data
    const transformedExperiences = experiences.map(exp => {
      const availableSlots = exp.slots.filter(slot => 
        slot.isAvailable && 
        slot.bookedParticipants < slot.maxParticipants &&
        new Date(slot.date) >= new Date()
      );

      // Calculate lowest price from available slots
      const lowestPrice = availableSlots.length > 0 
        ? Math.min(...availableSlots.map(slot => slot.price))
        : exp.basePrice;

      return {
        _id: exp._id,
        title: exp.title,
        description: exp.description,
        image: exp.image,
        location: exp.location,
        duration: exp.duration,
        category: exp.category,
        rating: exp.rating,
        reviewCount: exp.reviewCount,
        price: lowestPrice,
        hasAvailableSlots: availableSlots.length > 0,
        availableSlotsCount: availableSlots.length
      };
    }).filter(exp => exp.hasAvailableSlots);

    // Get total count for pagination
    const total = await Experience.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      experiences: transformedExperiences,
      pagination: {
        currentPage: page,
        totalPages,
        totalExperiences: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// Add new experience with geocoding
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { title, description, image, location, duration, category, basePrice, slots } = body;

    // Geocode the location to get coordinates
    let geocodedLocation = null;
    try {
      geocodedLocation = await geocodeAddress(location);
    } catch (error) {
      console.error('Geocoding failed:', error);
      // Continue without coordinates
    }

    const experience = new Experience({
      title,
      description,
      image,
      location,
      duration,
      category,
      basePrice,
      slots,
      coordinates: geocodedLocation ? {
        lat: geocodedLocation.lat,
        lng: geocodedLocation.lng
      } : undefined
    });

    await experience.save();

    return NextResponse.json(
      { success: true, experience },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}