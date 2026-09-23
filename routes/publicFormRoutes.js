const express = require('express');
const router = express.Router();
const { getPublicForm } = require('../controllers/publicFormController');

router.get('/:tenantSlug/:formSlug', getPublicForm);

module.exports = router;