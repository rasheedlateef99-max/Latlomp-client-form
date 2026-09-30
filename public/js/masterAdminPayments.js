document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('paymentsList');

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) { window.location.href = '/master-admin/login'; return; }

  const statusColors = {
    pending: 'var(--color-info)',
    successful: 'var(--color-success)',
    amount_mismatch: 'var(--color-error)',
    failed: 'var(--color-error)',
    reversed: 'var(--color-error)',
    manually_approved: 'var(--color-success)',
    manually_rejected: 'var(--color-text-muted)'
  };

  async function loadPayments() {
    const res = await fetch('/api/master-admin/payments', { credentials: 'same-origin' });
    const data = await res.json();

    if (!data.payments.length) {
      list.innerHTML = '<div class="empty-state">No payments yet.</div>';
      return;
    }

    list.innerHTML = data.payments.map(p => `
      <div class="card" style="margin-bottom: var(--space-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:var(--space-sm);">
          <div>
            <strong>${p.businessName}</strong> · ${p.packageName}
            <div class="form-help">${p.reference}</div>
            <div class="form-help">Expected: ${p.currency} ${(p.amountExpected / 100).toFixed(2)} · Paid: ${p.amountPaid !== undefined && p.amountPaid !== null ? (p.amountPaid / 100).toFixed(2) : '—'}</div>
            <div class="form-help">${new Date(p.createdAt).toLocaleString()}</div>
          </div>
          <span style="color:${statusColors[p.status] || 'var(--color-text-muted)'}; font-weight:700; font-size:0.85rem;">${p.status.replace('_', ' ')}</span>
        </div>
        ${['amount_mismatch', 'failed'].includes(p.status) ? `
          <div style="margin-top: var(--space-md); display:flex; gap: var(--space-sm);">
            <button class="btn btn-primary" data-id="${p.id}" data-action="approve">Approve</button>
            <button class="btn btn-secondary" data-id="${p.id}" data-action="reject">Reject</button>
          </div>
        ` : ''}
      </div>
    `).join('');

    list.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        await fetch(`/api/master-admin/payments/${btn.dataset.id}/${btn.dataset.action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({})
        });
        loadPayments();
      });
    });
  }

  loadPayments();
});