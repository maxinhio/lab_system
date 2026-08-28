const pool = require('../config/db');

async function addToken(token, expiresAt) {
  await pool.execute('INSERT INTO token_blacklist (token, expires_at) VALUES (?,?)', [token, expiresAt || null]);
}

async function isBlacklisted(token) {
  const [rows] = await pool.execute('SELECT id FROM token_blacklist WHERE token = ? LIMIT 1', [token]);
  return rows.length > 0;
}

module.exports = { addToken, isBlacklisted };
