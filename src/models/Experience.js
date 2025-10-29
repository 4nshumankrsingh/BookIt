const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  bookedParticipants: { type: Number, default: 0 },
  price: { type: Number, required: true }
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
  slots: [slotSchema]
}, {
  timestamps: true
});

module.exports = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);