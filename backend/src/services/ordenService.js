const pool = require('../config/db');
const pacienteModel = require('../models/pacienteModel');
const examenModel = require('../models/examenModel');
const pagosModel = require('../models/pagosModel');
const muestrasModel = require('../models/muestrasModel');

function pad(n, width=4) { return n.toString().padStart(width,'0'); }

async function generateCodigoQR(connection) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  const prefix = `MUE-${yyyy}${mm}${dd}-`;
  const cnt = await muestrasModel.countByDatePrefix(prefix, connection);
  const seq = pad(cnt + 1, 4);
  return prefix + seq;
}

async function createOrder({ id_paciente, examenes, metodo_pago, num_transaccion, id_usuario_recepcion }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // validate paciente
    const paciente = await pacienteModel.findById(id_paciente);
    if (!paciente) throw { status: 404, message: 'Paciente no encontrado' };

    // validate examenes and collect prices
    if (!Array.isArray(examenes) || examenes.length === 0) throw { status: 400, message: 'La orden debe contener al menos un examen' };
    const examRows = [];
    for (const id_ex of examenes) {
      const ex = await examenModel.findById(id_ex);
      if (!ex) throw { status: 404, message: `Examen ${id_ex} no encontrado` };
      if (ex.estado !== 'Activo') throw { status: 422, message: `Examen ${ex.nombre_examen} no está activo` };
      examRows.push(ex);
    }

    // create order (monto_total temporarily 0)
    const [ordRes] = await connection.execute(
      'INSERT INTO ordenes_analisis (id_paciente, id_usuario_recepcion, monto_total, estado_orden) VALUES (?,?,?,?)',
      [id_paciente, id_usuario_recepcion || null, 0.00, 'PENDIENTE']
    );
    const id_orden = ordRes.insertId;

    // insert detalle_orden with historic price
    let total = 0;
    for (const ex of examRows) {
      const precio = Number(ex.precio) || 0;
      total += precio;
      await connection.execute('INSERT INTO detalle_orden (id_orden, id_examen, precio_unitario) VALUES (?,?,?)', [id_orden, ex.id_examen, precio]);
    }

    // update order total
    await connection.execute('UPDATE ordenes_analisis SET monto_total = ? WHERE id_orden = ?', [total, id_orden]);

    // register payment
    const pago = { id_orden, monto: total, metodo_pago, num_transaccion, fecha_pago: new Date() };
    const pagoRes = await pagosModel.create(pago, connection);

    // create muestras (one per order for now)
    const codigo_qr = await generateCodigoQR(connection);
    await muestrasModel.create({ id_orden, codigo_qr, tipo_muestra: 'Sangre', estado_muestra: 'PENDIENTE' }, connection);

    await connection.commit();
    connection.release();
    return { id_orden, total, pagoId: pagoRes.insertId, codigo_qr };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
}

module.exports = { createOrder };
