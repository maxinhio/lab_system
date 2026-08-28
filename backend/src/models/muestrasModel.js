const pool = require('../config/db');

async function create(muestra, connection = null) {
  const db = connection || pool;
  const [res] = await db.execute(
    'INSERT INTO muestras (id_orden, codigo_qr, tipo_muestra, estado_muestra, id_flebotomista, latitud_gps, longitud_gps, fecha_recoleccion, motivo_rechazo) VALUES (?,?,?,?,?,?,?,?,?)',
    [muestra.id_orden, muestra.codigo_qr, muestra.tipo_muestra || 'Sangre', muestra.estado_muestra || 'PENDIENTE', muestra.id_flebotomista || null, muestra.latitud_gps || null, muestra.longitud_gps || null, muestra.fecha_recoleccion || null, muestra.motivo_rechazo || null]
  );
  return { insertId: res.insertId };
}

async function countByDatePrefix(prefix, connection = null) {
  const db = connection || pool;
  const [rows] = await db.execute('SELECT COUNT(*) as cnt FROM muestras WHERE codigo_qr LIKE ?', [prefix + '%']);
  return rows[0].cnt || 0;
}

module.exports = { create, countByDatePrefix };
