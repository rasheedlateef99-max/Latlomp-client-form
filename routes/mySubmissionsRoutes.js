const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { listMySubmissions, getMySubmission } = require('../controllers/mySubmissionsController');
const { listClientMessages, sendClientMessage } = require('../controllers/messageController');

router.use(requireAuth);
router.get('/', listMySubmissions);
router.get('/:projectId', getMySubmission);
router.get('/:projectId/messages', listClientMessages);
router.post('/:projectId/messages', sendClientMessage);

module.exports = router;