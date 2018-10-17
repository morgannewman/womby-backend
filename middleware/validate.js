const Folder = require('../models/folder');
const Tag = require('../models/tag');

/**
 * Internal Helpers
 */
const isInvalidId = id => id ? !id.match(/^[0-9a-fA-F]{24}$/) : true;

const isInvalidEmail = email => {
  // https://stackoverflow.com/a/32686261/
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !re.test(email);
}

/**
 * Validates if the request body contains all fields. Used as Express middleware.
 * @param {string[]} requiredFields - a field that must exist in the req.body to pass validation.
 * @param {number} status - an optional integer representing desired HTTP status if request fails.
 * @returns next()
 * @throws next(err)
 */
const requireFields = (requiredFields, status = 400) => (req, res, next) => {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      const err = new Error(`Missing \`${field}\` in request body.`);
      err.status = status;
      return next(err);
    }
  }
  return next();
};

/**
 * Checks to make sure `id` in req.params and req.body are 24 digit hex numbers.
 * @throws 400 error - Invalid `id` parameter.
 */
const validateId = (req, res, next) => {
  const possibleIds = [req.params.id, req.body.id];
  for (const id of possibleIds) {
    if (id) {
      if (isInvalidId(id)) {
        const err = new Error('Invalid `id` parameter.');
        err.status = 400;
        return next(err);
      }
    }
  }
  return next();
};

/**
 * Checks to make sure the folderId in req.body or req.body.parent 
 * are 24 digit hex numbers and exist in the database.
 * @throws 400 error - Invalid `folderId` or `parent` in request body.
 * @throws 404 error - `folderId` or `parent` in request body does not exist.
 */
const validateFolderId = (req, res, next) => {
  if (!(req.body.folderId || req.body.parent)) return next();
  const userId = req.user.id;
  // Select correct ID depending on request type
  const id = req.body.folderId || req.body.parent;
  // Step 1: Check if ID is syntactically valid
  if (isInvalidId(id)) {
    const err = new Error('Invalid `folderId` or `parent` in request body.');
    err.status = 400;
    return next(err);
  }
  // Step 2: Check to make sure the req.body.parent ID !== the id
  if (req.body.parent === req.body.id) {
    const err = new Error('`parent` cannot point to itself.');
    err.status = 400;
    return next(err);
  }
  // Step 3: Check to see folder exists in DB
  Folder.find({ _id: id, userId }).count()
    .then(dbRes => {
      if (dbRes < 1) {
        const err = new Error('`folderId` or `parent` in request body does not exist.');
        err.status = 404;
        return next(err);
      }
      else return next();
    })
    .catch(err => next(err));
};

/**
 * Checks to see if all the tags in req.body are in an array, valid IDs, and exist in the database.
 * @throws 400 error - `tags` must be an array
 * @throws 400 error - `Invalid tag \`id\` parameter at index ${i}.`
 * @throws 404 error - An id in `tags` does not exist.
 */
const validateTagId = (req, res, next) => {
  if (req.body.tags === undefined) return next();
  // Make sure `tags` is an array
  if (!Array.isArray(req.body.tags)) {
    const err = new Error('`tags` must be an array');
    err.status = 400;
    return next(err);
  }
  // Check to see if any tags need to be validated
  const tagsLength = req.body.tags.length;
  if (tagsLength === 0) return next();
  // Check for valid tags
  for (let i = 0; i < tagsLength; i++) {
    if (isInvalidId(req.body.tags[i])) {
      const err = new Error(`Invalid tag \`id\` parameter at index ${i}.`);
      err.status = 400;
      return next(err);
    }
  }
  // Skip step 2 validation if the request is redundant 
  if (req.method === 'GET' || req.method === 'DELETE') return next();
  // Check to see if all tags being used exist
  const userId = req.user.id;
  return Tag.find({ _id: { $in: req.body.tags }, userId }).count()
    .then(tagCount => {
      if (tagCount !== tagsLength) {
        const err = new Error('An id in `tags` does not exist.');
        err.status = 404;
        return next(err);
      }
      else return next();
    })
    .catch(err => next(err));
};


/**
 * Makes sure a new user submission follows the submission rules. Email must be valid,
 * email and password must be of type string, password must be between 8 and 72 characters,
 * and email and password must have no leading/trailing whitespace.
 */
const validateUser = (req, res, next) => {
  const { email, password } = req.body;
  // Require email and password to be strings
  if (!(typeof email === 'string' && typeof password === 'string')) {
    const err = new Error('`email` and `password` must be of type string.');
    err.status = 400;
    return next(err);
  }
  if (isInvalidEmail(email)) {
    const err = new Error('That is not a valid email.');
    err.status = 400;
    return next(err);
  }
  if (password.length < 8 || password.length > 72) {
    const err = new Error('Password must be between 8 and 72 characters long.');
    err.status = 400;
    return next(err);
  }
  // Require no leading or trailing whitespace
  if (email[0] === ' ' ||
    email[email.length - 1] === ' ' ||
    password[0] === ' ' ||
    password[password.length - 1] === ' ') {
    const err = new Error('email and password cannot begin or end with a space.');
    err.status = 400;
    return next(err);
  }
  return next();
};

/**
 * Ensures that the parameters in the request body and request parameter are equal
 * to each other. This mainly exists to prevent any accidental changes from occuring
 * from buggy client-side submissions.
 */
const validateMatchingIds = (req, res, next) => {
  const id = req.params.id;
  if (!(id && req.body.id && id === req.body.id)) {
    const err = new Error('Request body `id` and parameter `id` must be equivalent.');
    err.status = 400;
    return next(err);
  }
  return next();
}

module.exports = { requireFields, validateTagId, validateFolderId, validateId, validateMatchingIds, validateUser };