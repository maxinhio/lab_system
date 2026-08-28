const deviceTokensModel = require('../models/deviceTokensModel');
const { success, error } = require('../utils/response');

async function registerToken(req, res, next) {
  try {
    const { token, plataforma, id_paciente } = req.body;
    if (!token) return error(res, 'token requerido', [], 400);
    // associate with authenticated patient if available
    let pid = id_paciente || null;
    if (!pid && req.user && req.user.id_usuario) {
      // try to read id_paciente from usuarios table via user
      const pool = require('../config/db');
      const [rows] = await pool.execute('SELECT id_paciente FROM usuarios WHERE id_usuario = ? LIMIT 1', [req.user.id_usuario]);
      if (rows[0] && rows[0].id_paciente) pid = rows[0].id_paciente;
    }
    await deviceTokensModel.createToken({ id_paciente: pid, token, plataforma });
    return success(res, 'Token registrado', {});
  } catch (err) { next(err); }
}

module.exports = { registerToken };
