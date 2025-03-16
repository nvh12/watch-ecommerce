const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema({
    watch_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    ref: { type: String, required: true, unique: true },
    mvmt: { type: String, required: true },
    casem: { type: String, required: true },
    bracem: { type: String, required: true },
    sex: { type: String, required: true, enum: ["Men", "Women"] },
    image_url: { type: Array, required: true },
    stock: { type: Number, required: true }
});

module.exports = mongoose.model("Watch", watchSchema, "Watches");