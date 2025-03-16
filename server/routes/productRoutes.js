const express = require('express');
const { product } = requite('../controllers/productController');

const router = express.Router();

router.get('/', product);

module.exports = router;