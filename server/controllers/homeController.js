const { getWatchesByFilters } = require('../services/watchServices');
const { getUserPreference, recommend } = require('../utils/recommendation');
const jwt = require('jsonwebtoken');

async function home(req, res) {
    try {
        let recommended = [];
        const token = req.cookies.accessToken;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded) {
                    const preference = await getUserPreference(decoded.id);
                    recommended = await recommend(preference, 12);
                }
            } catch (error) {
                console.warn('Not verified. Accessing as a guest user');
            }
        }
        const latest = await getWatchesByFilters({}, 1, 12, 'createdAt', 'desc');
        const bestseller = await getWatchesByFilters({}, 1, 12, 'sold', 'desc');
        const all = await getWatchesByFilters({}, 1, 12);
        res.status(200).json({
            recommended: recommended,
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
