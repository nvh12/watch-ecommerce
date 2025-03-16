const WatchModel = require('../models/watch');

async function getAllWatches(page = 1, limit = 30) {
    return await WatchModel.find().skip((page - 1) * 30).limit(limit); 
} 

async function getWatchById(id) {
    return await WatchModel.findById(id);
}

async function getWatchesByFilters(filters, page = 1, limit = 30) {
    return await WatchModel.find(filters).skip((page - 1) * limit).limit(limit);
}

module.exports = {
    getAllWatches,
    getWatchById, 
    getWatchesByFilters
}