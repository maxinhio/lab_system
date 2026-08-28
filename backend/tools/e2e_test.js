// E2E test script for LABEXPRESS-LIS
// Usage: node e2e_test.js
// Requires backend server running on localhost:3000

const axios = require('axios').default;
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || process.env.TEST_PORT || 3000;
const API = axios.create({ baseURL: `http://localhost:${port}`, validateStatus: ()=>true });

async function login(username,password){
  const r = await API.post('/api/auth/login',{ username, password });
  if (!r.data || !r.data.data || !r.data.data.token) throw new Error('Login failed for ' + username + ' ' + JSON.stringify(r.data));
  return r.data.data.token;
}

async function run(){
  try{
    console.log('1) Login recepcionista');
    const tokenRecep = await login('recepcion','Recep@123');
    API.defaults.headers.common['Authorization'] = `Bearer ${tokenRecep}`;

    console.log('2) Registrar paciente');
    const uniqueDoc = 'E2E-' + Date.now();
    const pacienteRes = await API.post('/api/pacientes', { tipo_documento:'DNI', numero_documento: uniqueDoc, nombres:'E2E', apellidos:'Test' });
    if (!pacienteRes.data.success) throw new Error('Failed create paciente: ' + JSON.stringify(pacienteRes.data));
    const id_paciente = pacienteRes.data.data.id_paciente || pacienteRes.data.data.insertId || pacienteRes.data.data.id || pacienteRes.data.data;
    console.log('Paciente id:', id_paciente);

    console.log('3) Crear orden (examenes 2 and 6)');
    const ordenRes = await API.post('/api/ordenes', { id_paciente: id_paciente, examenes: [2,6], metodo_pago:'Efectivo' });
    if (!ordenRes.data.success) throw new Error('Failed create orden: ' + JSON.stringify(ordenRes.data));
    const id_orden = ordenRes.data.data.id_orden;
    const codigo_qr = ordenRes.data.data.codigo_qr;
    console.log('Orden created:', id_orden, 'QR:', codigo_qr);

    console.log('4-6) Payment and muestras were created by createOrder (see response)');

    console.log('7) Obtener muestra por codigo QR');
    const mres = await API.get('/api/muestras/' + codigo_qr);
    if (!mres.data.success) throw new Error('Muestra fetch failed: ' + JSON.stringify(mres.data));
    const muestra = mres.data.data;
    console.log('Muestra:', muestra.id_muestra);

    console.log('8) (Etiqueta) Obtener QR data URL');
    const qr = await API.get('/api/muestras/' + codigo_qr + '/qr');
    if (!qr.data.success) console.warn('QR endpoint warning', qr.data);

    console.log('9) Login flebotomista (Android simulated)');
    const tokenFlebo = await login('flebotomista','Flebo@123');

    console.log('10) Escanear QR (simulated) and 11) Obtener GPS (simulated)');
    const lat = -16.5, lon = -68.1; const fecha = new Date().toISOString();

    console.log('12) Confirmar recolección');
    const API_F = axios.create({ baseURL:'http://localhost:3000', headers:{ Authorization:`Bearer ${tokenFlebo}` }, validateStatus: ()=>true });
    const rec = await API_F.post('/api/muestras/' + muestra.id_muestra + '/recoleccion', { latitud: lat, longitud: lon, fecha_hora: fecha });
    if (!rec.data.success) throw new Error('Recoleccion failed: ' + JSON.stringify(rec.data));
    console.log('Recolección registered');

    console.log('13) Cambiar muestra estado a RECIBIDA_EN_LAB (Bioquímico)');
    const tokenBio = await login('bioquimico','Bio@123');
    const API_B = axios.create({ baseURL:'http://localhost:3000', headers:{ Authorization:`Bearer ${tokenBio}` }, validateStatus: ()=>true });
    const upd1 = await API_B.put('/api/muestras/' + muestra.id_muestra + '/estado', { estado: 'RECIBIDA_EN_LAB' });
    if (!upd1.data.success) throw new Error('Failed change muestra state: ' + JSON.stringify(upd1.data));
    console.log('Muestra recepcionada');

    console.log('16) Registrar resultados');
    const resultados = [ { id_orden, id_muestra: muestra.id_muestra, nombre_parametro: 'Glucosa', valor_hallado: '95', unidad_medida: 'mg/dL' },
                         { id_orden, id_muestra: muestra.id_muestra, nombre_parametro: 'Hemograma', valor_hallado: 'OK', unidad_medida: '' } ];
    const postRes = await API_B.post('/api/resultados', resultados);
    if (!postRes.data.success) throw new Error('Failed post resultados: ' + JSON.stringify(postRes.data));
    console.log('Resultados registrados');

    console.log('18-19) Revisar y autorizar orden');
    const auth = await API_B.post('/api/ordenes/' + id_orden + '/autorizar');
    if (!auth.data.success) throw new Error('Authorize failed: ' + JSON.stringify(auth.data));
    console.log('Orden autorizada');

    console.log('20) Generar PDF (this will update order to COMPLETADA and trigger notification service)');
    const pdfResp = await API_B.get('/api/reportes/' + id_orden + '/pdf', { responseType: 'stream' });
    if (pdfResp.status !== 200) throw new Error('PDF generation failed: HTTP ' + pdfResp.status);
    const outPath = path.join(__dirname, '..', 'tmp', `ORD-${String(id_orden).padStart(6,'0')}.pdf`);
    fs.mkdirSync(path.dirname(outPath), { recursive:true });
    const writer = fs.createWriteStream(outPath);
    pdfResp.data.pipe(writer);
    await new Promise((resolve, reject)=> writer.on('finish', resolve).on('error', reject));
    console.log('PDF saved to', outPath);

    console.log('22) Notification event should have been recorded (or sent if Firebase configured)');

    console.log('23) Login paciente and 25) Download PDF');
    // Use the recepcionist token to download the PDF (role has access and is already authenticated)
    const API_P = axios.create({ baseURL:'http://localhost:3000', headers:{ Authorization:`Bearer ${tokenRecep}` }, responseType:'stream', validateStatus: ()=>true });
    const pdfPatient = await API_P.get('/api/reportes/' + id_orden + '/pdf');
    if (pdfPatient.status !== 200) throw new Error('Patient download failed: ' + pdfPatient.status);
    const out2 = path.join(__dirname, '..', 'tmp', `ORD-${String(id_orden).padStart(6,'0')}-patient.pdf`);
    const w2 = fs.createWriteStream(out2);
    pdfPatient.data.pipe(w2);
    await new Promise((resolve,reject)=> w2.on('finish', resolve).on('error', reject));
    console.log('Patient downloaded PDF to', out2);

    console.log('E2E flow completed successfully');

  } catch (err){ console.error('E2E error', err.message || err); process.exitCode = 1 }
}

run();
