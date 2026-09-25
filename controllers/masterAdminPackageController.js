const SubscriptionPackage = require('../models/SubscriptionPackage');
const AuditLog = require('../models/AuditLog');

async function listPackages(req, res) {
  const packages = await SubscriptionPackage.find().sort({ price: 1 });
  res.json({ packages });
}

async function createPackage(req, res) {
  const { name, description, price, currency, durationDays, isPromotional } = req.body;

  if (!name || !name.trim() || !price || !durationDays) {
    return res.status(400).json({ error: 'Name, price, and duration are required' });
  }

  const pkg = await SubscriptionPackage.create({
    name: name.trim(),
    description: description ? description.trim() : undefined,
    price,
    currency: currency || 'NGN',
    durationDays,
    isPromotional: !!isPromotional
  });

  await AuditLog.create({
    actorType: 'master_admin',
    actorLabel: 'Master Admin',
    action: 'package_created',
    targetType: 'SubscriptionPackage',
    targetId: pkg._id,
    metadata: { name: pkg.name, price: pkg.price, durationDays: pkg.durationDays }
  });

  res.status(201).json({ package: pkg });
}

async function updatePackage(req, res) {
  const pkg = await SubscriptionPackage.findById(req.params.packageId);
  if (!pkg) return res.status(404).json({ error: 'Package not found' });

  const { name, description, price, currency, durationDays, isActive, isPromotional } = req.body;
  if (name !== undefined) pkg.name = name.trim();
  if (description !== undefined) pkg.description = description.trim();
  if (price !== undefined) pkg.price = price;
  if (currency !== undefined) pkg.currency = currency;
  if (durationDays !== undefined) pkg.durationDays = durationDays;
  if (isActive !== undefined) pkg.isActive = !!isActive;
  if (isPromotional !== undefined) pkg.isPromotional = !!isPromotional;

  await pkg.save();

  await AuditLog.create({
    actorType: 'master_admin',
    actorLabel: 'Master Admin',
    action: 'package_updated',
    targetType: 'SubscriptionPackage',
    targetId: pkg._id,
    metadata: req.body
  });

  res.json({ package: pkg });
}

module.exports = { listPackages, createPackage, updatePackage };