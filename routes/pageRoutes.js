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

router.get('/tenant/create', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'create.html'));
});

router.get('/tenant/forms', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'forms.html'));
});

router.get('/tenant/forms/:formId', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'form-edit.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

router.get('/start-project', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'start-project.html'));
});

router.get('/tenant/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'dashboard.html'));
});

router.get('/f/:tenantSlug/:formSlug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'f.html'));
});

router.get('/tenant/submissions', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'submissions.html'));
});

router.get('/tenant/submissions/:projectId', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tenant', 'submission-detail.html'));
});

router.get('/master-admin/businesses', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'master-admin', 'businesses.html'));
});

router.get('/my-submissions', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'my-submissions.html'));
});

router.get('/my-submissions/:projectId', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'my-submissions-detail.html'));
});

router.get('/client/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'client', 'dashboard.html'));
});

router.get('/master-admin/businesses/:tenantId', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'master-admin', 'business-detail.html'));
});

router.get('/master-admin/packages', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'master-admin', 'packages.html'));
});

module.exports = router;