const mongoose = require("mongoose");

const { MONGODB_URI } = require("../config");
const Note = require("../models/note");
const Folder = require("../models/folder");
const Tag = require("../models/tag");
const User = require("../models/user");

const { folders, notes, tags, users } = require("./data");

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Folder.insertMany(folders),
      Tag.insertMany(tags),
      User.insertMany(users),
      Note.insertMany(notes),
      Folder.createIndexes(),
      Tag.createIndexes(),
      User.createIndexes()
    ]);
  })
  .then(([FolderRes, TagRes, UserRes, NoteRes]) => {
    console.info(`Inserted ${NoteRes.length} Notes`);
    console.info(`Inserted ${FolderRes.length} Folders`);
    console.info(`Inserted ${TagRes.length} Tags`);
    console.info(`Inserted ${UserRes.length} Tags`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });
