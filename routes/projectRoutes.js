const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const { listProjects, getProject } = require('../controllers/projectController');
const { listTenantMessages, sendTenantMessage } = require('../controllers/messageController');

router.use(requireTenantOwner);
router.get('/', listProjects);
router.get('/:projectId', getProject);
router.get('/:projectId/messages', listTenantMessages);
router.post('/:projectId/messages', sendTenantMessage);

module.exports = router;