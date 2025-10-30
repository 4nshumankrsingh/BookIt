const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experienceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience', 
    required: true 
  },
  slotId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  participants: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  discountApplied: { 
    type: Number, 
    default: 0 
  },
  finalPrice: { 
    type: Number, 
    required: true 
  },
  promoCode: { 
    type: String, 
    default: null 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed' 
  },
  bookingReference: { 
    type: String, 
    unique: true 
  } // Added booking reference
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingReference = `BK${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);