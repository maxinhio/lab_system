const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportesController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/:ordenId/pdf', authenticateToken, ctrl.generarPdf);

module.exports = router;
