document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('dashboardContent');

  const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (!meRes.ok) { window.location.href = '/login'; return; }

  const res = await fetch('/api/my-submissions', { credentials: 'same-origin' });
  const data = await res.json();

  if (!data.submissions.length) {
    content.innerHTML = `
      <h1>Welcome</h1>
      <div class="empty-state">You don't have any submissions yet. Use the project link a business sent you to get started.</div>
    `;
    return;
  }

  const recent = data.submissions.slice(0, 3);
  content.innerHTML = `
    <h1>Welcome</h1>
    <p style="color:var(--color-text-muted); margin: var(--space-sm) 0 var(--space-lg);">Here's a summary of your activity.</p>
    <h3 style="margin-bottom:var(--space-sm);">Recent Submissions</h3>
    ${recent.map(s => `
      <a href="/my-submissions/${s.id}" class="card" style="display:block; margin-bottom:var(--space-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
          <div>
            <strong>${s.requestId}</strong>${s.isNew ? '<span class="tag-new">New</span>' : ''}
            <div class="form-help">${s.formName} · ${s.businessName}</div>
          </div>
          <span style="color:var(--color-text-muted); font-size:0.85rem;">${s.status.replace('_',' ')}</span>
        </div>
      </a>
    `).join('')}
    <a href="/my-submissions" class="btn btn-secondary" style="margin-top:var(--space-sm);">View All Submissions</a>
  `;
});