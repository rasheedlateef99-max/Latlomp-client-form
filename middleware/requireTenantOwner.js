const TenantMembership = require('../models/TenantMembership');
const Tenant = require('../models/Tenant');

async function requireTenantOwner(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const membership = await TenantMembership.findOne({
    userId: req.user._id,
    role: 'owner',
    status: 'active'
  });

  if (!membership) {
    return res.status(403).json({ error: 'No tenant account found for this user' });
  }

  const tenant = await Tenant.findById(membership.tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  req.tenant = tenant;
  next();
}

module.exports = requireTenantOwner;