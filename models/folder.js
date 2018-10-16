const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

folderSchema.set('timestamps', true);

folderSchema.set('toObject', {
  getters: true,
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.userId;
    delete ret.__v;
  }
});

folderSchema.index({ name: 1, userId: 1}, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);