const lotesModel = require('../models/lotesModel');
const { success, error } = require('../utils/response');

async function listLotes(req,res,next){ try{ const rows = await lotesModel.expired(); return success(res,'OK',rows);}catch(err){next(err);} }

module.exports = { listLotes };
