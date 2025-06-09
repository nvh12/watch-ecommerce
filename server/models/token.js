const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

module.exports = mongoose.model('Token', tokenSchema, 'Tokens');