require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function verifyUser(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const id = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: 'User not found'});
        req.user = { id: user._id, email: user.email, role: user.role};
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

function verifyRole(...allowRoles) {
    return (req, res, next) => {
        if (!req.user || !allowRoles.includes(req.user.role)) {
            return res.status(401).json({ message: 'Access denied'});
        }
        next();
    }
}

module.exports = {
    verifyUser,
    verifyRole
}