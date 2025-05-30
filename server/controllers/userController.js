require('dotenv').config();
const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');
const orderServices = require('../services/orderServices');

async function user(req, res) {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userObject = await userServices.getUserByObjectId(decoded.id);
        if (!userObject) return res.status(404).json({ message: 'User not found' });
        const { password: _, ...user } = userObject.toObject();
        res.status(200).json({ data: user, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function userOrders(req, res) {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let { page = 1, sortBy = null, order } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        const total = await orderServices.getOrderNumber(decoded.id);
        if (total === 0) {
            return res.status(200).json({
                status: 'success',
                data: [],
                message: 'No orders found'
            });
        }
        const totalCost = await orderServices.getTotalCost(decoded.id);
        const limit = 5;
        const orders = await orderServices.getOrdersByUser(decoded.id, page, limit, sortBy, order);
        res.status(200).json({
            totalOrders: total || 0,
            totalCost: totalCost,
            totalPages: Math.ceil(total / limit),
            page: page,
            order: order,
            data: orders || [],
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

async function singleOrder(req, res) {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = req.params;
        const order = await orderServices.getOrder(id);
        if (!order) {
            return res.status(404).json({ status: 'error', error: 'Order not found' });
        }
        if (order.user.toString() !== decoded.id) {
            return res.status(403).json({ status: 'error', error: 'Access denied' });
        }
        res.status(200).json({status: 'success', order: order});
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

async function updateUser(req, res) {
    try {
        const updateData = req.body;
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userObject = await userServices.getUserByObjectId(decoded.id);
        if (!userObject) return res.status(404).json({ message: 'User not found' });
        const isMatch = await userObject.comparePassword(updateData.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });
        const { password, newPassword, ...rest } =  updateData;
        const data = { ...rest };
        if (newPassword) data.password = newPassword;
        const updatedUser = await userServices.updateUser(decoded.id, data);
        const { password: _, ...user } = updatedUser.toObject();
        res.status(200).json({ data: user, status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

module.exports = {
    user,
    userOrders,
    singleOrder,
    updateUser
};