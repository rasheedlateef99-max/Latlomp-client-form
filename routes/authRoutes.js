const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleCallback, getCurrentUser, logout } = require('../controllers/authController');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  googleCallback
);

router.get('/me', getCurrentUser);
router.get('/logout', logout);

module.exports = router;