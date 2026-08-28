const pool = require('../config/db');

async function findByCodigo(codigo_qr) {
  const [rows] = await pool.execute(
    'SELECT m.*, o.id_paciente, o.id_orden FROM muestras m JOIN ordenes_analisis o ON m.id_orden = o.id_orden WHERE m.codigo_qr = ? LIMIT 1',
    [codigo_qr]
  );
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM muestras WHERE id_muestra = ? LIMIT 1', [id]);
  return rows[0];
}

async function updateById(id, fields, connection=null) {
  const db = connection || pool;
  const sets = [];
  const params = [];
  for (const k in fields) { sets.push(`${k} = ?`); params.push(fields[k]); }
  if (sets.length === 0) return null;
  params.push(id);
  const sql = `UPDATE muestras SET ${sets.join(', ')} WHERE id_muestra = ?`;
  await db.execute(sql, params);
  return true;
}

async function listAll() {
  const [rows] = await pool.execute(
    `SELECT m.*, o.id_paciente, o.monto_total, p.nombres, p.apellidos
     FROM muestras m
     JOIN ordenes_analisis o ON m.id_orden = o.id_orden
     JOIN pacientes p ON o.id_paciente = p.id_paciente
     ORDER BY m.id_muestra DESC`);
  return rows;
}

module.exports = { findByCodigo, findById, updateById, listAll };
