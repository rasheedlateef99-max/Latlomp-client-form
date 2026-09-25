const express = require('express');
const router = express.Router();
const requireMasterAdmin = require('../middleware/requireMasterAdmin');
const { getDashboardStats, listTenants, updateTenantStatus, getTenantDetail } = require('../controllers/masterAdminController');

router.use(requireMasterAdmin);
router.get('/stats', getDashboardStats);
router.get('/tenants', listTenants);
router.get('/tenants/:tenantId', getTenantDetail);
router.patch('/tenants/:tenantId/status', updateTenantStatus);

module.exports = router;