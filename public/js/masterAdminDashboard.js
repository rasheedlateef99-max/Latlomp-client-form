document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('dashboardContent');

  const statusRes = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
  const statusData = await statusRes.json();
  if (!statusData.isMasterAdmin) {
    window.location.href = '/master-admin/login';
    return;
  }

  const statsRes = await fetch('/api/master-admin/stats', { credentials: 'same-origin' });
  const stats = statsRes.ok
    ? await statsRes.json()
    : { totalTenants: '—', activeTenants: '—', suspendedTenants: '—' };

  content.innerHTML = `
    <h1>Platform Overview</h1>
    <p style="color: var(--color-text-muted); margin: var(--space-sm) 0 var(--space-lg);">LatLomp platform administration.</p>
    <div style="display:flex; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-lg);">
      <div class="card" style="flex:1; min-width:160px;">
        <div class="form-help">Total Businesses</div>
        <div style="font-size:1.8rem; font-weight:700;">${stats.totalTenants}</div>
      </div>
      <div class="card" style="flex:1; min-width:160px;">
        <div class="form-help">Active</div>
        <div style="font-size:1.8rem; font-weight:700; color: var(--color-success);">${stats.activeTenants}</div>
      </div>
      <div class="card" style="flex:1; min-width:160px;">
        <div class="form-help">Suspended</div>
        <div style="font-size:1.8rem; font-weight:700; color: var(--color-error);">${stats.suspendedTenants}</div>
      </div>
    </div>
    <a href="/master-admin/businesses" class="card" style="max-width:320px;">
      <h3>Businesses</h3>
      <p class="form-help">View and manage registered businesses.</p>
    </a>
  `;
});