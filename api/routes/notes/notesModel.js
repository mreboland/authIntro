const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  // We are using association (instead of nesting) because a User is it's own entity and can be linked to many different notes.
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Note', notesSchema);