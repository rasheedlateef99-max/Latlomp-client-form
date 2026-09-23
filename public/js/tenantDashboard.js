document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('dashboardContent');

  const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (!meRes.ok) { window.location.href = '/login'; return; }

  const tenantRes = await fetch('/api/tenants/me', { credentials: 'same-origin' });
  if (!tenantRes.ok) { window.location.href = '/tenant/create'; return; }

  const data = await tenantRes.json();

  content.innerHTML = `
    <h1>Welcome, ${data.tenant.name}</h1>
    <p style="color: var(--color-text-muted); margin: var(--space-sm) 0 var(--space-lg);">Here's your workspace.</p>
    <a href="/tenant/forms" class="card" style="max-width:320px;">
      <h3>Manage Forms</h3>
      <p class="form-help">Create and edit your client project forms.</p>
    </a>
  `;
});