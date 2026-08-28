const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const { logout } = require('../controllers/authController');

router.post('/login', login);
router.get('/me', authenticateToken, me);
router.post('/logout', authenticateToken, logout);

module.exports = router;
