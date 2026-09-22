document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('dashboardContent');
  const logoutBtn = document.getElementById('logoutBtn');

  try {
    const res = await fetch('/api/master-admin/auth/status', { credentials: 'same-origin' });
    const data = await res.json();

    if (!data.isMasterAdmin) {
      window.location.href = '/master-admin/login';
      return;
    }

    content.classList.remove('empty-state');
    content.innerHTML = '<h1>Welcome, Master Admin</h1><p style="color: var(--color-text-muted); margin-top: var(--space-sm);">Tenant management and platform settings will appear here in a later phase.</p>';
  } catch (err) {
    content.innerHTML = '<div class="alert alert-error">Could not verify authentication. Please refresh.</div>';
  }

  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/master-admin/auth/logout', { credentials: 'same-origin' });
    window.location.href = '/master-admin/login';
  });
});