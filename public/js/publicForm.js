document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('formContent');
  const pathParts = window.location.pathname.split('/'); // ['', 'f', ':tenantSlug', ':formSlug']
  const tenantSlug = pathParts[2];
  const formSlug = pathParts[3];

  const res = await fetch(`/api/public-forms/${tenantSlug}/${formSlug}`);
  if (!res.ok) {
    content.innerHTML = '<div class="empty-state">This form could not be found.</div>';
    return;
  }

  const data = await res.json();
  document.getElementById('tenantName').textContent = data.tenant.name;
  document.title = `${data.form.name} — ${data.tenant.name}`;

  const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
  const isLoggedIn = meRes.ok;

  if (!isLoggedIn) {
    content.innerHTML = `
      <h1>${data.form.name}</h1>
      ${data.form.description ? `<p style="color:var(--color-text-muted); margin-top:var(--space-sm);">${data.form.description}</p>` : ''}
      <div class="card" style="margin-top:var(--space-lg);">
        <p style="margin-bottom:var(--space-md);">Please sign in with Google to fill out this form.</p>
        <a href="/api/auth/google?returnTo=${encodeURIComponent(window.location.pathname)}" class="btn btn-primary btn-block">Continue with Google</a>
      </div>
    `;
    return;
  }

  if (!data.questions.length) {
    content.innerHTML = `<h1>${data.form.name}</h1><div class="empty-state">This form has no questions yet.</div>`;
    return;
  }

  content.innerHTML = `
    <h1>${data.form.name}</h1>
    ${data.form.description ? `<p style="color:var(--color-text-muted); margin-top:var(--space-sm); margin-bottom:var(--space-lg);">${data.form.description}</p>` : ''}
    <form id="clientForm">
      <div id="questionsContainer"></div>
      <div id="submitAlert"></div>
      <button type="submit" class="btn btn-primary btn-block" id="submitBtn">Review & Submit</button>
    </form>
  `;

  const container = document.getElementById('questionsContainer');
  data.questions.forEach(q => {
    container.appendChild(renderQuestion(q));
  });

  document.getElementById('clientForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('submitAlert');

    const missing = data.questions.filter(q => q.required && !getValue(q));
    if (missing.length) {
      alertBox.innerHTML = `<div class="alert alert-error">Please complete all required fields.</div>`;
      return;
    }

    // Submission wiring (saving to a Project record) is the next step —
    // this confirms the form renders and validates correctly first.
    alertBox.innerHTML = `<div class="alert alert-info">Form is ready — submission will be connected next.</div>`;
  });

  function getValue(q) {
    const el = document.getElementById(`q_${q.id}`);
    if (!el) return null;
    if (q.type === 'multiple_choice') {
      return [...container.querySelectorAll(`input[name="q_${q.id}"]:checked`)].length > 0;
    }
    return el.value && el.value.trim();
  }

  function renderQuestion(q) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = `q_${q.id}`;
    label.textContent = q.label + (q.required ? ' *' : '');
    wrapper.appendChild(label);

    let field;

    switch (q.type) {
      case 'long_text':
        field = document.createElement('textarea');
        field.className = 'form-textarea';
        field.rows = 4;
        break;

      case 'dropdown':
        field = document.createElement('select');
        field.className = 'form-select';
        field.innerHTML = `<option value="">Select...</option>` +
          q.options.map(o => `<option value="${o}">${o}</option>`).join('');
        break;

      case 'yes_no':
        field = document.createElement('select');
        field.className = 'form-select';
        field.innerHTML = `<option value="">Select...</option><option value="yes">Yes</option><option value="no">No</option>`;
        break;

      case 'single_choice':
        field = document.createElement('div');
        field.innerHTML = q.options.map((o, i) => `
          <label style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:var(--space-xs); font-weight:400;">
            <input type="radio" name="q_${q.id}" value="${o}" ${i === 0 ? `id="q_${q.id}"` : ''}> ${o}
          </label>
        `).join('');
        break;

      case 'multiple_choice':
        field = document.createElement('div');
        field.innerHTML = q.options.map((o, i) => `
          <label style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:var(--space-xs); font-weight:400;">
            <input type="checkbox" name="q_${q.id}" value="${o}" ${i === 0 ? `id="q_${q.id}"` : ''}> ${o}
          </label>
        `).join('');
        break;

      case 'file_upload':
        field = document.createElement('input');
        field.type = 'file';
        field.className = 'form-input';
        break;

      default: {
        field = document.createElement('input');
        field.className = 'form-input';
        field.type = q.type === 'email' ? 'email' : q.type === 'number' ? 'number' : q.type === 'phone' ? 'tel' : 'text';
      }
    }

    if (field.tagName !== 'DIV') {
      field.id = `q_${q.id}`;
      if (q.placeholder) field.placeholder = q.placeholder;
    }
    wrapper.appendChild(field);

    if (q.helperText) {
      const help = document.createElement('p');
      help.className = 'form-help';
      help.textContent = q.helperText;
      wrapper.appendChild(help);
    }

    return wrapper;
  }
});