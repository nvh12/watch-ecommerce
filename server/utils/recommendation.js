const orderServices = require('../services/orderServices');
const watchServices = require('../services/watchServices');

async function getUserPreference(userId) {
    const orders = await orderServices.getOrdersByUser(userId, 1, 5);
    if (!orders || orders.length === 0) return {};
    const products = orders.flatMap(order =>
        order.items.map(item => item.product)
    );
    if (products.length === 0) return {};
    const attributes = ['brand', 'casem', 'bracem', 'mvmt', 'sex'];
    const frequency = {};
    for (const attr of attributes) {
        frequency[attr] = {};
        for (const product of products) {
            const value = product[attr];
            if (!value) continue;
            frequency[attr][value] = (frequency[attr][value] || 0) + 1;
        }
    }
    const watch = {};
    for (const attr of attributes) {
        const values = frequency[attr];
        const common = Object.entries(values).reduce((a, b) => (a[1] > b[1] ? a : b));
        watch[attr] = common[0];
    }
    const avgPrice = products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length;
    watch.price = avgPrice;
    return watch;
}

async function recommend(watch, limit = 12) {
    const filter = {
        sex: watch.sex,
        mvmt: watch.mvmt,
        stock: { $gt: 0 }
    };
    if (watch._id) {
        filter._id = { $ne: watch._id };
    }
    const count = await watchServices.countWatches(filter);
    if (count === 0) return [];
    const candidateLimit = 160;
    const totalPages = Math.ceil(count / candidateLimit);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const candidates = await watchServices.getWatchesByFilters(filter, randomPage, candidateLimit);
    const scored = candidates.map(candidate => {
        let score = 0;
        if (watch.brand === candidate.brand) score += 1;
        if (watch.casem === candidate.casem) score += 1;
        if (watch.bracem === candidate.bracem) score += 1;
        if (watch.price) {
            const priceDiff = Math.abs(watch.price - candidate.price);
            if (priceDiff <= watch.price * 0.25) score += 1;
        }
        return { candidate, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(i => i.candidate);
}

module.exports = { getUserPreference, recommend };