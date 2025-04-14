require('dotenv').config();
const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');
const User = require('../models/user');

async function user(req, res) {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userObject = await User.findById(decoded.id);
        if (!userObject) return null;
        const { password: _, ...user } = userObject.toObject();
        res.status(200).json({ data: user, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    user
};