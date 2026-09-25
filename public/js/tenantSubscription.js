document.addEventListener('DOMContentLoaded', async () => {
  const statusCard = document.getElementById('statusCard');
  const packagesList = document.getElementById('packagesList');

  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference');

  if (reference) {
    statusCard.innerHTML = '<p>Verifying your payment...</p>';
    const verifyRes = await fetch(`/api/subscription/verify/${reference}`, { credentials: 'same-origin' });
    if (verifyRes.ok) {
      const verifyData = await verifyRes.json();
      showPaymentOutcome(verifyData.payment.status);
    }
    window.history.replaceState({}, '', '/tenant/subscription');
  }

  const statusRes = await fetch('/api/subscription/status', { credentials: 'same-origin' });
  if (statusRes.status === 401) { window.location.href = '/login'; return; }
  if (statusRes.status === 403) { window.location.href = '/tenant/create'; return; }

  const { access } = await statusRes.json();
  renderStatus(access);

  const pkgRes = await fetch('/api/subscription/packages', { credentials: 'same-origin' });
  const pkgData = await pkgRes.json();
  renderPackages(pkgData.packages);

  function showPaymentOutcome(status) {
    const messages = {
      successful: { type: 'success', text: 'Payment verified — your subscription has been activated.' },
      amount_mismatch: { type: 'error', text: 'Payment received, but the amount did not match. This is pending manual review.' },
      failed: { type: 'error', text: 'Payment was not successful.' },
      pending: { type: 'info', text: 'Payment is still processing.' }
    };
    const m = messages[status] || messages.pending;
    statusCard.innerHTML = `<div class="alert alert-${m.type}">${m.text}</div>`;
  }

  function renderStatus(access) {
    if (access.status === 'none') {
      statusCard.innerHTML = `<div class="alert alert-info">No active access yet.</div>`;
      return;
    }
    const label = access.status === 'trial' ? 'Free Trial' : access.status === 'active' ? 'Active Subscription' : 'Access Expired';
    const alertType = access.status === 'expired' ? 'error' : access.status === 'trial' ? 'info' : 'success';
    const dateStr = new Date(access.endsAt).toLocaleDateString();

    statusCard.innerHTML = `
      <div class="alert alert-${alertType}">
        <strong>${label}</strong><br>
        ${access.hasAccess
          ? `${access.daysRemaining} day${access.daysRemaining === 1 ? '' : 's'} remaining (expires ${dateStr})`
          : `Your access expired on ${dateStr}. Purchase a package below to continue creating forms and questions.`}
      </div>
    `;
  }

  function renderPackages(packages) {
    if (!packages.length) {
      packagesList.innerHTML = '<div class="empty-state">No packages available yet.</div>';
      return;
    }

    packagesList.innerHTML = packages.map(p => `
      <div class="card" style="margin-bottom: var(--space-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
        <div>
          <strong>${p.name}</strong>${p.isPromotional ? '<span class="tag-new">Promo</span>' : ''}
          <div class="form-help">${p.description || ''}</div>
          <div class="form-help">${p.currency} ${p.price} · ${p.durationDays} days</div>
        </div>
        <button class="btn btn-primary" data-package-id="${p._id}">Purchase</button>
      </div>
    `).join('');

    packagesList.querySelectorAll('button[data-package-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Redirecting...';
        const res = await fetch('/api/subscription/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ packageId: btn.dataset.packageId })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Could not start checkout.');
          btn.disabled = false;
          btn.textContent = 'Purchase';
          return;
        }
        window.location.href = data.authorizationUrl;
      });
    });
  }
});