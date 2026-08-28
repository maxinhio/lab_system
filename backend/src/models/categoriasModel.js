const pool = require('../config/db');

async function all() {
  const [rows] = await pool.execute('SELECT * FROM categorias_examen ORDER BY nombre_categoria');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM categorias_examen WHERE id_categoria = ? LIMIT 1', [id]);
  return rows[0];
}

async function create(cat) {
  const [res] = await pool.execute('INSERT INTO categorias_examen (nombre_categoria, descripcion) VALUES (?,?)', [cat.nombre_categoria, cat.descripcion]);
  return { insertId: res.insertId };
}

async function update(id, cat) {
  await pool.execute('UPDATE categorias_examen SET nombre_categoria=?, descripcion=? WHERE id_categoria=?', [cat.nombre_categoria, cat.descripcion, id]);
  return true;
}

async function remove(id) {
  await pool.execute('DELETE FROM categorias_examen WHERE id_categoria=?', [id]);
  return true;
}

module.exports = { all, findById, create, update, remove };
