const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const { getStatus, listActivePackages, initiateCheckout, verifyReturn } = require('../controllers/subscriptionController');

router.use(requireTenantOwner);
router.get('/status', getStatus);
router.post('/checkout', initiateCheckout);
router.get('/verify/:reference', verifyReturn);

module.exports = router;