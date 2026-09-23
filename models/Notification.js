const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String
    },
    relatedProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Core query: "this tenant owner's unread notifications"
notificationSchema.index({ tenantId: 1, userId: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);