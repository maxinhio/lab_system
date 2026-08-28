const pacienteModel = require('../models/pacienteModel');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const rows = await pacienteModel.all();
    return success(res, 'Pacientes listados', rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const p = await pacienteModel.findById(id);
    if (!p) return error(res, 'Paciente no encontrado', [], 404);
    // If requester is patient, ensure ownership
    if (req.user && req.user.rol === 'Paciente') {
      const usuarioModel = require('../models/usuarioModel');
      const u = await usuarioModel.findById(req.user.id_usuario);
      const idPacienteUsuario = u && u.id_paciente ? u.id_paciente : null;
      if (!idPacienteUsuario || idPacienteUsuario !== p.id_paciente) return error(res, 'Acceso denegado', [], 403);
    }
    return success(res, 'Paciente obtenido', p);
  } catch (err) { next(err); }
}

async function getByDocumento(req, res, next) {
  try {
    const doc = req.params.documento;
    const p = await pacienteModel.findByDocumento(doc);
    if (!p) return error(res, 'Paciente no encontrado', [], 404);
    return success(res, 'Paciente obtenido', p);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const body = req.body;
    if (!body.numero_documento || !body.nombres || !body.apellidos) return error(res, 'Campos obligatorios faltantes', [], 400);
    const existing = await pacienteModel.findByDocumento(body.numero_documento);
    if (existing) return error(res, 'Paciente ya existe', [], 409);
    const r = await pacienteModel.create(body);
    return success(res, 'Paciente creado', { id_paciente: r.insertId }, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const body = req.body;
    const existing = await pacienteModel.findById(id);
    if (!existing) return error(res, 'Paciente no encontrado', [], 404);
    // Prevent duplicate numero_documento
    if (body.numero_documento) {
      const bydoc = await pacienteModel.findByDocumento(body.numero_documento);
      if (bydoc && bydoc.id_paciente !== id) return error(res, 'Número de documento ya registrado', [], 409);
    }
    await pacienteModel.update(id, body);
    return success(res, 'Paciente actualizado', {});
  } catch (err) { next(err); }
}

module.exports = { list, getById, getByDocumento, create, update };

