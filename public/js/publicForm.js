document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('formContent');
  const pathParts = window.location.pathname.split('/');
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
      <button type="submit" class="btn btn-primary btn-block" id="submitBtn">
        <span id="submitBtnText">Submit</span>
      </button>
    </form>
  `;

  const container = document.getElementById('questionsContainer');
  data.questions.forEach(q => container.appendChild(renderQuestion(q)));

  document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('submitAlert');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');

    const answers = data.questions
      .filter(q => q.type !== 'file_upload')
      .map(q => ({ questionId: q.id, value: getValue(q) }));

    const missing = data.questions.filter(q =>
      q.required && q.type !== 'file_upload' && isEmptyValue(getValue(q))
    );
    if (missing.length) {
      alertBox.innerHTML = `<div class="alert alert-error">Please complete all required fields.</div>`;
      return;
    }

    submitBtn.disabled = true;
    submitBtnText.innerHTML = '<span class="spinner"></span> Submitting...';
    alertBox.innerHTML = '';

    try {
      const submitRes = await fetch(`/api/public-forms/${tenantSlug}/${formSlug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ answers })
      });
      const result = await submitRes.json();

      if (!submitRes.ok) {
        alertBox.innerHTML = `<div class="alert alert-error">${result.error}</div>`;
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Submit';
        return;
      }

      content.innerHTML = `
        <div class="card" style="text-align:center;">
          <h1>Thank You</h1>
          <p style="color:var(--color-text-muted); margin: var(--space-md) 0;">
            Your project request has been submitted to ${data.tenant.name}.
          </p>
          <p class="form-help">Reference ID</p>
          <p style="font-weight:700; font-size:1.2rem; margin-top:var(--space-xs);">${result.requestId}</p>
        </div>
      `;
    } catch (err) {
      alertBox.innerHTML = `<div class="alert alert-error">Could not reach the server. Please try again.</div>`;
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Submit';
    }
  });

  function isEmptyValue(val) {
    return val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
  }

  function getValue(q) {
    if (q.type === 'single_choice' || q.type === 'yes_no') {
      const checked = container.querySelector(`input[name="q_${q.id}"]:checked`);
      if (checked) return checked.value;
      const select = document.getElementById(`q_${q.id}`);
      return select ? select.value : null;
    }
    if (q.type === 'multiple_choice') {
      return [...container.querySelectorAll(`input[name="q_${q.id}"]:checked`)].map(el => el.value);
    }
    const el = document.getElementById(`q_${q.id}`);
    return el ? el.value.trim() : null;
  }

  function renderQuestion(q) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = q.label + (q.required ? ' *' : '');
    wrapper.appendChild(label);

    let field;

    switch (q.type) {
      case 'long_text':
        field = document.createElement('textarea');
        field.className = 'form-textarea';
        field.rows = 4;
        field.id = `q_${q.id}`;
        break;

      case 'dropdown':
        field = document.createElement('select');
        field.className = 'form-select';
        field.id = `q_${q.id}`;
        field.innerHTML = `<option value="">Select...</option>` +
          q.options.map(o => `<option value="${o}">${o}</option>`).join('');
        break;

      case 'yes_no':
        field = document.createElement('div');
        field.innerHTML = `
          <label style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:var(--space-xs); font-weight:400;">
            <input type="radio" name="q_${q.id}" value="yes"> Yes
          </label>
          <label style="display:flex; align-items:center; gap:var(--space-sm); font-weight:400;">
            <input type="radio" name="q_${q.id}" value="no"> No
          </label>
        `;
        break;

      case 'single_choice':
        field = document.createElement('div');
        field.innerHTML = q.options.map(o => `
          <label style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:var(--space-xs); font-weight:400;">
            <input type="radio" name="q_${q.id}" value="${o}"> ${o}
          </label>
        `).join('');
        break;

      case 'multiple_choice':
        field = document.createElement('div');
        field.innerHTML = q.options.map(o => `
          <label style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:var(--space-xs); font-weight:400;">
            <input type="checkbox" name="q_${q.id}" value="${o}"> ${o}
          </label>
        `).join('');
        break;

      case 'file_upload':
        field = document.createElement('p');
        field.className = 'form-help';
        field.style.fontStyle = 'italic';
        field.textContent = 'File upload isn\'t available yet — this question will be skipped for now.';
        break;

      default: {
        field = document.createElement('input');
        field.className = 'form-input';
        field.id = `q_${q.id}`;
        field.type = q.type === 'email' ? 'email' : q.type === 'number' ? 'number' : q.type === 'phone' ? 'tel' : 'text';
        if (q.placeholder) field.placeholder = q.placeholder;
      }
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