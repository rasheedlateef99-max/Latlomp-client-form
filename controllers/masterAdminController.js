const Tenant = require('../models/Tenant');
const User = require('../models/User');
const Form = require('../models/Form');
const Project = require('../models/Project');

async function getDashboardStats(req, res) {
  const totalTenants = await Tenant.countDocuments();
  const activeTenants = await Tenant.countDocuments({ accountStatus: 'active' });
  const suspendedTenants = await Tenant.countDocuments({ accountStatus: 'suspended' });
  res.json({ totalTenants, activeTenants, suspendedTenants });
}

async function listTenants(req, res) {
  const tenants = await Tenant.find().sort({ createdAt: -1 });
  res.json({
    tenants: tenants.map(t => ({
      id: t._id,
      name: t.name,
      slug: t.slug,
      accountStatus: t.accountStatus
    }))
  });
}

async function updateTenantStatus(req, res) {
  const { status } = req.body;
  if (!['active', 'suspended', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const tenant = await Tenant.findById(req.params.tenantId);
  if (!tenant) return res.status(404).json({ error: 'Business not found' });

  tenant.accountStatus = status;
  await tenant.save();
  res.json({ tenant: { id: tenant._id, accountStatus: tenant.accountStatus } });
}

async function getTenantDetail(req, res) {
  const tenant = await Tenant.findById(req.params.tenantId);
  if (!tenant) return res.status(404).json({ error: 'Business not found' });

  const owner = await User.findById(tenant.ownerUserId);
  const formCount = await Form.countDocuments({ tenantId: tenant._id });
  const projectCount = await Project.countDocuments({ tenantId: tenant._id });

  res.json({
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      accountStatus: tenant.accountStatus,
      createdAt: tenant.createdAt
    },
    owner: owner ? { name: owner.name, email: owner.email } : null,
    stats: { formCount, projectCount }
  });
}

module.exports = { getDashboardStats, listTenants, updateTenantStatus, getTenantDetail };