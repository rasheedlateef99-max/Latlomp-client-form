const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const SubscriptionPackage = require('../models/SubscriptionPackage');
const AuditLog = require('../models/AuditLog');
const paystackService = require('./payments/paystackService');
const { computeExtendedPeriodEnd } = require('./subscriptionService');

async function processPaystackReference(reference) {
  const existing = await Payment.findOne({ reference });
  if (!existing) return null;

  if (existing.status !== 'pending') {
    // Already resolved by the webhook or a prior verify call — idempotent no-op.
    return existing;
  }

  const verification = await paystackService.verifyTransaction(reference);

  const paystackSucceeded = verification.status === 'success';
  const amountMatches = paystackSucceeded &&
    verification.amount === existing.amountExpected &&
    verification.currency === existing.currency;

  const newStatus = !paystackSucceeded ? 'failed' : (amountMatches ? 'successful' : 'amount_mismatch');

  // Atomic guard: only the first caller to see status "pending" applies the
  // transition. If the webhook and the browser's return-check race each
  // other, the loser just re-reads what the winner already recorded.
  const updated = await Payment.findOneAndUpdate(
    { reference, status: 'pending' },
    { status: newStatus, amountPaid: verification.amount },
    { new: true }
  );

  if (!updated) {
    return Payment.findOne({ reference });
  }

  if (newStatus === 'successful') {
    const tenant = await Tenant.findById(updated.tenantId);
    const pkg = await SubscriptionPackage.findById(updated.packageId);

    if (tenant && pkg) {
      tenant.currentPeriodEnd = computeExtendedPeriodEnd(tenant, pkg.durationDays);
      await tenant.save();

      updated.subscriptionApplied = true;
      await updated.save();

      await AuditLog.create({
        actorType: 'system',
        actorLabel: 'Paystack',
        action: 'subscription_activated',
        targetType: 'Tenant',
        targetId: tenant._id,
        metadata: { reference, packageId: pkg._id, newPeriodEnd: tenant.currentPeriodEnd }
      });
    }
  }

  return updated;
}

module.exports = { processPaystackReference };