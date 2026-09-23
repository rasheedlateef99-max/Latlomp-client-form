const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getPublicForm, submitForm } = require('../controllers/publicFormController');

router.get('/:tenantSlug/:formSlug', getPublicForm);
router.post('/:tenantSlug/:formSlug/submit', requireAuth, submitForm);

module.exports = router;