function getAccessStatus(tenant) {
  const now = new Date();

  const periodEnd = tenant.currentPeriodEnd || tenant.trialEndsAt;
  const isTrial = !tenant.currentPeriodEnd;

  if (!periodEnd) {
    return { status: 'none', isTrial: false, endsAt: null, daysRemaining: 0, hasAccess: false };
  }

  const msRemaining = new Date(periodEnd).getTime() - now.getTime();
  const hasAccess = msRemaining > 0;
  const daysRemaining = hasAccess ? Math.ceil(msRemaining / (24 * 60 * 60 * 1000)) : 0;

  return {
    status: hasAccess ? (isTrial ? 'trial' : 'active') : 'expired',
    isTrial,
    endsAt: periodEnd,
    daysRemaining,
    hasAccess
  };
}

function computeExtendedPeriodEnd(tenant, durationDays) {
  const now = new Date();
  const currentEnd = tenant.currentPeriodEnd ? new Date(tenant.currentPeriodEnd) : null;

  // Extend from whichever is later: their current paid expiry, or now.
  // This is what makes "still active + buy more" ADD time instead of
  // resetting it, per the approved architecture.
  const base = currentEnd && currentEnd.getTime() > now.getTime() ? currentEnd : now;
  return new Date(base.getTime() + durationDays * 24 * 60 * 60 * 1000);
}

module.exports = { getAccessStatus, computeExtendedPeriodEnd };