document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout', { credentials: 'same-origin' });
      window.location.href = '/';
    });
  }
});