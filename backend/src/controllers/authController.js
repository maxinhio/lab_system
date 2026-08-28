const authService = require('../services/authService');
const usuarioModel = require('../models/usuarioModel');
const { success, error } = require('../utils/response');
const tokenBlacklist = require('../models/tokenBlacklistModel');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return error(res, 'username y password son requeridos', [], 400);
    const result = await authService.authenticate(username, password);
    if (!result) return error(res, 'Credenciales inválidas', [], 401);
    if (result.inactive) return error(res, 'Usuario inactivo', [], 403);
    return success(res, 'Autenticación correcta', { user: result.user, token: result.token });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const id = req.user && req.user.id_usuario;
    if (!id) return error(res, 'No autenticado', [], 401);
    const user = await usuarioModel.findById(id);
    if (!user) return error(res, 'Usuario no encontrado', [], 404);
    return success(res, 'Usuario obtenido', { user });
  } catch (err) { next(err); }
}

module.exports = { login, me };

async function logout(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return error(res, 'Token requerido', [], 401);
    // decode to get exp
    let decoded = null;
    try { decoded = jwt.decode(token); } catch (e) { /* ignore */ }
    const exp = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
    await tokenBlacklist.addToken(token, exp ? exp.toISOString().slice(0,19).replace('T',' ') : null);
    return success(res, 'Logout realizado', {});
  } catch (err) { next(err); }
}

module.exports.logout = logout;
