const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  passportNumber: { type: String }
});

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
  seatNumber: { type: String },
  bookingReference: { type: String }
});

const flightBookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip' 
  },
  passengers: [passengerSchema],
  flights: {
    outgoing: [flightSegmentSchema],
    returning: [flightSegmentSchema]
  },
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingReference: { type: String, unique: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  specialRequests: { type: String }
}, {
  timestamps: true
});

// Generate booking reference before saving
flightBookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const count = await mongoose.model('FlightBooking').countDocuments();
    this.bookingReference = `FB${Date.now()}${count + 1}`;
  }
  next();
});

// Virtual for flight duration
flightBookingSchema.virtual('totalDuration').get(function() {
  const outgoingDuration = this.flights.outgoing.reduce((total, flight) => {
    return total + (flight.duration.hours * 60 + flight.duration.minutes);
  }, 0);
  
  const returningDuration = this.flights.returning.reduce((total, flight) => {
    return total + (flight.duration.hours * 60 + flight.duration.minutes);
  }, 0);
  
  return outgoingDuration + returningDuration;
});

module.exports = mongoose.models.FlightBooking || mongoose.model('FlightBooking', flightBookingSchema);