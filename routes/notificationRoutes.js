const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const { listNotifications } = require('../controllers/notificationController');

router.use(requireTenantOwner);
router.get('/', listNotifications);

module.exports = router;