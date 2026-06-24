const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }, // ADD THIS
  room: { type: Object, default: {} }   // ADD THIS (for saving room state)
});
module.exports = mongoose.model('User', userSchema);