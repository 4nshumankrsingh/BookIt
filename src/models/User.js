const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String 
  },
  avatar: { 
    type: String 
  },
  preferences: {
    categories: [{ type: String }],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  bookings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  }],
  favoriteExperiences: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'preferences.categories': 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);