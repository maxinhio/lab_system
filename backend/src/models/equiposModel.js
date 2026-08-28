const pool = require('../config/db');

async function create(e) {
  const sql = 'INSERT INTO equipos_laboratorio (nombre, marca, modelo, serial, ubicacion, estado, ultima_calibracion) VALUES (?,?,?,?,?,?,?)';
  const params = [e.nombre, e.marca, e.modelo, e.serial, e.ubicacion, e.estado || 'Activo', e.ultima_calibracion || null];
  const [res] = await pool.execute(sql, params);
  return res.insertId;
}

async function listAll() {
  const [rows] = await pool.execute('SELECT * FROM equipos_laboratorio ORDER BY fecha_registro DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM equipos_laboratorio WHERE id_equipo = ? LIMIT 1', [id]);
  return rows[0];
}

async function update(id, data) {
  const keys = [];
  const vals = [];
  for (const k of ['nombre','marca','modelo','serial','ubicacion','estado','ultima_calibracion']) {
    if (k in data) { keys.push(`${k} = ?`); vals.push(data[k]); }
  }
  if (keys.length === 0) return false;
  const sql = `UPDATE equipos_laboratorio SET ${keys.join(', ')} WHERE id_equipo = ?`;
  vals.push(id);
  const [res] = await pool.execute(sql, vals);
  return res.affectedRows > 0;
}

module.exports = { create, listAll, findById, update };
