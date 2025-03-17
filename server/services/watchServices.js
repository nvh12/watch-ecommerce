const WatchModel = require('../models/watch');

async function getWatchById(id) {
    return await WatchModel.findOne({ watch_id : id});
}

async function getWatchesByName(name, page = 1, limit = 30) {
    return await WatchModel.find({ name: new RegExp(name, 'i')}).skip((page - 1) * limit).limit(limit);
}


async function getWatchesByFilters(filters, page = 1, limit = 30) {
    return await WatchModel.find(filters).skip((page - 1) * limit).limit(limit);
}

module.exports = {
    getWatchById, 
    getWatchesByName,
    getWatchesByFilters
}