const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/examenesController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, ctrl.list);
router.post('/', authenticateToken, authorizeRoles('Administrador'), ctrl.create);
router.put('/:id', authenticateToken, authorizeRoles('Administrador'), ctrl.update);

module.exports = router;
