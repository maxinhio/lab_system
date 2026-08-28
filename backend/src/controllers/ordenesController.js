const ordenService = require('../services/ordenService');
const { success, error } = require('../utils/response');
const pool = require('../config/db');

async function create(req, res, next) {
  try {
    const { id_paciente, examenes, metodo_pago, num_transaccion } = req.body;
    if (!id_paciente || !examenes) return error(res, 'id_paciente y examenes son requeridos', [], 400);
    const id_usuario_recepcion = req.user && req.user.id_usuario;
    const result = await ordenService.createOrder({ id_paciente, examenes, metodo_pago, num_transaccion, id_usuario_recepcion });
    return success(res, 'Orden creada', result, 201);
  } catch (err) { next(err); }
}

async function list(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM ordenes_analisis ORDER BY fecha_creacion DESC');
    return success(res, 'Órdenes listadas', rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const [rows] = await pool.execute('SELECT * FROM ordenes_analisis WHERE id_orden = ? LIMIT 1', [id]);
    const orden = rows[0];
    if (!orden) return error(res, 'Orden no encontrada', [], 404);
    // authorization: if patient, ensure ownership
    const user = req.user || {};
    if (user.rol === 'Paciente') {
      const usuarioModel = require('../models/usuarioModel');
      const u = await usuarioModel.findById(user.id_usuario);
      const idPacienteUsuario = u && u.id_paciente ? u.id_paciente : null;
      if (!idPacienteUsuario || idPacienteUsuario !== orden.id_paciente) return error(res, 'Acceso denegado', [], 403);
    }
    return success(res, 'Orden obtenida', orden);
  } catch (err) { next(err); }
}

module.exports = { create, list, getById };
