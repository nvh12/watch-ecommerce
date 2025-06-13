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
    if (!this.items || this.items.length === 0) {
        return next();
    }
    const watchPromises = this.items.map(item =>
        watchServices.getWatchByObjectId(item.product)
    );
    const watches = await Promise.all(watchPromises);
    this.items = this.items.filter((item, index) => {
        const watch = watches[index];
        if (watch) {
            item.price = watch.price * (1 - (watch.discount / 100));
            return true;
        } else {
            return false;
        }
    });
    this.total_price = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema, 'Carts');