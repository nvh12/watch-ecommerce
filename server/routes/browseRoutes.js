const express = require('express');
const { browse } = require('../controllers/browseController');

const router = express.Router();

router.get('/', browse);

module.exports = router;