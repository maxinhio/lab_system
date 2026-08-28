const pool = require('../config/db');

async function create(resultado, connection=null) {
  const db = connection || pool;
  const sql = `INSERT INTO resultados_detalle (id_orden,id_muestra,nombre_parametro,valor_hallado,unidad_medida,id_bioquimico,autorizado) VALUES (?,?,?,?,?,?,?)`;
  const params = [resultado.id_orden, resultado.id_muestra, resultado.nombre_parametro, resultado.valor_hallado, resultado.unidad_medida || null, resultado.id_bioquimico || null, resultado.autorizado?1:0];
  const [res] = await db.execute(sql, params);
  return res.insertId;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM resultados_detalle WHERE id_resultado = ? LIMIT 1', [id]);
  return rows[0];
}

async function listByOrden(id_orden) {
  const [rows] = await pool.execute(
    `SELECT r.*, p.nombres, p.apellidos, m.codigo_qr
     FROM resultados_detalle r
     LEFT JOIN ordenes_analisis o ON r.id_orden = o.id_orden
     LEFT JOIN pacientes p ON o.id_paciente = p.id_paciente
     LEFT JOIN muestras m ON r.id_muestra = m.id_muestra
     WHERE r.id_orden = ?`, [id_orden]
  );
  return rows;
}

async function updateById(id, fields) {
  const sets = [];
  const params = [];
  for (const k in fields) { sets.push(`${k} = ?`); params.push(fields[k]); }
  if (sets.length === 0) return null;
  params.push(id);
  const sql = `UPDATE resultados_detalle SET ${sets.join(', ')} WHERE id_resultado = ?`;
  await pool.execute(sql, params);
  return true;
}

module.exports = { create, findById, listByOrden, updateById };
