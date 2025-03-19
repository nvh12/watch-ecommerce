const watchServices = require('../services/watchServices');
const watchModel = require('../models/watch')

async function browse(req, res) {
    try {
        let { page = 1, order = "asc", ...filters} = req.query;
        page = parseInt(page);
        let total = await watchModel.countDocuments(filters);
        const watches = await watchServices.getWatchesByFilters(filters, page, 30, order);
        res.json({ totalPages: Math.ceil(total / 30), page: page, order: order, data: watches, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    browse
};