const User = require('../models/user');

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
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser
}