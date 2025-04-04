require('dotenv').config();
const userServices = require('../services/userServices');
const User = require('../models/user');

async function user(req, res) {
    try {
        const { id } = req.params;
        const user_id = parseInt(id);
        const user = await userServices.getUserById(user_id);
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (user._id.toString() !== decoded.id) return res.status(401).json({ message: 'Access Denied' });
        res.json({ data: user, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    user
};