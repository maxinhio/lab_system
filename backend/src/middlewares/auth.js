const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const tokenBlacklist = require('../models/tokenBlacklistModel');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success:false, message:'Token requerido' , errors:[]});
  // check blacklist
  try {
    const black = await tokenBlacklist.isBlacklisted(token);
    if (black) return res.status(401).json({ success:false, message:'Token inválido (revocado)', errors:[]});
  } catch (e) { console.error('Blacklist check error', e); }
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ success:false, message:'Token inválido', errors:[]});
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.rol;
    if (!role) return res.status(403).json({ success:false, message:'Acceso denegado', errors:[]});
    // normalize to remove diacritics and compare case-insensitive
    const normalize = s => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
    const rnorm = normalize(role);
    const allowed = allowedRoles.map(a => normalize(a));
    if (!allowed.includes(rnorm)) return res.status(403).json({ success:false, message:'Acceso denegado', errors:[]});
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
