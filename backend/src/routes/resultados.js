const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resultadosController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/orden/:id', authenticateToken, authorizeRoles('Administrador','Bioquímico','Analista'), ctrl.listByOrden);
router.post('/', authenticateToken, authorizeRoles('Administrador','Bioquímico','Analista'), ctrl.create);
router.put('/:id', authenticateToken, authorizeRoles('Administrador','Bioquímico','Analista'), ctrl.update);

module.exports = router;
