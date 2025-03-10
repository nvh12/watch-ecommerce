const express = require('express');
const checkout = require('../controllers/checkoutController');

const router = express.Router();

router.get('/checkout', checkout);

module.exports = router;