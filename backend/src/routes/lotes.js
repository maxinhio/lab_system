const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lotesController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/expired', authenticateToken, ctrl.listLotes);

module.exports = router;
