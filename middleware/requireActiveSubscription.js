const { getAccessStatus } = require('../services/subscriptionService');

function requireActiveSubscription(req, res, next) {
  const access = getAccessStatus(req.tenant);
  if (!access.hasAccess) {
    return res.status(402).json({
      error: 'Your access has expired. Please purchase a package to continue.',
      code: 'SUBSCRIPTION_EXPIRED'
    });
  }
  next();
}

module.exports = requireActiveSubscription;