const Tenant = require('../models/Tenant');
const TenantMembership = require('../models/TenantMembership');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createTenant(req, res) {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Business name is required' });
  }

  const existingMembership = await TenantMembership.findOne({
    userId: req.user._id,
    role: 'owner'
  });

  if (existingMembership) {
    return res.status(400).json({ error: 'You already own a tenant account' });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await Tenant.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const tenant = await Tenant.create({
    name: name.trim(),
    slug,
    ownerUserId: req.user._id,
    trialStartsAt: now,
    trialEndsAt
  });

  await TenantMembership.create({
    userId: req.user._id,
    tenantId: tenant._id,
    role: 'owner',
    status: 'active'
  });

  res.status(201).json({ tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug } });
}

async function getMyTenant(req, res) {
  const membership = await TenantMembership.findOne({
    userId: req.user._id,
    role: 'owner',
    status: 'active'
  });

  if (!membership) {
    return res.status(404).json({ error: 'No tenant found' });
  }

  const tenant = await Tenant.findById(membership.tenantId);
  res.json({ tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug } });
}

module.exports = { createTenant, getMyTenant };