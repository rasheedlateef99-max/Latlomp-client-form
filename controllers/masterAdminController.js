const Tenant = require('../models/Tenant');

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

module.exports = { getDashboardStats, listTenants, updateTenantStatus };