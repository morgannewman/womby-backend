const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const passport = require('passport');

// Setup passport authentication
const localAuth = passport.authenticate('local', {session: false, failWithError: true});
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, function (req, res) {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;