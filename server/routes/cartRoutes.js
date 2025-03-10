const express = require('react');
const { cart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart', cart);

module.exports = router;