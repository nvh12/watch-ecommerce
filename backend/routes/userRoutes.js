const express =  require('express');
const { user, userOrders, singleOrder, updateUser } = require('../controllers/userController')
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', user);
router.get('/order', userOrders);
router.get('/order/:id', singleOrder);
router.put('/update', updateUser);

module.exports = router;