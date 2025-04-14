const orderServices = require('../services/orderServices');

async function order(req, res) {
    try {
        const { id } = req.params;
        const order = await orderServices.getOrder(id);
        return await res.status(200).json({ data: order, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    order
}