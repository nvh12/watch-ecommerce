const mongoose = require('mongoose');
const Order = require('../models/order');
const Watch = require('../models/watch');

async function getOrder(id) {
    try {
        const orderId = new mongoose.Types.ObjectId(`${id}`);
        return await Order.findById(orderId).populate('items.product');
    } catch (error) {
        throw error;
    }
}

async function getAllOrders(page = 1, limit = 20, sortBy = null, order = 'asc') {
    try {
        const sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'asc' ? 1 : -1;
        } else {
            sortOption['createdAt'] = -1;
        }
        return await Order.find()
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw error;
    }
}

async function getOrdersByUser(userId, page = 1, limit = 20, sortBy = null, order = 'asc') {
    try {
        const sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'asc' ? 1 : -1;
        } else {
            sortOption['createdAt'] = order === 'asc' ? 1 : -1;
        }
        const id = new mongoose.Types.ObjectId(`${userId}`);
        return await Order.find({ user: id })
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('items.product')
            .lean();
    } catch (error) {
        throw error;
    }
}

async function getOrderNumber(userId = '') {
    try {
        if (userId) {
            const id = new mongoose.Types.ObjectId(`${userId}`);
            return await Order.countDocuments({ user: id });
        } else {
            return await Order.countDocuments({});
        }
    } catch (error) {
        throw error;
    }
}

async function getTotalCost(userId = '') {
    try {
        let result;
        if (userId) {
            const id = new mongoose.Types.ObjectId(userId);
            result = await Order.aggregate([
                { $match: { user: id } },
                { $group: { _id: null, totalCost: { $sum: '$total_price' } } }
            ]);
        } else {
            result = await Order.aggregate([
                { $group: { _id: null, totalCost: { $sum: '$total_price' } } }
            ]);
        }
        return result.length > 0 ? result[0].totalCost : 0;
    } catch (error) {
        throw error;
    }
}

async function updateOrder(id, updateData) {
    try {
        const orderId = new mongoose.Types.ObjectId(`${id}`);
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (updateData.status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                const watch = await Watch.findById(item.product);
                watch.stock += item.quantity;
                watch.sold -= item.quantity;
                await watch.save();
            }
        }
        return await Order.findOneAndUpdate(
            { _id: orderId },
            updateData,
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderNumber,
    getTotalCost,
    updateOrder
}