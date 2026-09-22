function requireMasterAdmin(req, res, next) {
  if (!req.session || !req.session.isMasterAdmin) {
    return res.status(403).json({ error: 'Master admin access required' });
  }
  next();
}

module.exports = requireMasterAdmin;