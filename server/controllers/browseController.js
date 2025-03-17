const watchServices = require('../services/watchServices');
const watchModel = require('../models/watch')

async function browse(req, res) {
    try {
        let { page = 1, ...filters} = req.params;
        page = parseInt(page);
        let total = await watchModel.countDocuments(filters);
        const watches = await watchServices.getWatchesByFilters(filters, page, 30);
        res.json({ totalPages: Math.ceil(total / 30), page: page, data: watches, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    browse
};