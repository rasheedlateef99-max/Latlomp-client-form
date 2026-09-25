const express = require('express');
const router = express.Router();
const requireMasterAdmin = require('../middleware/requireMasterAdmin');
const { listPackages, createPackage, updatePackage } = require('../controllers/masterAdminPackageController');

router.use(requireMasterAdmin);
router.get('/', listPackages);
router.post('/', createPackage);
router.patch('/:packageId', updatePackage);

module.exports = router;