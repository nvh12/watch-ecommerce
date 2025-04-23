const express = require('express');
const { addProduct, updateProduct, deleteProducts, getOrders, updateOrder } = require('../controllers/adminController');
const { verifyRole, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'));

router.post('/product', addProduct);
router.put('/product/:id', updateProduct);
router.delete('/product', deleteProducts);
router.get('/order', getOrders);
router.put('/order/:id', updateOrder);

module.exports = router;
