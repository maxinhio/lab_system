const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pagosController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.post('/', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.create);
router.get('/orden/:id', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.listByOrder);

module.exports = router;
