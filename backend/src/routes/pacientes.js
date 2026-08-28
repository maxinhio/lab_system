const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pacientesController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.list);
router.get('/search', authenticateToken, authorizeRoles('Administrador','Recepcionista'), async (req,res,next)=>{
	try{
		const { documento, nombre, apellido } = req.query;
		const rows = await require('../models/pacienteModel').search({ documento, nombre, apellido });
		return res.json({ success:true, message:'Búsqueda de pacientes', data: rows });
	}catch(err){ next(err); }
});
router.get('/:id', authenticateToken, ctrl.getById);
router.get('/documento/:documento', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.getByDocumento);
router.post('/', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.create);
router.put('/:id', authenticateToken, authorizeRoles('Administrador','Recepcionista'), ctrl.update);

module.exports = router;
