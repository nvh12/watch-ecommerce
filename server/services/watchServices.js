const Watch = require('../models/watch');

async function getWatchById(id) {
    try {
        return await Watch.findOne({ watch_id: id });
    } catch (error) {
        throw error;
    }
}

async function getWatchesByName(name, page = 1, limit = 30) {
    try {
        return await Watch.find({ name: new RegExp(name, 'i') })
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw error;
    }
}

async function getWatchesByFilters(filters, page = 1, limit = 30, sortBy = null, order = 'asc') {
    try {
        const sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'asc' ? 1 : -1;
        }
        return await Watch.find(filters)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw error;
    }
}

async function addWatch(info) {
    try {
        let watch = new Watch({ ...info })
        return await watch.save();
    } catch (error) {
        throw error;
    }
}

async function updateWatch(id, updateData) {
    try {
        return await Watch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw error;
    }
}

async function deleteWatch(id) {
    try {
        return await Watch.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getWatchById,
    getWatchesByName,
    getWatchesByFilters,
    addWatch,
    updateWatch,
    deleteWatch
}