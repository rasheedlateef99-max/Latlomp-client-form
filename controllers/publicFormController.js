const Tenant = require('../models/Tenant');
const Form = require('../models/Form');
const Question = require('../models/Question');

async function getPublicForm(req, res) {
  const { tenantSlug, formSlug } = req.params;

  const tenant = await Tenant.findOne({ slug: tenantSlug, accountStatus: 'active' });
  if (!tenant) return res.status(404).json({ error: 'Not found' });

  const form = await Form.findOne({ tenantId: tenant._id, slug: formSlug, isActive: true });
  if (!form) return res.status(404).json({ error: 'Not found' });

  const questions = await Question.find({ formId: form._id, isActive: true }).sort({ displayOrder: 1 });

  res.json({
    tenant: { name: tenant.name, logo: tenant.logo || null },
    form: { id: form._id, name: form.name, description: form.description || null },
    questions: questions.map(q => ({
      id: q._id,
      type: q.type,
      label: q.label,
      helperText: q.helperText || null,
      placeholder: q.placeholder || null,
      required: q.required,
      options: q.options || []
    }))
  });
}

module.exports = { getPublicForm };