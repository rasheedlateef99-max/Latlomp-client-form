const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LatLomp Client Portal API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;