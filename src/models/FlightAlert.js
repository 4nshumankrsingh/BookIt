const mongoose = require('mongoose');

const flightAlertSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip' 
  },
  flightRoute: {
    from: { type: String, required: true }, // IATA code
    to: { type: String, required: true },   // IATA code
    fromName: { type: String, required: true },
    toName: { type: String, required: true }
  },
  dates: {
    departure: { type: Date, required: true },
    return: { type: Date } // Optional for round trips
  },
  priceThresholds: {
    current: { type: Number }, // Current lowest price
    target: { type: Number, required: true }, // Desired price
    initial: { type: Number } // Price when alert was created
  },
  passengers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  preferences: {
    airlines: [{ type: String }], // Preferred airlines
    maxStops: { type: Number, default: 2 },
    cabinClass: { 
      type: String, 
      enum: ['economy', 'premium_economy', 'business', 'first'],
      default: 'economy'
    },
    flightTimes: {
      departure: {
        earliest: { type: String }, // HH:MM format
        latest: { type: String }    // HH:MM format
      }
    }
  },
  alertConfig: {
    frequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    notificationMethods: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    triggerConditions: {
      priceDrop: { type: Boolean, default: true },
      priceBelowTarget: { type: Boolean, default: true },
      fareSales: { type: Boolean, default: false }
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'triggered'],
    default: 'active'
  },
  statistics: {
    checks: { type: Number, default: 0 },
    priceChanges: { type: Number, default: 0 },
    lastCheck: { type: Date },
    lowestRecorded: { type: Number },
    highestRecorded: { type: Number }
  },
  notifications: [{
    sentAt: { type: Date, default: Date.now },
    type: { 
      type: String, 
      enum: ['price_drop', 'target_reached', 'fare_sale', 'status_change']
    },
    message: { type: String },
    oldPrice: { type: Number },
    newPrice: { type: Number },
    percentageChange: { type: Number }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
flightAlertSchema.index({ userId: 1, status: 1 });
flightAlertSchema.index({ 
  'flightRoute.from': 1, 
  'flightRoute.to': 1, 
  'dates.departure': 1,
  status: 1 
});

// Virtual for savings percentage
flightAlertSchema.virtual('savingsPercentage').get(function() {
  if (this.priceThresholds.initial && this.priceThresholds.current) {
    return ((this.priceThresholds.initial - this.priceThresholds.current) / this.priceThresholds.initial) * 100;
  }
  return 0;
});

// Virtual for days until departure
flightAlertSchema.virtual('daysUntilDeparture').get(function() {
  const today = new Date();
  const departure = new Date(this.dates.departure);
  const diffTime = Math.abs(departure - today);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if price meets threshold
flightAlertSchema.methods.isPriceAcceptable = function(currentPrice) {
  return currentPrice <= this.priceThresholds.target;
};

// Method to calculate savings
flightAlertSchema.methods.calculateSavings = function(currentPrice) {
  if (!this.priceThresholds.initial) return 0;
  return this.priceThresholds.initial - currentPrice;
};

module.exports = mongoose.models.FlightAlert || mongoose.model('FlightAlert', flightAlertSchema);