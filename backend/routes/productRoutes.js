const express = require('express');
const { product, getRecommendations, getNumber } = require('../controllers/productController');

const router = express.Router();

router.get('/number', getNumber);
router.get('/:id', product);
router.get('/:id/recommendations', getRecommendations);

module.exports = router;