const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  document: {}
});

// Add `createdAt` and `updatedAt` fields
noteSchema.set('timestamps', true);

noteSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.userId;
    delete ret.__v;
  }
});

noteSchema.pre('find', function (next) {
  this.populate('tags');
  next();
});

noteSchema.pre('findOne', function (next) {
  this.populate('tags');
  next();
});

module.exports = mongoose.model('Note', noteSchema);
