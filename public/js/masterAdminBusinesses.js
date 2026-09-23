document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('businessesList');

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) { window.location.href = '/master-admin/login'; return; }

  await loadTenants();

  async function loadTenants() {
    const res = await fetch('/api/master-admin/tenants', { credentials: 'same-origin' });
    const data = await res.json();

    if (!data.tenants.length) {
      list.innerHTML = '<div class="empty-state">No businesses registered yet.</div>';
      return;
    }

    list.innerHTML = data.tenants.map(t => `
      <div class="card" style="margin-bottom: var(--space-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
        <div>
          <strong>${t.name}</strong>
          <div class="form-help">/${t.slug} · ${t.accountStatus}</div>
        </div>
        ${t.accountStatus === 'active'
          ? `<button class="btn btn-secondary" data-id="${t.id}" data-status="suspended">Suspend</button>`
          : `<button class="btn btn-secondary" data-id="${t.id}" data-status="active">Activate</button>`}
      </div>
    `).join('');

    list.querySelectorAll('button[data-status]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        await fetch(`/api/master-admin/tenants/${btn.dataset.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ status: btn.dataset.status })
        });
        loadTenants();
      });
    });
  }
});