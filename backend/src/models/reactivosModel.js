const pool = require('../config/db');

async function create({ nombre, unidad, stock_actual, stock_minimo }) {
  const [res] = await pool.execute('INSERT INTO reactivos_insumos (nombre, unidad, stock_actual, stock_minimo) VALUES (?,?,?,?)', [nombre, unidad || null, stock_actual || 0, stock_minimo || 0]);
  return res.insertId;
}

async function listAll() {
  const [rows] = await pool.execute('SELECT * FROM reactivos_insumos ORDER BY fecha_registro DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM reactivos_insumos WHERE id_reactivo = ? LIMIT 1', [id]);
  return rows[0];
}

async function update(id, data) {
  const keys = [];
  const vals = [];
  for (const k of ['nombre','unidad','stock_actual','stock_minimo','estado']) {
    if (k in data) { keys.push(`${k} = ?`); vals.push(data[k]); }
  }
  if (keys.length === 0) return false;
  const sql = `UPDATE reactivos_insumos SET ${keys.join(', ')} WHERE id_reactivo = ?`;
  vals.push(id);
  const [res] = await pool.execute(sql, vals);
  return res.affectedRows > 0;
}

async function adjustStock(id_reactivo, delta) {
  const [res] = await pool.execute('UPDATE reactivos_insumos SET stock_actual = stock_actual + ? WHERE id_reactivo = ?', [delta, id_reactivo]);
  return res.affectedRows > 0;
}

async function lowStock(thresholdPercent=1) {
  const [rows] = await pool.execute('SELECT * FROM reactivos_insumos WHERE stock_actual <= stock_minimo');
  return rows;
}

module.exports = { create, listAll, findById, update, adjustStock, lowStock };
