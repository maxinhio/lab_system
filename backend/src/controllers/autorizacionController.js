const pool = require('../config/db');
const { success, error } = require('../utils/response');

async function autorizarOrden(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    if (isNaN(id)) return error(res, 'ID inválido', [], 400);
    // role check already via middleware
    // verify order
    const [oRows] = await pool.execute('SELECT * FROM ordenes_analisis WHERE id_orden = ? LIMIT 1', [id]);
    const orden = oRows[0];
    if (!orden) return error(res, 'Orden no encontrada', [], 404);
    // verify muestras
    const [mRows] = await pool.execute('SELECT * FROM muestras WHERE id_orden = ?', [id]);
    if (!mRows || mRows.length === 0) return error(res, 'No hay muestras asociadas a la orden', [], 422);
    // verify resultados
    const [rRows] = await pool.execute('SELECT * FROM resultados_detalle WHERE id_orden = ?', [id]);
    if (!rRows || rRows.length === 0) return error(res, 'No hay resultados registrados para la orden', [], 422);
    // basic check: no resultados with valor_hallado = "--" or empty
    for (const rr of rRows) {
      if (rr.valor_hallado === null || rr.valor_hallado === '' || rr.valor_hallado === '--') return error(res, 'Resultados incompletos o con errores', [], 422);
    }
    // record authorization
    await pool.execute('INSERT INTO autorizaciones (id_orden,id_usuario,fecha_autorizacion,estado) VALUES (?,?,NOW(),?)', [id, req.user.id_usuario, 'AUTORIZADA']);
    // mark resultados as autorizado
    await pool.execute('UPDATE resultados_detalle SET autorizado = 1 WHERE id_orden = ?', [id]);
    return success(res, 'Orden autorizada', {});
  } catch (err) { next(err); }
}

module.exports = { autorizarOrden };
