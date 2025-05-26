const watchServices = require('../services/watchServices');
const Watch = require('../models/watch');

async function search(req, res) {
    try {
        let { search, page = 1, order = 'asc' } = req.query;
        page = parseInt(page);
        const total = await Watch.countDocuments({ name: new RegExp(search, 'i') });
        if (total === 0) {
            return res.status(404).json({
                status: "error",
                message: "No watches found matching the criteria"
            });
        }
        const watches = await watchServices.getWatchesByName(search, page, 30, order);
        res.status(200).json({ 
            totalPages: Math.ceil(total / 30), 
            page: page, order: order, 
            data: watches || [], 
            totalWatches: total,
            status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    search
};