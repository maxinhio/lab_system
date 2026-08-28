const pool = require('../config/db');

async function createToken({ id_paciente, token, plataforma }) {
  try {
    const [res] = await pool.execute('INSERT INTO device_tokens (id_paciente, token, plataforma) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_paciente = VALUES(id_paciente), plataforma = VALUES(plataforma), fecha_registro = CURRENT_TIMESTAMP', [id_paciente || null, token, plataforma || 'android']);
    return res.insertId || null;
  } catch (err) { throw err; }
}

async function findByToken(token) {
  const [rows] = await pool.execute('SELECT * FROM device_tokens WHERE token = ? LIMIT 1', [token]);
  return rows[0];
}

async function listByPaciente(id_paciente) {
  const [rows] = await pool.execute('SELECT * FROM device_tokens WHERE id_paciente = ?', [id_paciente]);
  return rows;
}

module.exports = { createToken, findByToken, listByPaciente };
