const muestrasModel = require('../models/muestrasModelExtra');
const muestrasModelBase = require('../models/muestrasModel');
const { success, error } = require('../utils/response');
const QRCode = require('qrcode');

async function list(req, res, next) {
  try {
    const rows = await muestrasModel.listAll();
    return success(res, 'Muestras listadas', rows);
  } catch (err) { next(err); }
}

async function getByCodigo(req, res, next) {
  try {
    const codigo = req.params.codigo_qr;
    const m = await muestrasModel.findByCodigo(codigo);
    if (!m) return error(res, 'Muestra no encontrada', [], 404);
    return success(res, 'Muestra obtenida', m);
  } catch (err) { next(err); }
}

async function getQRCode(req, res, next) {
  try {
    const codigo = req.params.codigo_qr;
    const m = await muestrasModel.findByCodigo(codigo);
    if (!m) return error(res, 'Muestra no encontrada', [], 404);
    const data = `MUE-CODE:${codigo}`; // minimal payload
    const dataUrl = await QRCode.toDataURL(data);
    return success(res, 'QR generado', { dataUrl });
  } catch (err) { next(err); }
}

async function recoleccion(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const body = req.body;
    // find by id or codigo
    let m = null;
    if (isNaN(id)) {
      m = await muestrasModel.findByCodigo(req.params.id);
    } else {
      m = await muestrasModel.findById(id);
    }
    if (!m) return error(res, 'Muestra no encontrada', [], 404);

    const { codigo_qr, latitud, longitud, fecha_hora } = body;
    const lat = parseFloat(latitud);
    const lon = parseFloat(longitud);
    if (lat < -90 || lat > 90) return error(res, 'Latitud inválida', [], 422);
    if (lon < -180 || lon > 180) return error(res, 'Longitud inválida', [], 422);

    const id_flebotomista = req.user && req.user.id_usuario;
    await muestrasModel.updateById(m.id_muestra, { estado_muestra: 'RECOLECTADA_EN_CAMPO', latitud_gps: lat, longitud_gps: lon, fecha_recoleccion: fecha_hora || new Date(), id_flebotomista });
    return success(res, 'Recolección registrada', {});
  } catch (err) { next(err); }
}

async function updateEstado(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const { estado } = req.body;
    const allowed = ['PENDIENTE','RECOLECTADA_EN_CAMPO','RECIBIDA_EN_LAB','PROCESADA','RECHAZADA'];
    if (!allowed.includes(estado)) return error(res, 'Estado inválido', [], 422);
    const m = await muestrasModel.findById(id);
    if (!m) return error(res, 'Muestra no encontrada', [], 404);
    await muestrasModel.updateById(id, { estado_muestra: estado });
    return success(res, 'Estado actualizado', {});
  } catch (err) { next(err); }
}

async function rechazar(req, res, next) {
  try {
    const id = parseInt(req.params.id,10);
    const { motivo } = req.body;
    if (!motivo) return error(res, 'motivo_rechazo requerido', [], 422);
    const m = await muestrasModel.findById(id);
    if (!m) return error(res, 'Muestra no encontrada', [], 404);
    await muestrasModel.updateById(id, { estado_muestra: 'RECHAZADA', motivo_rechazo: motivo });
    return success(res, 'Muestra rechazada', {});
  } catch (err) { next(err); }
}

module.exports = { list, getByCodigo, getQRCode, recoleccion, updateEstado, rechazar };
