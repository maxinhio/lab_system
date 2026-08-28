const rolesModel = require('../models/rolesModel');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const rows = await rolesModel.all();
    return success(res, 'Roles listados', rows);
  } catch (err) { next(err); }
}

module.exports = { list };
