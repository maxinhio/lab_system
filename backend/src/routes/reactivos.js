const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reactivosController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.post('/', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.createReactivo);
router.get('/', authenticateToken, ctrl.listReactivos);
router.get('/alerts', authenticateToken, ctrl.alerts);
router.get('/:id', authenticateToken, ctrl.getReactivo);
router.put('/:id', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.updateReactivo);

// lotes endpoints
router.post('/lotes', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.createLote);
router.get('/:id_reactivo/lotes', authenticateToken, ctrl.listLotesByReactivo);
router.get('/lote/:id', authenticateToken, ctrl.getLote);
router.put('/lote/:id', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.updateLote);

module.exports = router;
