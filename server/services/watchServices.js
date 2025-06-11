const mongoose = require('mongoose');
const Watch = require('../models/watch');

async function getWatchByObjectId(id) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        return await Watch.findById(objectId);
    } catch (error) {
        throw error;
    }
}

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

async function countWatches(filters) {
    try {
        return await Watch.countDocuments(filters);
    } catch (error) {
        throw error;
    }
}

async function getWatchNumber() {
    try {
        return await Watch.countDocuments({});
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
        const watchId = new mongoose.Types.ObjectId(`${id}`);
        if ('sold' in updateData && updateData.sold < 0) {
            throw new Error('Sold quantity must not be smaller than 0.');
        }
        if ('stock' in updateData && updateData.stock < 0) {
            throw new Error('Stock quantity must not be smaller than 0.');
        }
        return await Watch.findOneAndUpdate(
            { _id: watchId },        
            updateData,
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
}

async function deleteWatches(ids) {
    try {
        const list = ids.map(id => new mongoose.Types.ObjectId(`${id}`));
        return await Watch.deleteMany({ _id: { $in: list } });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getWatchByObjectId,
    getWatchById,
    getWatchesByName,
    getWatchesByFilters,
    countWatches,
    getWatchNumber,
    addWatch,
    updateWatch,
    deleteWatches
}