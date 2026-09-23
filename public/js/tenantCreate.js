document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');

  const meRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (!meRes.ok) {
    window.location.href = '/login';
    return;
  }

  const existing = await fetch('/api/tenants/me', { credentials: 'same-origin' });
  if (existing.ok) {
    const data = await existing.json();
    content.innerHTML = `
      <h1>You're all set</h1>
      <p class="subtitle">Business: <strong>${data.tenant.name}</strong></p>
      <a href="/tenant/dashboard" class="btn btn-primary btn-block" style="margin-top: var(--space-md);">Go to Dashboard</a>
    `;
    return;
  }

  content.innerHTML = `
    <h1>Set Up Your Business</h1>
    <p class="subtitle">This is the name your clients will see.</p>
    <div id="formAlert"></div>
    <form id="tenantForm">
      <div class="form-group">
        <label class="form-label" for="name">Business Name</label>
        <input class="form-input" type="text" id="name" name="name" required>
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="submitBtn">
        <span id="submitBtnText">Create Business</span>
      </button>
    </form>
  `;

  const form = document.getElementById('tenantForm');
  const alertBox = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    submitBtn.disabled = true;
    submitBtnText.innerHTML = '<span class="spinner"></span> Creating...';

    const name = document.getElementById('name').value.trim();

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name })
      });
      const data = await res.json();

      if (!res.ok) {
        alertBox.innerHTML = `<div class="alert alert-error">${data.error}</div>`;
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Create Business';
        return;
      }

      window.location.reload();
    } catch (err) {
      alertBox.innerHTML = '<div class="alert alert-error">Could not reach the server. Please try again.</div>';
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Create Business';
    }
  });
});