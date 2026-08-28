const pool = require('../config/db');

async function all() {
  const [rows] = await pool.execute('SELECT * FROM pacientes ORDER BY fecha_registro DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM pacientes WHERE id_paciente = ? LIMIT 1', [id]);
  return rows[0];
}

async function findByDocumento(documento) {
  const [rows] = await pool.execute('SELECT * FROM pacientes WHERE numero_documento = ? LIMIT 1', [documento]);
  return rows[0];
}

async function search({ documento, nombre, apellido }) {
  let sql = 'SELECT * FROM pacientes WHERE 1=1';
  const params = [];
  if (documento) { sql += ' AND numero_documento = ?'; params.push(documento); }
  if (nombre) { sql += ' AND nombres LIKE ?'; params.push('%' + nombre + '%'); }
  if (apellido) { sql += ' AND apellidos LIKE ?'; params.push('%' + apellido + '%'); }
  sql += ' ORDER BY fecha_registro DESC';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function create(p) {
  const [result] = await pool.execute(
    `INSERT INTO pacientes (tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, genero, telefono, email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
    [p.tipo_documento, p.numero_documento, p.nombres, p.apellidos, p.fecha_nacimiento || null, p.genero || null, p.telefono || null, p.email || null]
  );
  return { insertId: result.insertId };
}

async function update(id, p) {
  await pool.execute(
    `UPDATE pacientes SET tipo_documento=?, numero_documento=?, nombres=?, apellidos=?, fecha_nacimiento=?, genero=?, telefono=?, email=? WHERE id_paciente=?`,
    [p.tipo_documento, p.numero_documento, p.nombres, p.apellidos, p.fecha_nacimiento || null, p.genero || null, p.telefono || null, p.email || null, id]
  );
  return true;
}

module.exports = { all, findById, findByDocumento, create, update };
