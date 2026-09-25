const mongoose = require('mongoose');

const subscriptionPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'NGN' },
    durationDays: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isPromotional: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionPackage', subscriptionPackageSchema);