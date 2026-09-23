function googleCallback(req, res) {
  const returnTo = req.session.returnTo;
  delete req.session.returnTo;
  res.redirect(returnTo || '/');
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