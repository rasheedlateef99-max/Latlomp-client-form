document.addEventListener('DOMContentLoaded', async () => {
  const alertBox = document.getElementById('loginAlert');

  const params = new URLSearchParams(window.location.search);
  if (params.get('error')) {
    alertBox.innerHTML = '<div class="alert alert-error">Google sign-in failed. Please try again.</div>';
  }

  try {
    const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (res.ok) {
      window.location.href = '/';
    }
  } catch (err) {
    // Silently ignore — if the check fails, just show the login page normally
  }
});