document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('submissionContent');
  const projectId = window.location.pathname.split('/').pop();

  const res = await fetch(`/api/projects/${projectId}`, { credentials: 'same-origin' });
  if (res.status === 401) { window.location.href = '/login'; return; }
  if (!res.ok) {
    content.innerHTML = '<div class="empty-state">Submission not found.</div>';
    return;
  }

  const data = await res.json();

  const clientHtml = data.client ? `
    <div class="card" style="margin-bottom: var(--space-lg);">
      <h3 style="margin-bottom: var(--space-sm);">Client</h3>
      <p><strong>${data.client.name}</strong></p>
      <p class="form-help">${data.client.email}</p>
    </div>
  ` : '';

  const answersHtml = data.answers.map(a => `
    <div class="card" style="margin-bottom: var(--space-sm);">
      <div class="form-help" style="margin-bottom:4px;">${a.label}</div>
      <div>${formatValue(a.value)}</div>
    </div>
  `).join('');

  content.innerHTML = `
    <h1>${data.project.requestId}</h1>
    <p style="color:var(--color-text-muted); margin: var(--space-xs) 0 var(--space-lg);">
      Submitted ${new Date(data.project.submittedAt).toLocaleString()} · Status: ${data.project.status.replace('_', ' ')}
    </p>
    ${clientHtml}
    ${answersHtml}
  `;

  function formatValue(v) {
    if (Array.isArray(v)) return v.length ? v.join(', ') : '<span style="color:var(--color-text-muted);">No answer</span>';
    if (v === null || v === undefined || v === '') return '<span style="color:var(--color-text-muted);">No answer</span>';
    return v;
  }

  // ---- Messages ----
  const threadSection = document.getElementById('messageThreadSection');
  const messagesList = document.getElementById('messagesList');
  threadSection.style.display = 'block';

  async function loadMessages() {
    const mRes = await fetch(`/api/projects/${projectId}/messages`, { credentials: 'same-origin' });
    const mData = await mRes.json();
    if (!mData.messages.length) {
      messagesList.innerHTML = '<div class="empty-state">No messages yet.</div>';
      return;
    }
    messagesList.innerHTML = mData.messages.map(m => `
      <div class="message-bubble ${m.senderRole === 'tenant' ? 'own' : ''}">
        <div class="form-help">${m.senderRole === 'tenant' ? 'You' : (data.client ? data.client.name : 'Client')}</div>
        <div>${m.body}</div>
      </div>
    `).join('');
  }

  document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = document.getElementById('messageBody').value.trim();
    const alertBox = document.getElementById('messageAlert');
    if (!body) return;

    const btn = document.getElementById('sendMessageBtn');
    btn.disabled = true;
    const sendRes = await fetch(`/api/projects/${projectId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ body })
    });
    btn.disabled = false;

    if (!sendRes.ok) {
      const err = await sendRes.json();
      alertBox.innerHTML = `<div class="alert alert-error">${err.error}</div>`;
      return;
    }
    document.getElementById('messageBody').value = '';
    alertBox.innerHTML = '';
    loadMessages();
  });

  loadMessages();
});