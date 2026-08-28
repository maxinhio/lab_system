const pool = require('../config/db');

async function all() {
  const [rows] = await pool.execute('SELECT e.*, c.nombre_categoria FROM examenes e JOIN categorias_examen c ON e.id_categoria = c.id_categoria');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM examenes WHERE id_examen = ? LIMIT 1', [id]);
  return rows[0];
}

async function create(ex) {
  const [result] = await pool.execute(
    'INSERT INTO examenes (id_categoria, nombre_examen, descripcion, precio, estado) VALUES (?,?,?,?,?)',
    [ex.id_categoria, ex.nombre_examen, ex.descripcion, ex.precio, ex.estado || 'Activo']
  );
  return { insertId: result.insertId };
}

async function update(id, ex) {
  await pool.execute(
    'UPDATE examenes SET id_categoria=?, nombre_examen=?, descripcion=?, precio=?, estado=? WHERE id_examen=?',
    [ex.id_categoria, ex.nombre_examen, ex.descripcion, ex.precio, ex.estado, id]
  );
  return true;
}

module.exports = { all, findById, create, update };
