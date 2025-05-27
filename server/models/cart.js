const mongoose = require('mongoose');
const watchServices = require('../services/watchServices');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch', required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: Number, required: true }
}, { timestamps: true });

cartSchema.pre('save', async function (next) {
    const watchPromises = this.items.map(item =>
        watchServices.getWatchByObjectId(item.product)
    );
    const watches = await Promise.all(watchPromises);
    this.items.forEach((item, index) => {
        const watch = watches[index];
        item.price = watch.price * (1 - (watch.discount / 100));
    });
    this.total_price = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema, 'Carts');