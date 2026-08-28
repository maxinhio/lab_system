const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/deviceTokensController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/', authenticateToken, ctrl.registerToken);

module.exports = router;
