document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('submissionsList');

  const res = await fetch('/api/projects', { credentials: 'same-origin' });
  if (res.status === 401) { window.location.href = '/login'; return; }
  if (res.status === 403) { window.location.href = '/tenant/create'; return; }

  const data = await res.json();

  if (!data.projects.length) {
    list.innerHTML = '<div class="empty-state">No submissions yet. Share your form link with a client to get started.</div>';
    return;
  }

  list.innerHTML = data.projects.map(p => `
    <a href="/tenant/submissions/${p.id}" class="card" style="display:block; margin-bottom: var(--space-md);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${p.requestId}</strong>${p.isNew ? '<span class="tag-new">New</span>' : ''}
          <div class="form-help">${p.formName}</div>
        </div>
        <span style="color:var(--color-text-muted); font-size:0.85rem;">${p.status.replace('_', ' ')}</span>
      </div>
    </a>
  `).join('');
});