const express = require('express');
const router = express.Router();
const requireMasterAdmin = require('../middleware/requireMasterAdmin');
const { getDashboardStats, listTenants, updateTenantStatus } = require('../controllers/masterAdminController');

router.use(requireMasterAdmin);
router.get('/stats', getDashboardStats);
router.get('/tenants', listTenants);
router.patch('/tenants/:tenantId/status', updateTenantStatus);

module.exports = router;