const watchServices = require('../services/watchServices');
const watchModel = require('../models/watch')

async function browse(req, res) {
    try {
        let { page = 1, order = "asc", ...filters } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        const total = await watchModel.countDocuments(filters);
        if (total === 0) {
            return res.status(404).json({
                status: "error",
                message: "No watches found matching the criteria"
            });
        }
        const watches = await watchServices.getWatchesByFilters(filters, page, 30, order);
        res.json({
            totalPages: Math.ceil(total / 30),
            page: page,
            order: order,
            data: watches || [],
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

module.exports = {
    browse
};