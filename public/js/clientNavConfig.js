document.addEventListener('DOMContentLoaded', async () => {
  renderNav([
    { href: '/client/dashboard', label: 'Dashboard' },
    { href: '/my-submissions', label: 'My Submissions', id: 'submissionsLink' },
    { id: 'logoutLink', label: 'Log Out' }
  ], { logoutUrl: '/api/auth/logout', afterLogout: '/' });

  const badge = document.getElementById('unreadBadge');
  if (badge) {
    try {
      const res = await fetch('/api/my-notifications', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (data.unreadCount > 0) {
          badge.textContent = data.unreadCount;
          badge.style.display = 'inline-flex';
        }
      }
    } catch (err) { /* convenience only */ }
  }
});