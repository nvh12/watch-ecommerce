const watchServices = require('../services/watchServices');
const Watch = require('../models/watch');

async function filter(req, res) {
    try {
        const brand = await Watch.distinct('brand');
        const movement = await Watch.distinct('mvmt');
        const caseMaterial = await Watch.distinct('casem');
        const braceletMaterial = await Watch.distinct('bracem');
        const sex = await Watch.distinct('sex');
        res.status(200).json({
            status: 'success',
            data: { brand, movement, caseMaterial, braceletMaterial, sex }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch filters' });
    }
}

async function browse(req, res) {
    try {
        let { page = 1, sortBy = null, order = 'asc', ...filters } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        const total = await Watch.countDocuments(filters);
        if (total === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No watches found matching the criteria'
            });
        }
        const watches = await watchServices.getWatchesByFilters(filters, page, 30, sortBy, order);
        res.status(200).json({
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