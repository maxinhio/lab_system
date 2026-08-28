const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/autorizacionController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.post('/:id/autorizar', authenticateToken, authorizeRoles('Bioquímico','Analista'), ctrl.autorizarOrden);

module.exports = router;
