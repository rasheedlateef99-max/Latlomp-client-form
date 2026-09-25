const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPackage', required: true },
    provider: { type: String, default: 'paystack' },
    reference: { type: String, required: true, unique: true },
    amountExpected: { type: Number, required: true },
    amountPaid: { type: Number },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'pending',
        'successful',
        'amount_mismatch',
        'failed',
        'reversed',
        'manually_approved',
        'manually_rejected'
      ],
      default: 'pending'
    },
    subscriptionApplied: { type: Boolean, default: false },
    reviewedByLabel: { type: String },
    reviewedAt: { type: Date },
    reviewNotes: { type: String }
  },
  { timestamps: true }
);

// Idempotency anchor — a reference can only ever map to one Payment record
paymentSchema.index({ reference: 1 }, { unique: true });
// Master Admin review queue
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);