document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');
  const tenantId = window.location.pathname.split('/').pop();

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) { window.location.href = '/master-admin/login'; return; }

  await load();

  async function load() {
    const res = await fetch(`/api/master-admin/tenants/${tenantId}`, { credentials: 'same-origin' });
    if (!res.ok) { content.innerHTML = '<div class="empty-state">Business not found.</div>'; return; }
    const data = await res.json();
    render(data);
  }

  function render(data) {
    const { tenant, owner, stats } = data;

    const actions = [];
    if (tenant.accountStatus !== 'active') actions.push(`<button class="btn btn-primary" data-status="active">Activate</button>`);
    if (tenant.accountStatus !== 'suspended') actions.push(`<button class="btn btn-secondary" data-status="suspended">Suspend</button>`);
    if (tenant.accountStatus !== 'archived') actions.push(`<button class="btn btn-secondary" data-status="archived">Archive</button>`);

    content.innerHTML = `
      <h1>${tenant.name}</h1>
      <p style="color:var(--color-text-muted); margin:var(--space-xs) 0 var(--space-lg);">
        /${tenant.slug} · Status: <strong>${tenant.accountStatus}</strong>
      </p>

      <div class="card" style="margin-bottom: var(--space-md);">
        <h3 style="margin-bottom: var(--space-sm);">Owner</h3>
        ${owner ? `<p>${owner.name}</p><p class="form-help">${owner.email}</p>` : '<p class="form-help">Owner not found</p>'}
      </div>

      <div style="display:flex; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-md);">
        <div class="card" style="flex:1; min-width:140px;">
          <div class="form-help">Registered</div>
          <div style="font-weight:700;">${new Date(tenant.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="card" style="flex:1; min-width:140px;">
          <div class="form-help">Forms</div>
          <div style="font-weight:700;">${stats.formCount}</div>
        </div>
        <div class="card" style="flex:1; min-width:140px;">
          <div class="form-help">Submissions</div>
          <div style="font-weight:700;">${stats.projectCount}</div>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: var(--space-md);">Manage Status</h3>
        <div id="alertBox"></div>
        <div style="display:flex; gap: var(--space-sm); flex-wrap: wrap;">${actions.join('')}</div>
      </div>
    `;

    content.querySelectorAll('button[data-status]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const res = await fetch(`/api/master-admin/tenants/${tenantId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ status: btn.dataset.status })
        });
        if (!res.ok) {
          document.getElementById('alertBox').innerHTML = '<div class="alert alert-error">Could not update status.</div>';
          btn.disabled = false;
          return;
        }
        load();
      });
    });
  }
});