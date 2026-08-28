const examenModel = require('../models/examenModel');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const rows = await examenModel.all();
    return success(res, 'Exámenes listados', rows);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const body = req.body;
    if (!body.id_categoria || !body.nombre_examen || body.precio == null) return error(res, 'Campos obligatorios faltan', [], 400);
    if (Number(body.precio) < 0) return error(res, 'El precio debe ser >= 0', [], 422);
    const r = await examenModel.create(body);
    return success(res, 'Examen creado', { id_examen: r.insertId }, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const body = req.body;
    const existing = await examenModel.findById(id);
    if (!existing) return error(res, 'Examen no encontrado', [], 404);
    if (body.precio != null && Number(body.precio) < 0) return error(res, 'El precio debe ser >= 0', [], 422);
    await examenModel.update(id, body);
    return success(res, 'Examen actualizado', {});
  } catch (err) { next(err); }
}

module.exports = { list, create, update };
