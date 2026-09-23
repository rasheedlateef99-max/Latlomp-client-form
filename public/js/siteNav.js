function renderNav(navLinks, options = {}) {
  const container = document.getElementById('navLinks');
  if (!container) return;

  container.innerHTML = navLinks.map(link => {
    if (link.id === 'logoutLink') {
      return `<a href="#" id="logoutLink">${link.label}</a>`;
    }
    const badgeHtml = link.id === 'submissionsLink' ? '<span id="unreadBadge" class="badge"></span>' : '';
    return `<a href="${link.href}">${link.label}${badgeHtml}</a>`;
  }).join('');

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch(options.logoutUrl || '/api/auth/logout', { credentials: 'same-origin' });
      window.location.href = options.afterLogout || '/';
    });
  }
}