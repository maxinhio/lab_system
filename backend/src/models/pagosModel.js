const pool = require('../config/db');

async function create(pago, connection = null) {
  const db = connection || pool;
  const [res] = await db.execute(
    'INSERT INTO pagos (id_orden, monto, fecha_pago, metodo_pago, num_transaccion) VALUES (?,?,?,?,?)',
    [pago.id_orden, pago.monto, pago.fecha_pago || new Date(), pago.metodo_pago, pago.num_transaccion || null]
  );
  return { insertId: res.insertId };
}

async function listByOrder(id_orden) {
  const [rows] = await pool.execute('SELECT * FROM pagos WHERE id_orden = ? ORDER BY fecha_pago DESC', [id_orden]);
  return rows;
}

module.exports = { create, listByOrder };
