const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/equiposController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.post('/', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.createEquipo);
router.get('/', authenticateToken, ctrl.listEquipos);
router.get('/:id', authenticateToken, ctrl.getEquipo);
router.put('/:id', authenticateToken, authorizeRoles(['Administrador','JefeLaboratorio']), ctrl.updateEquipo);

module.exports = router;
