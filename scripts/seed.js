const mongoose = require('mongoose');
const Experience = require('../src/models/Experience');
const PromoCode = require('../src/models/PromoCode');

const MONGODB_URI = 'mongodb://localhost:27017/bookit';

const sampleExperiences = [
  {
    title: "Sunset Sailing Adventure",
    description: "Enjoy a breathtaking sunset cruise along the coastline with complimentary drinks and snacks.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Miami Beach, FL",
    duration: "3 hours",
    category: "Sailing",
    rating: 4.8,
    reviewCount: 127,
    slots: [
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: "16:00",
        endTime: "19:00",
        maxParticipants: 12,
        bookedParticipants: 3,
        price: 89
      },
      {
        date: new Date(Date.now() + 2 * 86400000),
        startTime: "16:00",
        endTime: "19:00",
        maxParticipants: 12,
        bookedParticipants: 7,
        price: 89
      }
    ]
  },
  {
    title: "Mountain Hiking Expedition",
    description: "Challenge yourself with this guided mountain hike through scenic trails and breathtaking views.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Rocky Mountains, CO",
    duration: "6 hours",
    category: "Hiking",
    rating: 4.9,
    reviewCount: 89,
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 2,
        price: 65
      },
      {
        date: new Date(Date.now() + 3 * 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 0,
        price: 65
      }
    ]
  },
  {
    title: "Wine Tasting Tour",
    description: "Explore local vineyards and taste exquisite wines with expert sommeliers in a beautiful setting.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Napa Valley, CA",
    duration: "4 hours",
    category: "Food & Drink",
    rating: 4.7,
    reviewCount: 203,
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 20,
        bookedParticipants: 15,
        price: 75
      },
      {
        date: new Date(Date.now() + 2 * 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 20,
        bookedParticipants: 8,
        price: 75
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
    isActive: true
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
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample experiences
    await Experience.insertMany(sampleExperiences);
    console.log('Added sample experiences');

    // Insert sample promo codes
    await PromoCode.insertMany(samplePromoCodes);
    console.log('Added sample promo codes');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();