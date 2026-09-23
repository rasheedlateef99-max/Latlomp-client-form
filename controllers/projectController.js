const Project = require('../models/Project');
const Question = require('../models/Question');
const Form = require('../models/Form');
const Notification = require('../models/Notification');

async function listProjects(req, res) {
  const projects = await Project.find({ tenantId: req.tenant._id }).sort({ createdAt: -1 });
  const forms = await Form.find({ tenantId: req.tenant._id });
  const formMap = {};
  forms.forEach(f => { formMap[f._id.toString()] = f.name; });

  const unreadNotifs = await Notification.find({
    tenantId: req.tenant._id,
    userId: req.user._id,
    read: false,
    relatedProjectId: { $ne: null }
  });
  const unreadProjectIds = new Set(unreadNotifs.map(n => n.relatedProjectId.toString()));

  res.json({
    projects: projects.map(p => ({
      id: p._id,
      requestId: p.requestId,
      status: p.status,
      formName: formMap[p.formId.toString()] || 'Unknown form',
      submittedAt: p.submittedAt,
      isNew: unreadProjectIds.has(p._id.toString())
    }))
  });
}

async function getProject(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, tenantId: req.tenant._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  const questions = await Question.find({ formId: project.formId });
  const questionMap = {};
  questions.forEach(q => { questionMap[q._id.toString()] = q; });

  const answers = project.answers.map(a => {
    const q = questionMap[a.questionId.toString()];
    return {
      label: q ? q.label : 'Unknown question',
      value: a.value
    };
  });

  await Notification.updateMany(
    { relatedProjectId: project._id, tenantId: req.tenant._id, userId: req.user._id },
    { read: true }
  );

  res.json({
    project: {
      id: project._id,
      requestId: project.requestId,
      status: project.status,
      submittedAt: project.submittedAt
    },
    answers
  });
}

module.exports = { listProjects, getProject };