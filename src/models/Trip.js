const mongoose = require('mongoose');

const flightSegmentSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: {
    airport: { type: String, required: true },
    terminal: { type: String },
    gate: { type: String },
    time: { type: Date, required: true }
  },
  arrival: {
    airport: { type: String, required: true },
    terminal: { type: String },
    gate: { type: String },
    time: { type: Date, required: true }
  },
  duration: { 
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  aircraft: { type: String },
  bookingClass: { type: String, default: 'Economy' },
  price: { type: Number, required: true }
});

const experienceBookingSchema = new mongoose.Schema({
  experienceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience', 
    required: true 
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  participants: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
});

const tripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelers: [{
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String }
  }],
  flights: {
    outgoing: [flightSegmentSchema],
    returning: [flightSegmentSchema],
    totalFlightPrice: { type: Number, default: 0 }
  },
  experiences: [experienceBookingSchema],
  totalCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['planning', 'booked', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  tripReference: { type: String, unique: true },
  notes: { type: String },
  documents: [{
    type: { type: String, enum: ['boarding_pass', 'voucher', 'receipt', 'itinerary'] },
    url: { type: String, required: true },
    name: { type: String, required: true }
  }]
}, {
  timestamps: true
});

// Generate trip reference before saving
tripSchema.pre('save', async function(next) {
  if (!this.tripReference) {
    const count = await mongoose.model('Trip').countDocuments();
    this.tripReference = `TR${Date.now()}${count + 1}`;
  }
  next();
});

// Virtual for total experiences cost
tripSchema.virtual('totalExperiencesCost').get(function() {
  return this.experiences.reduce((total, exp) => {
    const expPrice = exp.bookingId?.finalPrice || 0;
    return total + expPrice;
  }, 0);
});

// Virtual for trip duration in days
tripSchema.virtual('durationDays').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.models.Trip || mongoose.model('Trip', tripSchema);