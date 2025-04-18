require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const cartServices = require('../services/cartServices');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(id) {
    return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(id) {
    return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '1h' })
}

async function register(req, res) {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { identifier, password, guestCart = [] } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { name: identifier }]
        });
        if (!user) return res.status(400).json({ message: "User not found!" });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        })
        const cart = await cartServices.getCart(user._id);
        if (Array.isArray(guestCart) && guestCart.length > 0) {
            if (cart) {
                await cartServices.clearCart(user._id);
            }
            for (const item of guestCart) {
                await cartServices.addItem(item, user._id);
            }
        }
        res.status(200).json({
            message: 'Login successful!',
            curUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
    try {
        const user = jwt.verify(refreshToken, REFRESH_SECRET);
        const accessToken = generateAccessToken(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false
        })
        res.status(200).json({
            refreshed: true,
            message: 'Token refreshed successfully'
        });
    } catch (err) {
        res.status(403).json({
            refreshed: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

function logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

async function status(req, res) {
    const token = req.cookies.accessToken;
    if (!token) return res.status(200).json({ authenticated: false });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) res.status(200).json({ authenticated: false });
        return res.status(200).json({
            authenticated: true,
            curUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(200).json({ authenticated: false });
    }
}

module.exports = {
    register,
    login,
    refresh,
    logout,
    status
};