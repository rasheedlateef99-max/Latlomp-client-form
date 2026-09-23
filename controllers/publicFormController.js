const Tenant = require('../models/Tenant');
const Form = require('../models/Form');
const Question = require('../models/Question');
const Project = require('../models/Project');

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

async function submitForm(req, res) {
  const { tenantSlug, formSlug } = req.params;

  const tenant = await Tenant.findOne({ slug: tenantSlug, accountStatus: 'active' });
  if (!tenant) return res.status(404).json({ error: 'Not found' });

  const form = await Form.findOne({ tenantId: tenant._id, slug: formSlug, isActive: true });
  if (!form) return res.status(404).json({ error: 'Not found' });

  const questions = await Question.find({ formId: form._id, isActive: true });
  const validQuestionIds = new Set(questions.map(q => q._id.toString()));

  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  const answerMap = {};
  answers.forEach(a => { answerMap[a.questionId] = a.value; });

  for (const q of questions) {
    if (q.required && q.type !== 'file_upload') {
      const val = answerMap[q._id.toString()];
      const isEmpty = val === undefined || val === null || val === '' ||
        (Array.isArray(val) && val.length === 0);
      if (isEmpty) {
        return res.status(400).json({ error: `"${q.label}" is required` });
      }
    }
  }

  const cleanAnswers = answers
    .filter(a => validQuestionIds.has(a.questionId))
    .map(a => ({ questionId: a.questionId, value: a.value }));

  const year = new Date().getFullYear();
  const prefix = tenant.slug.slice(0, 4).toUpperCase();
  const count = await Project.countDocuments({
    tenantId: tenant._id,
    requestId: new RegExp(`^${prefix}-${year}-`)
  });
  const requestId = `${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;

  const project = await Project.create({
    tenantId: tenant._id,
    clientUserId: req.user._id,
    formId: form._id,
    requestId,
    status: 'new',
    answers: cleanAnswers,
    submittedAt: new Date()
  });

  res.status(201).json({ requestId: project.requestId });
}

module.exports = { getPublicForm, submitForm };