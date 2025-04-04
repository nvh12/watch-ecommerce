const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch', required: true },
        price: { type: mongoose.Schema.Types.Decimal128, required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: mongoose.Schema.Types.Decimal128, required: true },
    payment: { type: String, enum: ['cash', 'QR'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema, 'Orders');

