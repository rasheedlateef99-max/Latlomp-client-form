const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/master-admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'master-admin', 'login.html'));
});

router.get('/master-admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'master-admin', 'dashboard.html'));
});

module.exports = router;