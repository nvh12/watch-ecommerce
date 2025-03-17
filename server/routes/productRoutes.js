const express = require('express');
const { product } = require('../controllers/productController');

const router = express.Router();

router.get('/:id', product);

module.exports = router;