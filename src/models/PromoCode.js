const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  minAmount: { 
    type: Number, 
    required: true 
  },
  maxDiscount: { 
    type: Number, 
    default: null 
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  usageLimit: { 
    type: Number, 
    required: true 
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  applicableCategories: [{ 
    type: String 
  }], // Added category restrictions
  description: { 
    type: String 
  } // Added description
}, {
  timestamps: true
});

// Virtual to check if promo is valid
promoSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.isActive &&
    this.usedCount < this.usageLimit &&
    now >= this.validFrom &&
    now <= this.validUntil
  );
});

module.exports = mongoose.models.PromoCode || mongoose.model('PromoCode', promoSchema);