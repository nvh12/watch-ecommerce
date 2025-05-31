const mongoose = require('mongoose');
const User = require('../models/user');

async function getUserByObjectId(id) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        return await User.findById(objectId);
    } catch (error) {
        throw error;
    }
}

async function getUserById(id) {
    try {
        const userObject = await User.findOne({ user_id: id });
        if (!userObject) return null;
        const { password: _, ...user } = userObject.toObject();
        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        return await User.findOneAndUpdate(objectId, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserByObjectId,
    getUserById,
    updateUser
}