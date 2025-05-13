const express = require('express');
const { product, getNumber } = require('../controllers/productController');

const router = express.Router();

router.get('/number', getNumber);
router.get('/:id', product);

module.exports = router;