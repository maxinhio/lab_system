const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoriasController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, ctrl.list);
router.get('/:id', authenticateToken, ctrl.getById);
router.post('/', authenticateToken, authorizeRoles('Administrador'), ctrl.create);
router.put('/:id', authenticateToken, authorizeRoles('Administrador'), ctrl.update);
router.delete('/:id', authenticateToken, authorizeRoles('Administrador'), ctrl.remove);

module.exports = router;
