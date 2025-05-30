require('dotenv').config();
const cartServices = require('../services/cartServices');
const Watch = require('../models/watch');
const Order = require('../models/order');

async function cart(req, res) {
    try {
        const userId = req.user.id;
        const cart = await cartServices.getCart(userId);
        res.status(200).json({ data: cart, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function add(req, res) {
    try {
        const userId = req.user.id;
        const { product, price } = req.body;
        const updated = await cartServices.addItem({ product, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function reduce(req, res) {
    try {
        const userId = req.user.id;
        const { product, price } = req.body;
        const updated = await cartServices.reduceItem({ product, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const userId = req.user.id;
        const { product, price } = req.body;
        const updated = await cartServices.removeItem({ product, price }, userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function clear(req, res) {
    try {
        const userId = req.user.id;
        const updated = await cartServices.clearCart(userId);
        res.status(200).json({ data: updated, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function rollback(updatedProducts) {
    for (const product of updatedProducts) {
        await Watch.findByIdAndUpdate(
            product.productId,
            { $inc: { stock: product.quantity, sold: -product.quantity } }
        );
    }
}

async function checkout(req, res) {
    try {
        const { userId, payment, delivery, address } = req.body;
        const cart = await cartServices.getCart(userId);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Empty cart' });
        }
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
        }));
        const newOrder = new Order({
            user: cart.user,
            items: orderItems,
            total_price: cart.total_price,
            payment: payment,
            delivery: delivery,
            address: address,
            status: 'processing'
        });
        const updatedProducts = [];
        for (const item of cart.items) {
            const product = await Watch.findById(item.product._id);
            const update = await Watch.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity, sold: item.quantity } },
                { runValidators: true, new: true }
            );
            if (!update) {
                await rollback(updatedProducts);
                return res.status(400).json({ message: `${item.product.name} went out of stock during checkout.` });
            }
            updatedProducts.push({ productId: item.product._id, quantity: item.quantity });
        }
        await newOrder.save();
        await cartServices.clearCart(userId);
        return res.status(200).json({ status: 'success', message: 'Order placed successfully!', orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    cart,
    add,
    reduce,
    remove,
    clear,
    checkout
};