document.addEventListener('DOMContentLoaded', () => {
  renderNav([
    { href: '/master-admin/dashboard', label: 'Dashboard' },
    { href: '/master-admin/businesses', label: 'Businesses' },
        { href: '/master-admin/packages', label: 'Packages' },
            { href: '/master-admin/payments', label: 'Payments' },
    { id: 'logoutLink', label: 'Log Out' }
  ], {
    logoutUrl: '/api/master-admin/auth/logout',
    afterLogout: '/master-admin/login'
  });
});