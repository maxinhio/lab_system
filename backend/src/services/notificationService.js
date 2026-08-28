const admin = require('firebase-admin');
const pool = require('../config/db');
const fs = require('fs');

let firebaseInitialized = false;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    firebaseInitialized = true;
    console.log('Firebase initialized from JSON env');
  } catch (err) { console.warn('Failed to init Firebase from JSON env:', err.message); }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const svc = require(path);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    firebaseInitialized = true;
    console.log('Firebase initialized from service account path');
  } catch (err) { console.warn('Failed to init Firebase from path:', err.message); }
} else {
  console.log('Firebase not configured (no service account provided)');
}

async function saveEvent({ id_orden, id_paciente, title, message, payload, sent, response_text }) {
  try {
    const p = JSON.stringify(payload || {});
    await pool.execute('INSERT INTO notification_events (id_orden,id_paciente,title,message,payload,sent,response_text) VALUES (?,?,?,?,?,?,?)', [id_orden||null, id_paciente||null, title, message, p, sent?1:0, response_text||null]);
  } catch (err) { console.error('Failed to save notification event', err); }
}

async function notifyOrderCompleted(id_orden, id_paciente) {
  const title = 'LABEXPRESS-LIS';
  const message = 'Tu informe de laboratorio ya está disponible.';
  const payload = { orden: id_orden };
  // fetch tokens
  const [tokensRows] = await pool.execute('SELECT token FROM device_tokens WHERE id_paciente = ?', [id_paciente]);
  const tokens = tokensRows.map(r=>r.token).filter(Boolean);
  if (!tokens || tokens.length === 0) {
    await saveEvent({ id_orden, id_paciente, title, message, payload, sent: 0, response_text: 'no tokens' });
    return { sent: 0, reason: 'no tokens' };
  }

  if (!firebaseInitialized) {
    await saveEvent({ id_orden, id_paciente, title, message, payload, sent: 0, response_text: 'firebase not configured' });
    return { sent: 0, reason: 'firebase not configured' };
  }

  try {
    const messageObj = {
      notification: { title, body: message },
      data: { orden: String(id_orden) }
    };
    // send in batches via sendMulticast
    const MAX = 500;
    let successes = 0;
    for (let i=0;i<tokens.length;i+=MAX) {
      const chunk = tokens.slice(i,i+MAX);
      const multicast = { tokens: chunk, notification: messageObj.notification, data: messageObj.data };
      const resp = await admin.messaging().sendMulticast(multicast);
      successes += resp.successCount || 0;
    }
    await saveEvent({ id_orden, id_paciente, title, message, payload, sent: 1, response_text: `successes:${successes}` });
    return { sent: 1, successes };
  } catch (err) {
    await saveEvent({ id_orden, id_paciente, title, message, payload, sent: 0, response_text: err.message });
    return { sent: 0, error: err.message };
  }
}

module.exports = { notifyOrderCompleted };
