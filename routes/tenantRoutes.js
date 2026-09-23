const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { createTenant, getMyTenant } = require('../controllers/tenantController');

router.post('/', requireAuth, createTenant);
router.get('/me', requireAuth, getMyTenant);

module.exports = router;