const watchServices = require('../services/watchServices');
const watchModel = require('../models/watch');

async function search(req, res) {
    try {
        let { search, page = 1, order = 'asc' } = req.query;
        page = parseInt(page);
        const total = await watchModel.countDocuments({ name: new RegExp(search, 'i') });
        const watches = await watchServices.getWatchesByName(search, page, 30, order);
        res.json({ totalPages: Math.ceil(total / 30), page: page, order: order, data: watches, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    search
};