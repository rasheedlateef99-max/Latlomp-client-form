document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('packagesList');

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) { window.location.href = '/master-admin/login'; return; }

  async function loadPackages() {
    const res = await fetch('/api/master-admin/packages', { credentials: 'same-origin' });
    const data = await res.json();

    if (!data.packages.length) {
      list.innerHTML = '<div class="empty-state">No packages yet. Create one above.</div>';
      return;
    }

    list.innerHTML = data.packages.map(p => `
      <div class="card" style="margin-bottom: var(--space-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
        <div>
          <strong>${p.name}</strong>${p.isPromotional ? '<span class="tag-new">Promo</span>' : ''}
          <div class="form-help">${p.currency} ${p.price} · ${p.durationDays} days · ${p.isActive ? 'Active' : 'Inactive'}</div>
        </div>
        <button class="btn btn-secondary" data-id="${p._id}" data-active="${p.isActive}">
          ${p.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    `).join('');

    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const newActive = btn.dataset.active !== 'true';
        await fetch(`/api/master-admin/packages/${btn.dataset.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ isActive: newActive })
        });
        loadPackages();
      });
    });
  }

  document.getElementById('createPkgBtn').addEventListener('click', async () => {
    const name = document.getElementById('pkgName').value.trim();
    const description = document.getElementById('pkgDescription').value.trim();
    const price = parseFloat(document.getElementById('pkgPrice').value);
    const currency = document.getElementById('pkgCurrency').value.trim() || 'NGN';
    const durationDays = parseInt(document.getElementById('pkgDuration').value, 10);
    const isPromotional = document.getElementById('pkgPromo').checked;
    const alertBox = document.getElementById('createAlert');

    if (!name || !price || !durationDays) {
      alertBox.innerHTML = '<div class="alert alert-error">Name, price, and duration are required.</div>';
      return;
    }

    const res = await fetch('/api/master-admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ name, description, price, currency, durationDays, isPromotional })
    });

    if (!res.ok) {
      const err = await res.json();
      alertBox.innerHTML = `<div class="alert alert-error">${err.error}</div>`;
      return;
    }

    document.getElementById('pkgName').value = '';
    document.getElementById('pkgDescription').value = '';
    document.getElementById('pkgPrice').value = '';
    document.getElementById('pkgDuration').value = '';
    document.getElementById('pkgPromo').checked = false;
    alertBox.innerHTML = '';
    loadPackages();
  });

  loadPackages();
});