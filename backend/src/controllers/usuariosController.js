const usuarioModel = require('../models/usuarioModel');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const rows = await usuarioModel.listAll();
    return success(res, 'Usuarios listados', rows);
  } catch (err) { next(err); }
}

module.exports = { list };
