const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const SubscriptionPackage = require('../models/SubscriptionPackage');
const AuditLog = require('../models/AuditLog');
const { computeExtendedPeriodEnd } = require('../services/subscriptionService');

async function listPayments(req, res) {
  const payments = await Payment.find().sort({ createdAt: -1 });

  const tenantIds = [...new Set(payments.map(p => p.tenantId.toString()))];
  const packageIds = [...new Set(payments.map(p => p.packageId.toString()))];
  const tenants = await Tenant.find({ _id: { $in: tenantIds } });
  const packages = await SubscriptionPackage.find({ _id: { $in: packageIds } });
  const tenantMap = {}; tenants.forEach(t => { tenantMap[t._id.toString()] = t.name; });
  const packageMap = {}; packages.forEach(p => { packageMap[p._id.toString()] = p.name; });

  res.json({
    payments: payments.map(p => ({
      id: p._id,
      reference: p.reference,
      businessName: tenantMap[p.tenantId.toString()] || 'Unknown',
      packageName: packageMap[p.packageId.toString()] || 'Unknown',
      amountExpected: p.amountExpected,
      amountPaid: p.amountPaid,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt
    }))
  });
}

async function approvePayment(req, res) {
  const { notes } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.paymentId, status: { $in: ['amount_mismatch', 'failed'] } },
    {
      status: 'manually_approved',
      reviewedByLabel: 'Master Admin',
      reviewedAt: new Date(),
      reviewNotes: notes || undefined
    },
    { new: true }
  );

  if (!payment) {
    return res.status(400).json({ error: 'Payment not found or already resolved' });
  }

  const tenant = await Tenant.findById(payment.tenantId);
  const pkg = await SubscriptionPackage.findById(payment.packageId);

  if (tenant && pkg) {
    tenant.currentPeriodEnd = computeExtendedPeriodEnd(tenant, pkg.durationDays);
    await tenant.save();

    payment.subscriptionApplied = true;
    await payment.save();

    await AuditLog.create({
      actorType: 'master_admin',
      actorLabel: 'Master Admin',
      action: 'payment_manually_approved',
      targetType: 'Payment',
      targetId: payment._id,
      metadata: { reference: payment.reference, newPeriodEnd: tenant.currentPeriodEnd }
    });
  }

  res.json({ payment });
}

async function rejectPayment(req, res) {
  const { notes } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.paymentId, status: { $in: ['amount_mismatch', 'failed'] } },
    {
      status: 'manually_rejected',
      reviewedByLabel: 'Master Admin',
      reviewedAt: new Date(),
      reviewNotes: notes || undefined
    },
    { new: true }
  );

  if (!payment) {
    return res.status(400).json({ error: 'Payment not found or already resolved' });
  }

  await AuditLog.create({
    actorType: 'master_admin',
    actorLabel: 'Master Admin',
    action: 'payment_manually_rejected',
    targetType: 'Payment',
    targetId: payment._id,
    metadata: { reference: payment.reference }
  });

  res.json({ payment });
}

module.exports = { listPayments, approvePayment, rejectPayment };