document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const alertBox = document.getElementById('loginAlert');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnText = document.getElementById('loginBtnText');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.textContent = isHidden ? 'Hide' : 'Show';
  });

  function showAlert(message, type) {
    alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  function clearAlert() {
    alertBox.innerHTML = '';
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtnText.innerHTML = isLoading
      ? '<span class="spinner"></span> Logging in...'
      : 'Log In';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();
    setLoading(true);

    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value;

    try {
      const res = await fetch('/api/master-admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.error || 'Login failed.', 'error');
        setLoading(false);
        return;
      }

      window.location.href = '/master-admin/dashboard';
    } catch (err) {
      showAlert('Could not reach the server. Please try again.', 'error');
      setLoading(false);
    }
  });
});