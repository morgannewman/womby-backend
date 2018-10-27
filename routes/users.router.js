const router = require('express').Router();
const User = require('../models/user');
const Note = require('../models/note');
const blankDocument = require('../db/blankDocument');
const { constructLocationHeader } = require('../middleware/helpers');
const { requireFields, validateUser } = require('../middleware/validate');

router.post('/', requireFields(['email', 'password', 'firstName', 'lastName'], 422), validateUser, (req, res, next) => {
  const possibleFields = ['email', 'password', 'firstName', 'lastName'];
  const newUser = {};
  for (const field of possibleFields) {
    if (field in req.body) newUser[field] = req.body[field];
  }
  newUser.firstName = newUser.firstName.trim();
  newUser.lastName = newUser.lastName.trim();
  
  let user;
  return User.hashPassword(newUser.password)
    .then(digest => {
      newUser.password = digest;
      return User.create(newUser);
    })
    // Seed user's database with empty note
    .then(_user => {
      user = _user;
      const seedNote = {
        userId: user.id,
        title: 'Untitled note',
        document: blankDocument
      }
      return Note.create(seedNote)
    })
    // Send user their info back
      .then(() =>
      res
      .status(201)
      .location(constructLocationHeader(req, user))
      .json(user)
    )
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The email already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;