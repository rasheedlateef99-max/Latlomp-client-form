document.addEventListener('DOMContentLoaded', async () => {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout', { credentials: 'same-origin' });
      window.location.href = '/';
    });
  }

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
      // Badge is a convenience — fail silently
    }
  }
});