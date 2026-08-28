const pool = require('../config/db');

async function create({ id_reactivo, codigo_lote, fecha_vencimiento, cantidad }) {
  const [res] = await pool.execute('INSERT INTO lotes_reactivos (id_reactivo, codigo_lote, fecha_vencimiento, cantidad) VALUES (?,?,?,?)', [id_reactivo, codigo_lote, fecha_vencimiento || null, cantidad || 0]);
  return res.insertId;
}

async function listByReactivo(id_reactivo) {
  const [rows] = await pool.execute('SELECT * FROM lotes_reactivos WHERE id_reactivo = ? ORDER BY fecha_vencimiento ASC', [id_reactivo]);
  return rows;
}

async function findById(id_lote) {
  const [rows] = await pool.execute('SELECT * FROM lotes_reactivos WHERE id_lote = ? LIMIT 1', [id_lote]);
  return rows[0];
}

async function update(id_lote, data) {
  const keys = [];
  const vals = [];
  for (const k of ['codigo_lote','fecha_vencimiento','cantidad','estado']) {
    if (k in data) { keys.push(`${k} = ?`); vals.push(data[k]); }
  }
  if (keys.length === 0) return false;
  const sql = `UPDATE lotes_reactivos SET ${keys.join(', ')} WHERE id_lote = ?`;
  vals.push(id_lote);
  const [res] = await pool.execute(sql, vals);
  return res.affectedRows > 0;
}

async function nearingExpiry(days=30) {
  const [rows] = await pool.execute('SELECT * FROM lotes_reactivos WHERE fecha_vencimiento IS NOT NULL AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL ? DAY) AND fecha_vencimiento >= CURDATE()', [days]);
  return rows;
}

async function expired() {
  const [rows] = await pool.execute('SELECT * FROM lotes_reactivos WHERE fecha_vencimiento < CURDATE()');
  return rows;
}

module.exports = { create, listByReactivo, findById, update, nearingExpiry, expired };
