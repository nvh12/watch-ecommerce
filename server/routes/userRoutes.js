const express =  require('express');
const { user } = require('../controllers/userController')
const { verifyUser } = require('../middleware/authMiddleware')

const router = express.Router();

router.use(verifyUser);

router.get('/', user);
module.exports = router;