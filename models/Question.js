const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
    },
    type: {
      type: String,
      enum: [
        'short_text',
        'long_text',
        'number',
        'email',
        'phone',
        'date',
        'yes_no',
        'single_choice',
        'multiple_choice',
        'dropdown',
        'file_upload',
        'image_upload',
        'url',
        'currency'
      ],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    helperText: {
      type: String
    },
    placeholder: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{ type: String }],
    displayOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    validationRules: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

// Rendering a form means "get this form's questions in order" — the main read pattern
questionSchema.index({ formId: 1, displayOrder: 1 });
// tenantId is duplicated here (not just reachable via formId) so a tenant-ownership
// check on a single Question doesn't require an extra lookup through Form
questionSchema.index({ tenantId: 1 });

module.exports = mongoose.model('Question', questionSchema);