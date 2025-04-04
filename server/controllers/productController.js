const watchServices = require('../services/watchServices');

async function product(req, res) {
    try {
        let { id } = req.params;
        let watch_id = parseInt(id);
        const watch = await watchServices.getWatchById(watch_id);
        res.json({ data: watch, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    product
};