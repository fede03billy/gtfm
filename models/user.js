const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
