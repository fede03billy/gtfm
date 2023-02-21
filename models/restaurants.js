const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
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
})

module.exports = model("Restaurant", restaurantSchema)