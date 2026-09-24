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
    let link;
    if (tenantRes.ok) {
      link = `<a href="/tenant/dashboard">My Business</a>`;
    } else {
      const subsRes = await fetch('/api/my-submissions', { credentials: 'same-origin' });
      const subsData = subsRes.ok ? await subsRes.json() : { submissions: [] };
      link = subsData.submissions.length > 0
        ? `<a href="/client/dashboard">My Dashboard</a>`
        : `<a href="/tenant/create">Set Up Your Business</a>`;
    }

    slot.innerHTML = `
      <span style="color: var(--color-text-muted); font-size: 0.9rem;">Hi, ${user.name}</span>
      ${link}
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
});