const Notification = require('../models/Notification');

async function listNotifications(req, res) {
  const unreadCount = await Notification.countDocuments({
    tenantId: req.tenant._id,
    userId: req.user._id,
    read: false
  });
  res.json({ unreadCount });
}

module.exports = { listNotifications };