const pool = require('../config/db');
const resultadosModel = require('../models/resultadosModel');
const { success, error } = require('../utils/response');

async function listByOrden(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    if (isNaN(id)) return error(res, 'ID inválido', [], 400);
    // order
    const [orders] = await pool.execute('SELECT o.*, p.nombres, p.apellidos FROM ordenes_analisis o JOIN pacientes p ON o.id_paciente = p.id_paciente WHERE o.id_orden = ? LIMIT 1', [id]);
    const orden = orders[0];
    if (!orden) return error(res, 'Orden no encontrada', [], 404);
    // detalle orden
    const [detalle] = await pool.execute('SELECT d.*, e.nombre_examen FROM detalle_orden d JOIN examenes e ON d.id_examen = e.id_examen WHERE d.id_orden = ?', [id]);
    // muestras
    const [muestras] = await pool.execute('SELECT * FROM muestras WHERE id_orden = ?', [id]);
    // resultados
    const resultados = await resultadosModel.listByOrden(id);
    return success(res, 'Datos de orden para resultados', { orden, detalle, muestras, resultados });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    // accept single or array
    const payload = req.body;
    if (!payload) return error(res, 'Payload requerido', [], 400);
    const entries = Array.isArray(payload) ? payload : [payload];
    const created = [];
    for (const item of entries) {
      const { id_orden, id_muestra, nombre_parametro, valor_hallado, unidad_medida } = item;
      if (!id_orden || !id_muestra || !nombre_parametro || (typeof valor_hallado === 'undefined' || valor_hallado === null)) return error(res, 'Faltan campos en resultado', [], 400);
      // validate order and muestra
      const [oRows] = await pool.execute('SELECT * FROM ordenes_analisis WHERE id_orden = ? LIMIT 1', [id_orden]);
      if (!oRows[0]) return error(res, 'Orden no encontrada', [], 404);
      const [mRows] = await pool.execute('SELECT * FROM muestras WHERE id_muestra = ? LIMIT 1', [id_muestra]);
      if (!mRows[0]) return error(res, 'Muestra no encontrada', [], 404);
      // only roles Bioquímico/Analista allowed (normalize accents/case)
      const normalize = s => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
      const rol = req.user && req.user.rol;
      const allowed = ['Bioquímico','Analista'].map(a => normalize(a));
      if (!rol || !allowed.includes(normalize(rol))) return error(res, 'No autorizado', [], 403);
      // get empleado id for current user if available
      const [uRows] = await pool.execute('SELECT id_empleado FROM usuarios WHERE id_usuario = ? LIMIT 1', [req.user.id_usuario]);
      const id_bio = (uRows[0] && uRows[0].id_empleado) ? uRows[0].id_empleado : null;
      const id_resultado = await resultadosModel.create({ id_orden, id_muestra, nombre_parametro, valor_hallado: String(valor_hallado), unidad_medida, id_bioquimico: id_bio, autorizado: 0 });
      created.push(id_resultado);
    }
    return success(res, 'Resultados creados', { ids: created }, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    if (isNaN(id)) return error(res, 'ID inválido', [], 400);
    const body = req.body;
    const r = await resultadosModel.findById(id);
    if (!r) return error(res, 'Resultado no encontrado', [], 404);
    // permissions
    const normalize = s => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
    const rol = req.user && req.user.rol;
    const allowed = ['Bioquímico','Analista'].map(a => normalize(a));
    if (!rol || !allowed.includes(normalize(rol))) return error(res, 'No autorizado', [], 403);
    // check order state
    const [oRows] = await pool.execute('SELECT estado_orden FROM ordenes_analisis WHERE id_orden = ? LIMIT 1', [r.id_orden]);
    const estado = oRows[0] && oRows[0].estado_orden;
    // if order completed, require motivo and only allow admin to change? enforce audit
    const changingValor = (typeof body.valor_hallado !== 'undefined' && String(body.valor_hallado) !== String(r.valor_hallado));
    if (estado === 'COMPLETADA' && changingValor) {
      // require motivo and only Administrador can perform modification
      if (req.user && req.user.rol !== 'Administrador') return error(res, 'Orden completada: modificación restringida', [], 403);
      if (!body.motivo) return error(res, 'motivo requerido para modificación en orden completada', [], 422);
    }
    // if valor changed, insert into historial
    if (changingValor) {
      const motivo = body.motivo || null;
      await pool.execute('INSERT INTO historial_resultados (id_resultado,id_usuario,valor_anterior,valor_nuevo,motivo) VALUES (?,?,?,?,?)', [id, req.user.id_usuario, r.valor_hallado, String(body.valor_hallado), motivo]);
    }
    // update allowed fields: valor_hallado, unidad_medida, autorizado
    const fields = {};
    if (typeof body.valor_hallado !== 'undefined') fields.valor_hallado = String(body.valor_hallado);
    if (typeof body.unidad_medida !== 'undefined') fields.unidad_medida = body.unidad_medida;
    if (typeof body.autorizado !== 'undefined') fields.autorizado = body.autorizado?1:0;
    await resultadosModel.updateById(id, fields);
    return success(res, 'Resultado actualizado', {});
  } catch (err) { next(err); }
}

module.exports = { listByOrden, create, update };
