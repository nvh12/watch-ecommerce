const express =  require('express');
const { user } = require('../controllers/userController')

const router = express.Router();

router.get('/user', user);
module.exports = router;