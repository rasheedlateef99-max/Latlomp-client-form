const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// A form's slug only needs to be unique WITHIN its tenant, not globally —
// two different tenants can each have a form called "website-development"
formSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Form', formSchema);