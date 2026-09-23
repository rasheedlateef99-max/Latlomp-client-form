document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');
  const projectId = window.location.pathname.split('/').pop();

  const res = await fetch(`/api/my-submissions/${projectId}`, { credentials: 'same-origin' });
  if (res.status === 401) { window.location.href = '/login'; return; }
  if (!res.ok) {
    content.innerHTML = '<div class="empty-state">Submission not found.</div>';
    return;
  }

  const data = await res.json();

  const answersHtml = data.answers.map(a => `
    <div class="card" style="margin-bottom: var(--space-sm);">
      <div class="form-help" style="margin-bottom:4px;">${a.label}</div>
      <div>${formatValue(a.value)}</div>
    </div>
  `).join('');

  content.innerHTML = `
    <h1>${data.project.requestId}</h1>
    <p style="color:var(--color-text-muted); margin: var(--space-xs) 0 var(--space-lg);">
      Submitted to ${data.project.businessName} · ${data.project.formName} · Status: ${data.project.status.replace('_', ' ')}
    </p>
    ${answersHtml}
  `;

  function formatValue(v) {
    if (Array.isArray(v)) return v.length ? v.join(', ') : '<span style="color:var(--color-text-muted);">No answer</span>';
    if (v === null || v === undefined || v === '') return '<span style="color:var(--color-text-muted);">No answer</span>';
    return v;
  }
});