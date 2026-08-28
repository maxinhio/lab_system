const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/muestrasController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('Administrador','Recepcionista','Bioquímico','Flebotomista'), ctrl.list);
router.get('/:codigo_qr', authenticateToken, authorizeRoles('Administrador','Recepcionista','Bioquímico','Flebotomista'), ctrl.getByCodigo);
router.get('/:codigo_qr/qr', authenticateToken, authorizeRoles('Administrador','Recepcionista','Bioquímico','Flebotomista'), ctrl.getQRCode);
router.post('/:id/recoleccion', authenticateToken, authorizeRoles('Flebotomista'), ctrl.recoleccion);
router.put('/:id/estado', authenticateToken, authorizeRoles('Administrador','Bioquímico'), ctrl.updateEstado);
router.post('/:id/rechazar', authenticateToken, authorizeRoles('Flebotomista','Administrador'), ctrl.rechazar);

module.exports = router;
