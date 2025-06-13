const express = require('express');
const { register, login, refresh, logout, status, getResetCode, reset } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/status', status);
router.post('/code', getResetCode);
router.post('/reset', reset);

module.exports = router;