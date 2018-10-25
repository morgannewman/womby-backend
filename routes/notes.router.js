const express = require("express");
const router = express.Router();
const passport = require("passport");
// Integrate mongoose
const Note = require("../models/note");
// Validation Middleware
const {
  constructLocationHeader,
  constructObject
} = require("../middleware/helpers");
const {
  requireFields,
  validateId,
  validateFolderId,
  validateTagId,
  validateMatchingIds
} = require("../middleware/validate");
// For constructing a valid POST document
const blankDocument = require("../db/blankDocument");

// Protect endpoint
router.use(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true })
);

/* ========== GET/READ ALL ITEMS ========== */
router.get("/", (req, res, next) => {
  const { folderId, searchTerm, tagId } = req.query;
  const userId = req.user.id;
  // Add relevant filters to query
  let filter = { userId };
  if (tagId) filter.tags = tagId;
  if (folderId) filter.folderId = folderId;
  if (searchTerm) filter.title = { $regex: new RegExp(searchTerm, "gi") };

  return Note.find(filter)
    .sort({ updatedAt: "desc" })
    .then(dbResponse => res.status(200).json(dbResponse))
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get("/:id", validateId, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Note.findOne({ userId, _id: id })
    .then(dbResponse => {
      // Verify that a result is returned (ID exists in DB)
      if (!dbResponse) return next();
      else return res.status(200).json(dbResponse);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post(
  "/",
  validateId,
  validateFolderId,
  validateTagId,
  (req, res, next) => {
    const availableFields = ["title", "document", "folderId", "tags"];
    // Construct the new note
    const newNote = constructObject(availableFields, req);
    if (!newNote.document) newNote.document = blankDocument;
    if (!newNote.title) newNote.title = "Untitled note";
    return Note.create(newNote)
      .then(dbResponse => {
        // Verify that a result is returned (otherwise throw 500 error)
        if (!dbResponse) throw new Error();
        else
          return res
            .status(201)
            .location(constructLocationHeader(req, dbResponse))
            .json(dbResponse);
      })
      .catch(err => next(err));
  }
);

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put(
  "/:id",
  requireFields(["id"]),
  validateId,
  validateTagId,
  validateFolderId,
  validateMatchingIds,
  (req, res, next) => {
    const updateFields = ["title", "document", "folderId", "tags"];
    const updatedNote = constructObject(updateFields, req);

    const id = req.params.id;
    return Note.findByIdAndUpdate(id, updatedNote, { new: true })
      .then(dbResponse => {
        // Send 404 if no dbResponse
        if (!dbResponse) return next();
        else return res.status(200).json(dbResponse);
      })
      .catch(err => next(err));
  }
);

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete("/:id", validateId, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Note.findOneAndDelete({ _id: id, userId })
    .then(dbResponse => {
      // Verify an item was deleted. If not, send 404.
      if (!dbResponse) return next();
      else return res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;
