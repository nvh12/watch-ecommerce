const mongoose = require('mongoose');
const Counter = require('./counter');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isNew) {  
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'user_id' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );

            if (!counter || !counter.value) {
                throw new Error('Counter was not properly incremented.');
            }
            this.user_id = counter.value;
        } catch (error) {
            return next(error);
        }
    }
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema, 'Users');