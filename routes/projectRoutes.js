const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const { listProjects, getProject } = require('../controllers/projectController');

router.use(requireTenantOwner);
router.get('/', listProjects);
router.get('/:projectId', getProject);

module.exports = router;