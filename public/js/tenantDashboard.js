document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('dashboardContent');

  const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (!meRes.ok) { window.location.href = '/login'; return; }

  const tenantRes = await fetch('/api/tenants/me', { credentials: 'same-origin' });
  if (!tenantRes.ok) { window.location.href = '/tenant/create'; return; }

  const data = await tenantRes.json();

  content.innerHTML = `
    <h1>${data.tenant.name}</h1>
    <p style="color: var(--color-text-muted); margin: var(--space-sm) 0 var(--space-lg);">Your business workspace.</p>
    <div style="display:flex; gap: var(--space-md); flex-wrap: wrap;">
      <div class="card" style="max-width: 420px; flex:1; min-width:260px;">
        <h3 style="margin-bottom: var(--space-xs);">Forms</h3>
        <p class="form-help" style="margin-bottom: var(--space-md);">Create and manage the project forms you send to your clients.</p>
        <a href="/tenant/forms" class="btn btn-primary">Manage Forms</a>
      </div>
      <div class="card" style="max-width: 420px; flex:1; min-width:260px;">
        <h3 style="margin-bottom: var(--space-xs);">Submissions</h3>
        <p class="form-help" style="margin-bottom: var(--space-md);">Review project requests your clients have submitted.</p>
        <a href="/tenant/submissions" class="btn btn-primary">View Submissions</a>
      </div>
    </div>
  `;
});