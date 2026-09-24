const TenantMembership = require('../models/TenantMembership');
const Project = require('../models/Project');

async function googleCallback(req, res) {
  const returnTo = req.session.returnTo;
  delete req.session.returnTo;

  if (returnTo) return res.redirect(returnTo);

  const membership = await TenantMembership.findOne({
    userId: req.user._id, role: 'owner', status: 'active'
  });
  if (membership) return res.redirect('/tenant/dashboard');

  const hasSubmissions = await Project.exists({ clientUserId: req.user._id });
  if (hasSubmissions) return res.redirect('/client/dashboard');

  return res.redirect('/');
}

function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
}

module.exports = { googleCallback, getCurrentUser, logout };