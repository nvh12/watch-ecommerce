const watchServices = require('../services/watchServices');
const { recommend } = require('../utils/recommendation');

async function product(req, res) {
    try {
        let { id } = req.params;
        let watch;
        if (id.length === 24) {
            watch = await watchServices.getWatchByObjectId(id);
        } else {
            let watch_id = parseInt(id);
            watch = await watchServices.getWatchById(watch_id);
        }
        res.status(200).json({ watch: watch, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getRecommendations(req, res) {
    try {
        let { id } = req.params;
        let watch;
        if (id.length === 24) {
            watch = await watchServices.getWatchByObjectId(id);
        } else {
            let watch_id = parseInt(id);
            watch = await watchServices.getWatchById(watch_id);
        }
        const recommendations = await recommend(watch);
        res.status(200).json({ recommendations: recommendations, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getNumber(req, res) {
    try {
        const number = await watchServices.getWatchNumber();
        res.status(200).json({ number: number, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    product,
    getRecommendations,
    getNumber
};