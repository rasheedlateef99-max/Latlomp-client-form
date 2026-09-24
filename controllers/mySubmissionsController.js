const Project = require('../models/Project');
const Form = require('../models/Form');
const Tenant = require('../models/Tenant');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

async function listMySubmissions(req, res) {
  const projects = await Project.find({ clientUserId: req.user._id }).sort({ createdAt: -1 });

  const formIds = [...new Set(projects.map(p => p.formId.toString()))];
  const forms = await Form.find({ _id: { $in: formIds } });
  const formMap = {};
  forms.forEach(f => { formMap[f._id.toString()] = f; });

  const tenantIds = [...new Set(projects.map(p => p.tenantId.toString()))];
  const tenants = await Tenant.find({ _id: { $in: tenantIds } });
  const tenantMap = {};
  tenants.forEach(t => { tenantMap[t._id.toString()] = t; });

  const unreadNotifs = await Notification.find({
    userId: req.user._id,
    read: false,
    relatedProjectId: { $ne: null }
  });
  const unreadProjectIds = new Set(unreadNotifs.map(n => n.relatedProjectId.toString()));

  res.json({
    submissions: projects.map(p => ({
      id: p._id,
      requestId: p.requestId,
      status: p.status,
      submittedAt: p.submittedAt,
      formName: formMap[p.formId.toString()]?.name || 'Unknown form',
      businessName: tenantMap[p.tenantId.toString()]?.name || 'Unknown business',
      isNew: unreadProjectIds.has(p._id.toString())
    }))
  });
}

async function getMySubmission(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, clientUserId: req.user._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  const form = await Form.findById(project.formId);
  const tenant = await Tenant.findById(project.tenantId);
  const questions = await Question.find({ formId: project.formId });
  const questionMap = {};
  questions.forEach(q => { questionMap[q._id.toString()] = q; });

  const answers = project.answers.map(a => ({
    label: questionMap[a.questionId.toString()]?.label || 'Unknown question',
    value: a.value
  }));

  res.json({
    project: {
      requestId: project.requestId,
      status: project.status,
      submittedAt: project.submittedAt,
      formName: form?.name || 'Unknown form',
      businessName: tenant?.name || 'Unknown business'
    },
    answers
  });
}

module.exports = { listMySubmissions, getMySubmission };