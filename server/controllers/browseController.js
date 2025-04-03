const watchServices = require('../services/watchServices');
const Watch = require('../models/watch')

async function filter(req, res) {
    try {
        const brands = await Watch.distinct('brand');
        const movements = await Watch.distinct('mvmt');
        const caseMaterials = await Watch.distinct('casem');
        const braceletMaterials = await Watch.distinct('bracem');
        const sexes = await Watch.distinct('sex');
        res.json({
            status: 'success',
            data: { brands, movements, caseMaterials, braceletMaterials, sexes }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch filters' });
    }
}

async function browse(req, res) {
    try {
        let { page = 1, sortBy, order = "asc", ...filters } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        const total = await Watch.countDocuments(filters);
        if (total === 0) {
            return res.status(404).json({
                status: "error",
                message: "No watches found matching the criteria"
            });
        }
        const watches = await watchServices.getWatchesByFilters(filters, page, 30, sortBy, order);
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
    browse,
    filter
};