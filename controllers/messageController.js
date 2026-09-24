const Message = require('../models/Message');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const Tenant = require('../models/Tenant');

// ---------- Business side ----------
async function listTenantMessages(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, tenantId: req.tenant._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  await Notification.updateMany(
    { relatedProjectId: project._id, tenantId: req.tenant._id, userId: req.user._id, type: 'new_message' },
    { read: true }
  );

  const messages = await Message.find({ projectId: project._id }).sort({ createdAt: 1 });
  res.json({ messages });
}

async function sendTenantMessage(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, tenantId: req.tenant._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  const { body } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ error: 'Message cannot be empty' });

  const message = await Message.create({
    tenantId: req.tenant._id,
    projectId: project._id,
    senderId: req.user._id,
    senderRole: 'tenant',
    body: body.trim()
  });

  await Notification.create({
    tenantId: req.tenant._id,
    userId: project.clientUserId,
    type: 'new_message',
    title: `New message from ${req.tenant.name}`,
    message: body.trim().slice(0, 100),
    relatedProjectId: project._id
  });

  res.status(201).json({ message });
}

// ---------- Client side ----------
async function listClientMessages(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, clientUserId: req.user._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  await Notification.updateMany(
    { relatedProjectId: project._id, userId: req.user._id, type: 'new_message' },
    { read: true }
  );

  const messages = await Message.find({ projectId: project._id }).sort({ createdAt: 1 });
  res.json({ messages });
}

async function sendClientMessage(req, res) {
  const project = await Project.findOne({ _id: req.params.projectId, clientUserId: req.user._id });
  if (!project) return res.status(404).json({ error: 'Submission not found' });

  const { body } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ error: 'Message cannot be empty' });

  const message = await Message.create({
    tenantId: project.tenantId,
    projectId: project._id,
    senderId: req.user._id,
    senderRole: 'client',
    body: body.trim()
  });

  const tenant = await Tenant.findById(project.tenantId);
  await Notification.create({
    tenantId: project.tenantId,
    userId: tenant.ownerUserId,
    type: 'new_message',
    title: 'New client message',
    message: body.trim().slice(0, 100),
    relatedProjectId: project._id
  });

  res.status(201).json({ message });
}

module.exports = { listTenantMessages, sendTenantMessage, listClientMessages, sendClientMessage };