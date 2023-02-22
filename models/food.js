const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true, 
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    restaurant_id: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    vegan: {
        type: Boolean,
        required: true,
        default: false,
    },
    spicy: {
        type: Boolean,
        required: true,
        default: false,
    },
    gluten_free: {
        type: Boolean,
        required: true,
        default: false,
    },
    lactose_free: {
        type: Boolean,
        required: true,
        default: false,
    },
    created_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
})

// module.exports = model("Food", foodSchema) // this causes some problem with overwriting the model, this fix is from: https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error
module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);