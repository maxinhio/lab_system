const pool = require('../config/db');

async function all() {
  const [rows] = await pool.execute('SELECT * FROM roles');
  return rows;
}

module.exports = { all };
