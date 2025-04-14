require('dotenv').config();
const jwt = require('jsonwebtoken');
const cartServices = require('../services/cartServices')

async function cart(req, res) {
    try {
        const userId = req.user.id
        const cart = await cartServices.getCart(userId);
        res.status(200).json({ data: cart, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function add(req, res) {
    try {
        const userId = req.user.id
        const { id, price } = req.body;
        const updated = await cartServices.addItem({ id, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function reduce(req, res) {
    try {
        const userId = req.user.id
        const { id, price } = req.body;
        const updated = await cartServices.reduceItem({ id, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const userId = req.user.id
        const { id, price } = req.body;
        const updated = await cartServices.removeItem({ id, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function clear(req, res) {
    try {
        const userId = req.user.id
        const updated = await cartServices.clearCart(userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    cart,
    add,
    reduce,
    remove,
    clear
};