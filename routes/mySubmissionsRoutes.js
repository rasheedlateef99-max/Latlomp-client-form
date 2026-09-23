const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { listMySubmissions, getMySubmission } = require('../controllers/mySubmissionsController');

router.use(requireAuth);
router.get('/', listMySubmissions);
router.get('/:projectId', getMySubmission);

module.exports = router;