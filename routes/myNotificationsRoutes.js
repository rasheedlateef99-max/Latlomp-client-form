const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getClientNotificationCount } = require('../controllers/notificationController');

router.use(requireAuth);
router.get('/', getClientNotificationCount);

module.exports = router;