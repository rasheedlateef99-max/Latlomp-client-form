const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const { listForms, createForm, getForm } = require('../controllers/formController');
const { listQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.use(requireTenantOwner);

router.get('/', listForms);
router.post('/', requireActiveSubscription, createForm);
router.get('/:formId', getForm);

router.get('/:formId/questions', listQuestions);
router.post('/:formId/questions', requireActiveSubscription, createQuestion);
router.patch('/:formId/questions/:questionId', updateQuestion);
router.delete('/:formId/questions/:questionId', deleteQuestion);

module.exports = router;