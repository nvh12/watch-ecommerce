const mongoose = require('mongoose');
const Counter = require('./counter');

const watchSchema = new mongoose.Schema({
    watch_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    ref: { type: String, required: true, unique: true },
    mvmt: { type: String, required: true },
    casem: { type: String, required: true },
    bracem: { type: String, required: true },
    sex: { type: String, required: true, enum: ['Men', 'Women'] },
    image_url: { type: [String], required: true },
    stock: { type: Number, required: true, min: 0 },
    sold: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    description: { type: String, default: 'Description' }
}, { timestamps: true });

watchSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'watch_id' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.watch_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Watch', watchSchema, 'Watches');