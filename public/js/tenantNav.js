document.addEventListener('DOMContentLoaded', async () => {
  renderNav([
    { href: '/tenant/dashboard', label: 'My Business' },
    { href: '/tenant/forms', label: 'Manage Forms' },
    { href: '/tenant/submissions', label: 'Submissions', id: 'submissionsLink' },
        { href: '/tenant/subscription', label: 'Subscription' },
    { id: 'logoutLink', label: 'Log Out' }
  ], {
    logoutUrl: '/api/auth/logout',
    afterLogout: '/'
  });

  const badge = document.getElementById('unreadBadge');
  if (badge) {
    try {
      const res = await fetch('/api/notifications', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (data.unreadCount > 0) {
          badge.textContent = data.unreadCount;
          badge.style.display = 'inline-flex';
        }
      }
    } catch (err) {
      // convenience only — fail silently
    }
  }
});