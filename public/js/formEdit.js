document.addEventListener('DOMContentLoaded', async () => {
  const formId = window.location.pathname.split('/').pop();

  const formTitle = document.getElementById('formTitle');
  const formLink = document.getElementById('formLink');
  const questionsList = document.getElementById('questionsList');
  const qType = document.getElementById('qType');
  const optionsGroup = document.getElementById('optionsGroup');
  const addBtn = document.getElementById('addQuestionBtn');
  const questionAlert = document.getElementById('questionAlert');

  const choiceTypes = ['single_choice', 'multiple_choice', 'dropdown'];

  qType.addEventListener('change', () => {
    optionsGroup.style.display = choiceTypes.includes(qType.value) ? 'block' : 'none';
  });

  async function loadForm() {
    const res = await fetch(`/api/forms/${formId}`, { credentials: 'same-origin' });
    if (res.status === 401) { window.location.href = '/login'; return; }
    if (!res.ok) { formTitle.textContent = 'Form not found'; return; }

    const data = await res.json();
    formTitle.textContent = data.form.name;
    formLink.textContent = `Public link (available once Priority F is built): /start-project/${data.form.slug}`;
  }

  async function loadQuestions() {
    const res = await fetch(`/api/forms/${formId}/questions`, { credentials: 'same-origin' });
    const data = await res.json();

    if (!data.questions.length) {
      questionsList.innerHTML = '<div class="empty-state">No questions yet. Add your first one below.</div>';
      return;
    }

    questionsList.innerHTML = data.questions.map(q => `
      <div class="card" style="margin-bottom: var(--space-sm); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${q.label}</strong>
          <div class="form-help">${q.type}${q.required ? ' · required' : ''}</div>
        </div>
        <button class="btn btn-secondary" data-id="${q._id}" data-action="delete">Delete</button>
      </div>
    `).join('');

    questionsList.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch(`/api/forms/${formId}/questions/${btn.dataset.id}`, {
          method: 'DELETE',
          credentials: 'same-origin'
        });
        loadQuestions();
      });
    });
  }

  addBtn.addEventListener('click', async () => {
    const label = document.getElementById('qLabel').value.trim();
    const type = qType.value;
    const required = document.getElementById('qRequired').checked;
    const optionsRaw = document.getElementById('qOptions').value;
    const options = optionsRaw.split('\n').map(o => o.trim()).filter(Boolean);

    if (!label) {
      questionAlert.innerHTML = '<div class="alert alert-error">Question text is required.</div>';
      return;
    }

    addBtn.disabled = true;
    const res = await fetch(`/api/forms/${formId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ type, label, required, options })
    });
    const data = await res.json();
    addBtn.disabled = false;

    if (!res.ok) {
      questionAlert.innerHTML = `<div class="alert alert-error">${data.error}</div>`;
      return;
    }

    document.getElementById('qLabel').value = '';
    document.getElementById('qOptions').value = '';
    document.getElementById('qRequired').checked = false;
    questionAlert.innerHTML = '';
    loadQuestions();
  });

  loadForm();
  loadQuestions();
});