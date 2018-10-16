const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: { type: String, required: true }
});

tagSchema.set('timestamps', true);

tagSchema.set('toObject', {
  getters: true,
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.userId;
    delete ret.__v;
  }
});

tagSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);