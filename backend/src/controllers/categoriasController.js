const categoriasModel = require('../models/categoriasModel');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const rows = await categoriasModel.all();
    return success(res, 'Categorías listadas', rows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const c = await categoriasModel.findById(id);
    if (!c) return error(res, 'Categoría no encontrada', [], 404);
    return success(res, 'Categoría obtenida', c);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const body = req.body;
    if (!body.nombre_categoria) return error(res, 'nombre_categoria requerido', [], 400);
    const r = await categoriasModel.create(body);
    return success(res, 'Categoría creada', { id_categoria: r.insertId }, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const body = req.body;
    const existing = await categoriasModel.findById(id);
    if (!existing) return error(res, 'Categoría no encontrada', [], 404);
    await categoriasModel.update(id, body);
    return success(res, 'Categoría actualizada', {});
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const existing = await categoriasModel.findById(id);
    if (!existing) return error(res, 'Categoría no encontrada', [], 404);
    await categoriasModel.remove(id);
    return success(res, 'Categoría eliminada', {});
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
