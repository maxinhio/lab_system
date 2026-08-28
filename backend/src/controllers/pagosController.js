const pagosModel = require('../models/pagosModel');
const { success, error } = require('../utils/response');

async function create(req, res, next) {
  try {
    const { id_orden, monto, metodo_pago, num_transaccion } = req.body;
    if (!id_orden || monto == null || !metodo_pago) return error(res, 'Campos requeridos faltantes', [], 400);
    const r = await pagosModel.create({ id_orden, monto, metodo_pago, num_transaccion });
    return success(res, 'Pago registrado', { id_pago: r.insertId }, 201);
  } catch (err) { next(err); }
}

async function listByOrder(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const rows = await pagosModel.listByOrder(id);
    return success(res, 'Pagos obtenidos', rows);
  } catch (err) { next(err); }
}

module.exports = { create, listByOrder };
