const express = require('express');
const router = express.Router();
const passport = require('passport');
// Integrate mongoose
const Tag = require('../models/tag');
const Note = require('../models/note');
const { constructLocationHeader } = require('../middleware/helpers');
const { requireFields, validateId, validateMatchingIds } = require('../middleware/validate');

// Protect endpoint
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  return Tag.find({ userId })
    .sort('name')
    .then(dbRes => res.status(200).json(dbRes))
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', validateId, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Tag.findOne({ _id: id, userId })
    .then(dbRes => {
      if (!dbRes) return next();
      else return res.status(200).json(dbRes);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', requireFields(['name']), (req, res, next) => {
  const userId = req.user.id;
  const newItem = { name: req.body.name, userId};
  return Tag.create(newItem)
    .then(dbRes => {
      if (!dbRes) throw new Error();
      else return res.status(201).location(constructLocationHeader(req, dbRes)).json(dbRes);
    })
    .catch(err => {
      if (err.code === 11000) {
        const error = new Error(`Tag \`${newItem.name}\` already exists (name must be unique).`);
        error.status = 400;
        return next(error);
      }
      else return next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', requireFields(['id', 'name']), validateId, validateMatchingIds, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  const item = { userId };
  const validFields = ['id', 'name'];
  for (const field of validFields) {
    if (field in req.body) {
      item[field] = req.body[field];
    }
  }
  return Tag.findOneAndUpdate({ _id: id, userId }, item, {new: true})
    .then(dbRes => {
      if (!dbRes) return next();
      else return res.status(200).json(dbRes);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateId, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  // Delete folder from Folder DB
  return Tag.findOneAndDelete({ _id: id, userId })
    .then((dbRes) => {
      if (!dbRes) return next();
      else return Note.updateMany({ userId }, {$pull: {tags: id}});
    })
    // Unset corresponding tag from Note entries
    .then(dbRes => {
      if (!dbRes) return next();
      else return res.status(204).end();
    })
    .catch(err => next(err));
});


module.exports = router;