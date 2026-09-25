const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorType: { type: String, required: true },
    actorLabel: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);