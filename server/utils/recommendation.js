const watchServices = require('../services/watchServices');

async function recommend(watch) {
    const candidates = await watchServices.getWatchesByFilters({
        _id: { $ne: watch._id },
        sex: watch.sex,
        mvmt: watch.mvmt
    }, 1, 160);
    const scored = candidates.map(watch => {
        let score = 0;
        if (watch.brand === watch.brand) score += 1;
        if (watch.casem === watch.casem) score += 1;
        if (watch.bracem === watch.bracem) score += 1;
        const priceDiff = Math.abs(watch.price - watch.price);
        if (priceDiff <= watch.price * 0.25) score += 1;
        return { watch, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(i => i.watch);
}

module.exports = { recommend };