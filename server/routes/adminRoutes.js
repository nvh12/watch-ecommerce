const express = require('express');
const { admin } = require('../controllers/adminController');

const router = express.Router();

router.get('/', admin);

module.exports = router;
