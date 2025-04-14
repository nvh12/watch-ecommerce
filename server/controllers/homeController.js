const { getWatchesByFilters } = require('../services/watchServices');

async function home(req, res) {
    try {
        const latest = await getWatchesByFilters({}, 1, 10, 'createdAt', 'desc');
        const bestseller = await getWatchesByFilters({}, 1, 10, 'sold', 'desc');
        const all = await getWatchesByFilters({}, 1, 10);
        res.status(200).json({
            latest: latest,
            bestseller: bestseller,
            all: all,
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

module.exports = {
    home
};
