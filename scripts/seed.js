const mongoose = require('mongoose');
const Experience = require('../src/models/Experience');
const PromoCode = require('../src/models/PromoCode');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit';

const sampleExperiences = [
  {
    title: "Sunset Sailing Adventure",
    description: "Enjoy a breathtaking sunset cruise along the coastline with complimentary drinks and snacks. Perfect for couples and small groups looking for a romantic evening on the water.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Miami Beach, FL",
    duration: "3 hours",
    category: "Sailing",
    rating: 4.8,
    reviewCount: 127,
    basePrice: 89,
    included: [
      "Complimentary drinks",
      "Light snacks",
      "Life jackets",
      "Experienced captain"
    ],
    highlights: [
      "Stunning sunset views",
      "Photo opportunities",
      "Relaxing atmosphere",
      "Professional crew"
    ],
    meetingPoint: "Miami Marina, Dock 5",
    slots: [
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: "16:00",
        endTime: "19:00",
        maxParticipants: 12,
        bookedParticipants: 3,
        price: 89,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 2 * 86400000),
        startTime: "16:00",
        endTime: "19:00",
        maxParticipants: 12,
        bookedParticipants: 7,
        price: 89,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 3 * 86400000),
        startTime: "16:00",
        endTime: "19:00",
        maxParticipants: 12,
        bookedParticipants: 0,
        price: 89,
        isAvailable: true
      }
    ]
  },
  {
    title: "Mountain Hiking Expedition",
    description: "Challenge yourself with this guided mountain hike through scenic trails and breathtaking views. Suitable for intermediate hikers with proper gear.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Rocky Mountains, CO",
    duration: "6 hours",
    category: "Hiking",
    rating: 4.9,
    reviewCount: 89,
    basePrice: 65,
    included: [
      "Professional guide",
      "Hiking poles",
      "First aid kit",
      "Trail snacks"
    ],
    highlights: [
      "Panoramic mountain views",
      "Wildlife spotting",
      "Fresh mountain air",
      "Photography spots"
    ],
    meetingPoint: "Trailhead Parking Lot",
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 2,
        price: 65,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 3 * 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 0,
        price: 65,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 5 * 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 5,
        price: 65,
        isAvailable: true
      }
    ]
  },
  {
    title: "Wine Tasting Tour",
    description: "Explore local vineyards and taste exquisite wines with expert sommeliers in a beautiful setting. Learn about wine production and enjoy gourmet pairings.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Napa Valley, CA",
    duration: "4 hours",
    category: "Food & Drink",
    rating: 4.7,
    reviewCount: 203,
    basePrice: 75,
    included: [
      "Wine tasting (5 varieties)",
      "Cheese platter",
      "Vineyard tour",
      "Expert sommelier"
    ],
    highlights: [
      "Premium wine selection",
      "Beautiful vineyard scenery",
      "Educational experience",
      "Gourmet food pairings"
    ],
    meetingPoint: "Napa Valley Visitors Center",
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 20,
        bookedParticipants: 15,
        price: 75,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 2 * 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 20,
        bookedParticipants: 8,
        price: 75,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 4 * 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 20,
        bookedParticipants: 0,
        price: 75,
        isAvailable: true
      }
    ]
  },
  {
    title: "City Bike Tour",
    description: "Discover the city's hidden gems and famous landmarks on this guided bike tour. A fun and active way to explore urban landscapes.",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "New York, NY",
    duration: "2.5 hours",
    category: "City Tour",
    rating: 4.6,
    reviewCount: 156,
    basePrice: 45,
    included: [
      "Bike rental",
      "Helmet",
      "Bottled water",
      "Local guide"
    ],
    highlights: [
      "Cover more ground than walking",
      "Local insights",
      "Photo stops at landmarks",
      "Small group experience"
    ],
    meetingPoint: "Central Park Bike Rental",
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "10:00",
        endTime: "12:30",
        maxParticipants: 15,
        bookedParticipants: 10,
        price: 45,
        isAvailable: true
      },
      {
        date: new Date(Date.now() + 2 * 86400000),
        startTime: "10:00",
        endTime: "12:30",
        maxParticipants: 15,
        bookedParticipants: 4,
        price: 45,
        isAvailable: true
      }
    ]
  }
];

const samplePromoCodes = [
  {
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minAmount: 50,
    maxDiscount: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 86400000), // 30 days from now
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    description: "Get 10% off on bookings above $50"
  },
  {
    code: "FLAT100",
    discountType: "fixed",
    discountValue: 100,
    minAmount: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 86400000),
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
    description: "Flat $100 off on bookings above $200"
  },
  {
    code: "WELCOME15",
    discountType: "percentage",
    discountValue: 15,
    minAmount: 75,
    maxDiscount: 30,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 86400000), // 60 days from now
    usageLimit: 200,
    usedCount: 0,
    isActive: true,
    description: "Welcome discount for new users"
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    preferences: {
      categories: ["Sailing", "Hiking"],
      notifications: {
        email: true,
        sms: false
      }
    }
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+0987654321",
    preferences: {
      categories: ["Food & Drink", "City Tour"],
      notifications: {
        email: true,
        sms: true
      }
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample experiences
    await Experience.insertMany(sampleExperiences);
    console.log('Added sample experiences');

    // Insert sample promo codes
    await PromoCode.insertMany(samplePromoCodes);
    console.log('Added sample promo codes');

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Added sample users');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();