const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  experienceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  maxParticipants: { 
    type: Number, 
    required: true 
  },
  bookedParticipants: { 
    type: Number, 
    default: 0 
  },
  price: { 
    type: Number, 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  waitingList: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }] // Added waiting list feature
}, {
  timestamps: true
});

// Virtual for available spots
slotSchema.virtual('availableSpots').get(function() {
  return this.maxParticipants - this.bookedParticipants;
});

// Virtual to check if slot is full
slotSchema.virtual('isFull').get(function() {
  return this.bookedParticipants >= this.maxParticipants;
});

// Method to check if slot can accommodate participants
slotSchema.methods.canAccommodate = function(participants) {
  return (this.bookedParticipants + participants) <= this.maxParticipants;
};

// Index for better query performance
slotSchema.index({ experienceId: 1, date: 1 });
slotSchema.index({ date: 1, isAvailable: 1 });

module.exports = mongoose.models.Slot || mongoose.model('Slot', slotSchema);