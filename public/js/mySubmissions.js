document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('list');

  const res = await fetch('/api/my-submissions', { credentials: 'same-origin' });
  if (res.status === 401) { window.location.href = '/login'; return; }

  const data = await res.json();

  if (!data.submissions.length) {
    list.innerHTML = '<div class="empty-state">You haven\'t submitted any project requests yet.</div>';
    return;
  }

  list.innerHTML = data.submissions.map(s => `
    <a href="/my-submissions/${s.id}" class="card" style="display:block; margin-bottom: var(--space-md);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
        <div>
          <strong>${s.requestId}</strong>
          <div class="form-help">${s.formName} · ${s.businessName}</div>
        </div>
        <span style="color:var(--color-text-muted); font-size:0.85rem;">${s.status.replace('_', ' ')}</span>
      </div>
    </a>
  `).join('');
});