const { Schema, model } = require("mongoose");

const userSchema = new Schema({
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
})

module.exports = model("User", userSchema)