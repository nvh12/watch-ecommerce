require('dotenv').config();
const jwt = require('jsonwebtoken');
const watchServices = require('../services/watchServices');
const orderServices = require('../services/orderServices');
const Watch = require('../models/watch');

function admin(req, res) {
    res.send('Admin');
}

async function addProduct(req, res) {
    try {
        const { watch } = req.body;
        const product = await watchServices.addWatch(watch);
        res.status(201).json({ status: 'success', product: product })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { updateData } = req.body;
        const product = await watchServices.updateWatch(id, updateData);
        res.status(200).json({ status: 'success', product: product })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

async function deleteProducts(req, res) {
    try {
        const { ids } = req.body;
        const result = await watchServices.deleteWatches(ids);
        if (result.deletedCount === 0) {
            return res.status(404).json({ status: 'error', error: 'No products found' });
        }
        res.status(200).json({
            status: 'success',
            message: `${result.deletedCount} product(s) deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

async function getOrders(req, res) {
    try {
        let { page = 1, sortBy = null, order = 'asc' } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        const total = await orderServices.getOrderNumber();
        if (total === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No orders found'
            });
        }
        const orders = await orderServices.getAllOrders(page, 20, sortBy, order);
        res.status(200).json({
            totalPages: Math.ceil(total / 20),
            page: page,
            order: order,
            data: orders || [],
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

module.exports = {
    admin,
    addProduct,
    updateProduct,
    deleteProducts,
    getOrders
};