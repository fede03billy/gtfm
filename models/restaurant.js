const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  owner_mail: {
    type: String,
    required: true,
  },
  owner_phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    default: '0000',
  },
  menu: {
    type: [String],
    required: true,
  },
  tables: {
    type: [String],
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

// module.exports = model("Restaurant", restaurantSchema)
module.exports =
  mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
