const crypto = require('crypto');
const SubscriptionPackage = require('../models/SubscriptionPackage');
const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const paystackService = require('../services/payments/paystackService');
const { processPaystackReference } = require('../services/paymentProcessingService');
const { getAccessStatus } = require('../services/subscriptionService');

function toSubunit(amount, currency) {
  if (currency === 'NGN') return Math.round(amount * 100);
  throw new Error(`Unsupported currency for checkout: ${currency}`);
}

async function getStatus(req, res) {
  const access = getAccessStatus(req.tenant);
  res.json({ access });
}

async function listActivePackages(req, res) {
  const packages = await SubscriptionPackage.find({ isActive: true }).sort({ price: 1 });
  res.json({ packages });
}

async function initiateCheckout(req, res) {
  const { packageId } = req.body;
  const pkg = await SubscriptionPackage.findOne({ _id: packageId, isActive: true });
  if (!pkg) return res.status(404).json({ error: 'Package not found or unavailable' });

  let amountSubunit;
  try {
    amountSubunit = toSubunit(pkg.price, pkg.currency);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const reference = `LLP-${req.tenant.slug}-${crypto.randomBytes(6).toString('hex')}`;

  await Payment.create({
    tenantId: req.tenant._id,
    packageId: pkg._id,
    reference,
    amountExpected: amountSubunit,
    currency: pkg.currency,
    status: 'pending'
  });

  const callbackUrl = `${process.env.CLIENT_URL}/tenant/subscription?reference=${reference}`;

  try {
    const result = await paystackService.initializeTransaction({
      email: req.user.email,
      amountSubunit,
      reference,
      callbackUrl,
      metadata: { tenantId: req.tenant._id.toString(), packageId: pkg._id.toString() }
    });
    res.json({ authorizationUrl: result.authorization_url });
  } catch (err) {
    res.status(502).json({ error: 'Could not start checkout. Please try again.' });
  }
}

async function verifyReturn(req, res) {
  const { reference } = req.params;
  const payment = await Payment.findOne({ reference });

  if (!payment || payment.tenantId.toString() !== req.tenant._id.toString()) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  const updated = await processPaystackReference(reference);
  const freshTenant = await Tenant.findById(req.tenant._id);
  const access = getAccessStatus(freshTenant);

  res.json({ payment: { status: updated.status }, access });
}

module.exports = { getStatus, listActivePackages, initiateCheckout, verifyReturn };