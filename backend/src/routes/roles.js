const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rolesController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('Administrador'), ctrl.list);

module.exports = router;
