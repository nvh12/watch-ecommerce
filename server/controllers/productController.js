const watchServices = require('../services/watchServices');

async function product(req, res) {
    try {
        let { id } = req.params;
        let watch;
        if (id.length === 24) {
            watch = await watchServices.getWatchByOjectId(id);
        } else {
            let watch_id = parseInt(id);
            watch = await watchServices.getWatchById(watch_id);
        }
        res.status(200).json({ watch: watch, status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    product
};