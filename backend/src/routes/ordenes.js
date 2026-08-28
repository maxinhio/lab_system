const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordenesController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.list);
router.get('/:id', authenticateToken, ctrl.getById);
router.post('/', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.create);

module.exports = router;
