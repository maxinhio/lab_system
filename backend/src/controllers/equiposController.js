const equiposModel = require('../models/equiposModel');
const { success, error } = require('../utils/response');

async function createEquipo(req, res, next) {
  try {
    const id = await equiposModel.create(req.body);
    return success(res, 'Equipo creado', { id });
  } catch (err) { next(err); }
}

async function listEquipos(req, res, next) {
  try { const rows = await equiposModel.listAll(); return success(res, 'OK', rows); } catch (err) { next(err); }
}

async function getEquipo(req, res, next) {
  try { const e = await equiposModel.findById(req.params.id); if (!e) return error(res, 'Equipo no encontrado', [], 404); return success(res, 'OK', e); } catch (err) { next(err); }
}

async function updateEquipo(req, res, next) {
  try { const ok = await equiposModel.update(req.params.id, req.body); if (!ok) return error(res, 'Nada actualizado', [], 400); return success(res, 'Equipo actualizado', {}); } catch (err) { next(err); }
}

module.exports = { createEquipo, listEquipos, getEquipo, updateEquipo };
