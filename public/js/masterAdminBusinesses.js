document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('businessesList');

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) { window.location.href = '/master-admin/login'; return; }

  const res = await fetch('/api/master-admin/tenants', { credentials: 'same-origin' });
  const data = await res.json();

  if (!data.tenants.length) {
    list.innerHTML = '<div class="empty-state">No businesses registered yet.</div>';
    return;
  }

  list.innerHTML = data.tenants.map(t => `
    <a href="/master-admin/businesses/${t.id}" class="card" style="display:block; margin-bottom: var(--space-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
        <div>
          <strong>${t.name}</strong>
          <div class="form-help">/${t.slug}</div>
        </div>
        <span class="tag-new" style="background:var(--color-info-bg); color:var(--color-info);">${t.accountStatus}</span>
      </div>
    </a>
  `).join('');
});