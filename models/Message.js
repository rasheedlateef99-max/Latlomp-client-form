const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['tenant', 'client'], required: true },
    body: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// Core query: "this project's message thread, in order"
messageSchema.index({ projectId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);