const reactivosModel = require('../models/reactivosModel');
const lotesModel = require('../models/lotesModel');
const { success, error } = require('../utils/response');

async function createReactivo(req, res, next) {
  try { const id = await reactivosModel.create(req.body); return success(res, 'Reactivo creado', { id }); } catch (err) { next(err); }
}

async function listReactivos(req, res, next) {
  try { const rows = await reactivosModel.listAll(); return success(res, 'OK', rows); } catch (err) { next(err); }
}

async function getReactivo(req, res, next) {
  try { const r = await reactivosModel.findById(req.params.id); if (!r) return error(res, 'Reactivo no encontrado', [], 404); return success(res, 'OK', r); } catch (err) { next(err); }
}

async function updateReactivo(req, res, next) {
  try { const ok = await reactivosModel.update(req.params.id, req.body); if (!ok) return error(res, 'Nada actualizado', [], 400); return success(res, 'Reactivo actualizado', {}); } catch (err) { next(err); }
}

// lotes
async function createLote(req, res, next) {
  try {
    const payload = { id_reactivo: req.body.id_reactivo, codigo_lote: req.body.codigo_lote, fecha_vencimiento: req.body.fecha_vencimiento, cantidad: req.body.cantidad };
    const id = await lotesModel.create(payload);
    // increase stock_actual
    await reactivosModel.adjustStock(payload.id_reactivo, Number(payload.cantidad) || 0);
    return success(res, 'Lote creado', { id });
  } catch (err) { next(err); }
}

async function listLotesByReactivo(req, res, next) {
  try { const rows = await lotesModel.listByReactivo(req.params.id_reactivo); return success(res, 'OK', rows); } catch (err) { next(err); }
}

async function getLote(req, res, next) { try { const l = await lotesModel.findById(req.params.id); if (!l) return error(res,'Lote no encontrado',[],404); return success(res,'OK',l);} catch(err){next(err);} }

async function updateLote(req,res,next){ try{ const ok = await lotesModel.update(req.params.id, req.body); if(!ok) return error(res,'Nada actualizado',[],400); return success(res,'Lote actualizado',{}); }catch(err){next(err);} }

async function alerts(req,res,next){
  try{
    const low = await reactivosModel.lowStock();
    const near = await lotesModel.nearingExpiry(30);
    const exp = await lotesModel.expired();
    return success(res,'OK',{ lowStock: low, nearExpiry: near, expired: exp });
  } catch(err){ next(err); }
}

module.exports = { createReactivo, listReactivos, getReactivo, updateReactivo, createLote, listLotesByReactivo, getLote, updateLote, alerts };
