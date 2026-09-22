document.addEventListener('DOMContentLoaded', async () => {
  const slot = document.getElementById('authNavSlot');
  if (!slot) return;

  try {
    const res = await fetch('/api/auth/me', { credentials: 'same-origin' });

    if (res.ok) {
      const user = await res.json();
      slot.innerHTML = `
        <span style="color: var(--color-text-muted); font-size: 0.9rem;">Hi, ${user.name}</span>
        <a href="#" id="logoutLink">Log Out</a>
      `;
      document.getElementById('logoutLink').addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch('/api/auth/logout', { credentials: 'same-origin' });
        window.location.href = '/';
      });
    } else {
      slot.innerHTML = `<a href="/login">Log In</a>`;
    }
  } catch (err) {
    slot.innerHTML = `<a href="/login">Log In</a>`;
  }
});