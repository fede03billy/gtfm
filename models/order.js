const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  restaurant_id: {
    type: String,
    required: true,
  },
  table_id: {
    type: String,
    required: true,
  },
  ordered_food: {
    type: [String],
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  delivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
