const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },
    clientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true
    },
    requestId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        'new',
        'under_review',
        'clarification_required',
        'proposal_prepared',
        'awaiting_client_approval',
        'approved',
        'in_development',
        'completed',
        'cancelled',
        'archived'
      ],
      default: 'new'
    },
    answers: [answerSchema],
    submittedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// requestId (e.g. "LLP-2026-00001") only needs to be unique per tenant, not globally
projectSchema.index({ tenantId: 1, requestId: 1 }, { unique: true });
// Core future query: "this client's projects within this tenant"
projectSchema.index({ tenantId: 1, clientUserId: 1 });

module.exports = mongoose.model('Project', projectSchema);