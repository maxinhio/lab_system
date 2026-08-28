const pool = require('../config/db');

async function findByUsername(username) {
  const [rows] = await pool.execute(
    'SELECT u.id_usuario,u.username,u.password_hash,u.activo,u.id_rol,u.id_paciente,u.id_empleado,r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.username = ? LIMIT 1',
    [username]
  );
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id_usuario,username,id_rol,activo,id_empleado,id_paciente FROM usuarios WHERE id_usuario = ? LIMIT 1', [id]);
  return rows[0];
}

async function listAll() {
  const [rows] = await pool.execute('SELECT u.id_usuario,u.username,u.activo,u.id_rol,r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol');
  return rows;
}

module.exports = { findByUsername, findById };
