const Watch = require('../models/watch');

async function getWatchById(id) {
    return await Watch.findOne({ watch_id: id });
}

async function getWatchesByName(name, page = 1, limit = 30, order) {
    return await Watch.find({ name: new RegExp(name, 'i') })
        .skip((page - 1) * limit)
        .limit(limit);
}

async function getWatchesByFilters(filters, page = 1, limit = 30, order = "asc") {
    return await Watch.find(filters)
        .sort({ price: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

async function addWatch(info) {
    let watch = new Watch({ ...info })
    await watch.save();
}

async function updateWatch(id, updateData) {
    return await Watch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

async function deleteWatch(id) {
    return await Watch.findByIdAndDelete(id);
}

module.exports = {
    getWatchById,
    getWatchesByName,
    getWatchesByFilters,
    addWatch,
    updateWatch,
    deleteWatch
}