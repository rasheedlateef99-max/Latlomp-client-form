const mongoose = require('mongoose');

const tenantMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'staff', 'client'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'invited', 'removed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

// A user should have at most one membership record per tenant
tenantMembershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });
// Core future query: "list all members of tenant X"
tenantMembershipSchema.index({ tenantId: 1 });

module.exports = mongoose.model('TenantMembership', tenantMembershipSchema);