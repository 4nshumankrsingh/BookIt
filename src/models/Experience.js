const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  bookedParticipants: { type: Number, default: 0 },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  basePrice: { type: Number, required: true }, // Added base price
  included: [{ type: String }], // Added inclusions
  highlights: [{ type: String }], // Added highlights
  meetingPoint: { type: String }, // Added meeting point
  slots: [slotSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Virtual for available slots
experienceSchema.virtual('availableSlots').get(function() {
  return this.slots.filter(slot => 
    slot.isAvailable && 
    slot.bookedParticipants < slot.maxParticipants &&
    slot.date >= new Date()
  );
});

module.exports = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);