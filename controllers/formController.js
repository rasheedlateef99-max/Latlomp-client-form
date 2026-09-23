const Form = require('../models/Form');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function listForms(req, res) {
  const forms = await Form.find({ tenantId: req.tenant._id }).sort({ createdAt: -1 });
  res.json({ forms });
}

async function createForm(req, res) {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Form name is required' });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await Form.findOne({ tenantId: req.tenant._id, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const form = await Form.create({
    tenantId: req.tenant._id,
    name: name.trim(),
    description: description ? description.trim() : undefined,
    slug
  });

  res.status(201).json({ form });
}

async function getForm(req, res) {
  const form = await Form.findOne({ _id: req.params.formId, tenantId: req.tenant._id });
  if (!form) return res.status(404).json({ error: 'Form not found' });
  res.json({ form, tenantSlug: req.tenant.slug });
}

module.exports = { listForms, createForm, getForm };