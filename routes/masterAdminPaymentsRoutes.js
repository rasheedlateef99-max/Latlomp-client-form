const express = require('express');
const router = express.Router();
const requireMasterAdmin = require('../middleware/requireMasterAdmin');
const { listPayments, approvePayment, rejectPayment } = require('../controllers/masterAdminPaymentController');

router.use(requireMasterAdmin);
router.get('/', listPayments);
router.post('/:paymentId/approve', approvePayment);
router.post('/:paymentId/reject', rejectPayment);

module.exports = router;