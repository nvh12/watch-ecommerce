const express = require('express');
const { browse, filter } = require('../controllers/browseController');

const router = express.Router();

router.get('/', browse);
router.get('/filter', filter);

module.exports = router;