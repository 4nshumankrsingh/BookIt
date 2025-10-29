const mongoose = require('mongoose');
const Experience = require('../src/models/Experience');
const PromoCode = require('../src/models/PromoCode');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit';

// ... (keep your existing sampleExperiences and samplePromoCodes arrays)

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