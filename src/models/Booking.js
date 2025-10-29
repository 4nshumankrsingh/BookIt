const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  participants: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  promoCode: { type: String, default: null },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);