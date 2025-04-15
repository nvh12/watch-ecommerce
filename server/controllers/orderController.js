const orderServices = require('../services/orderServices');

async function order(req, res) {
    try {
        const { id } = req.params;
        const order = await orderServices.getOrder(id);
        if (!order) {
            return res.status(404).json({ status: 'error', error: 'Order not found' });
        }
        res.status(200).json({status: 'success', order: order});
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

module.exports = {
    order
}