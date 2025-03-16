const express = require('express');
const { order } = require('../controllers/orderController');

const router = express.Router();

router.get('/', order);

module.exports = router;