document.addEventListener('DOMContentLoaded', async () => {
  const formsList = document.getElementById('formsList');
  const createBtn = document.getElementById('createFormBtn');
  const nameInput = document.getElementById('formName');
  const createAlert = document.getElementById('createAlert');

  async function loadForms() {
    const res = await fetch('/api/forms', { credentials: 'same-origin' });
    if (res.status === 401) { window.location.href = '/login'; return; }
    if (res.status === 403) { window.location.href = '/tenant/create'; return; }

    const data = await res.json();
    if (!data.forms.length) {
      formsList.innerHTML = '<div class="empty-state">No forms yet. Create your first one above.</div>';
      return;
    }

    formsList.innerHTML = data.forms.map(f => `
      <a href="/tenant/forms/${f._id}" class="card" style="display:block; margin-bottom: var(--space-md); text-decoration:none; color: var(--color-text);">
        <h3>${f.name}</h3>
        <p class="form-help">${f.description || 'No description'}</p>
      </a>
    `).join('');
  }

  createBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    createBtn.disabled = true;
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    createBtn.disabled = false;

    if (!res.ok) {
      createAlert.innerHTML = `<div class="alert alert-error">${data.error}</div>`;
      return;
    }

    nameInput.value = '';
    createAlert.innerHTML = '';
    loadForms();
  });

  loadForms();
});