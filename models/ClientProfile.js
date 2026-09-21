const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    phone: {
      type: String
    },
    company: {
      type: String
    },
    country: {
      type: String
    }
  },
  { timestamps: true }
);

// One profile per user per tenant
clientProfileSchema.index({ tenantId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ClientProfile', clientProfileSchema);