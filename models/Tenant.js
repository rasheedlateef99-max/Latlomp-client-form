const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String
    },
    description: {
      type: String
    },
    brand: {
      primaryColor: { type: String },
      accentColor: { type: String }
    },
    contact: {
      email: { type: String },
      phone: { type: String },
      website: { type: String }
    },
    socialLinks: {
      type: Map,
      of: String
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'archived'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);