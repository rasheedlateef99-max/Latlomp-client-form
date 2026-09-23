const Question = require('../models/Question');
const Form = require('../models/Form');

async function verifyFormOwnership(formId, tenantId) {
  return Form.findOne({ _id: formId, tenantId });
}

async function listQuestions(req, res) {
  const form = await verifyFormOwnership(req.params.formId, req.tenant._id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const questions = await Question.find({ formId: form._id }).sort({ displayOrder: 1 });
  res.json({ questions });
}

async function createQuestion(req, res) {
  const form = await verifyFormOwnership(req.params.formId, req.tenant._id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const { type, label, helperText, placeholder, required, options } = req.body;
  if (!type || !label || !label.trim()) {
    return res.status(400).json({ error: 'Question type and label are required' });
  }

  const lastQuestion = await Question.findOne({ formId: form._id }).sort({ displayOrder: -1 });
  const displayOrder = lastQuestion ? lastQuestion.displayOrder + 1 : 0;

  const question = await Question.create({
    formId: form._id,
    tenantId: req.tenant._id,
    type,
    label: label.trim(),
    helperText: helperText ? helperText.trim() : undefined,
    placeholder: placeholder ? placeholder.trim() : undefined,
    required: !!required,
    options: Array.isArray(options) ? options.filter(o => o && o.trim()) : [],
    displayOrder
  });

  res.status(201).json({ question });
}

async function updateQuestion(req, res) {
  const form = await verifyFormOwnership(req.params.formId, req.tenant._id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const question = await Question.findOne({ _id: req.params.questionId, formId: form._id });
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const { label, helperText, placeholder, required, options, isActive } = req.body;
  if (label !== undefined) question.label = label.trim();
  if (helperText !== undefined) question.helperText = helperText.trim();
  if (placeholder !== undefined) question.placeholder = placeholder.trim();
  if (required !== undefined) question.required = !!required;
  if (Array.isArray(options)) question.options = options.filter(o => o && o.trim());
  if (isActive !== undefined) question.isActive = !!isActive;

  await question.save();
  res.json({ question });
}

async function deleteQuestion(req, res) {
  const form = await verifyFormOwnership(req.params.formId, req.tenant._id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const question = await Question.findOneAndDelete({ _id: req.params.questionId, formId: form._id });
  if (!question) return res.status(404).json({ error: 'Question not found' });

  res.json({ message: 'Question deleted' });
}

module.exports = { listQuestions, createQuestion, updateQuestion, deleteQuestion };