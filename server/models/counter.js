const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
});

module.exports = mongoose.model('Counter', counterSchema, 'Counters');

