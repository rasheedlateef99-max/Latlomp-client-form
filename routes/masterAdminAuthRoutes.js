const express = require('express');
const router = express.Router();
const { login, logout, getStatus } = require('../controllers/masterAdminAuthController');

router.post('/login', login);
router.get('/logout', logout);
router.get('/status', getStatus);

module.exports = router;