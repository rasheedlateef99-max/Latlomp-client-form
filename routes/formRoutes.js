const express = require('express');
const router = express.Router();
const requireTenantOwner = require('../middleware/requireTenantOwner');
const { listForms, createForm, getForm } = require('../controllers/formController');
const { listQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.use(requireTenantOwner);

router.get('/', listForms);
router.post('/', createForm);
router.get('/:formId', getForm);

router.get('/:formId/questions', listQuestions);
router.post('/:formId/questions', createQuestion);
router.patch('/:formId/questions/:questionId', updateQuestion);
router.delete('/:formId/questions/:questionId', deleteQuestion);

module.exports = router;