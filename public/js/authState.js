document.addEventListener('DOMContentLoaded', async () => {
  const slot = document.getElementById('authNavSlot');
  if (!slot) return;

  try {
    const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });

    if (!meRes.ok) {
      slot.innerHTML = `<a href="/login" class="btn btn-primary">Log In</a>`;
      return;
    }

    const user = await meRes.json();
    const tenantRes = await fetch('/api/tenants/me', { credentials: 'same-origin' });

    let middleLink;
    if (tenantRes.ok) {
      middleLink = `<a href="/tenant/dashboard">My Business</a>`;
    } else {
      middleLink = `<a href="/tenant/create">Set Up Your Business</a>`;
    }

    slot.innerHTML = `
      <span style="color: var(--color-text-muted); font-size: 0.9rem;">Hi, ${user.name}</span>
      ${middleLink}
      <a href="/my-submissions">My Submissions</a>
      <a href="#" id="logoutLink">Log Out</a>
    `;
    document.getElementById('logoutLink').addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout', { credentials: 'same-origin' });
      window.location.href = '/';
    });
  } catch (err) {
    slot.innerHTML = `<a href="/login" class="btn btn-primary">Log In</a>`;
  }
});s