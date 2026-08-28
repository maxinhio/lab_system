const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const pool = require('../config/db');
const { success, error } = require('../utils/response');

async function generarPdf(req, res, next) {
  try {
    const id = parseInt(req.params.ordenId,10);
    if (isNaN(id)) return error(res, 'ID inválido', [], 400);
    // fetch order and patient
    const [oRows] = await pool.execute('SELECT o.*, p.nombres, p.apellidos, p.numero_documento FROM ordenes_analisis o JOIN pacientes p ON o.id_paciente = p.id_paciente WHERE o.id_orden = ? LIMIT 1', [id]);
    const orden = oRows[0];
    if (!orden) return error(res, 'Orden no encontrada', [], 404);
    // security: allow staff roles or patient owner
    const user = req.user || {};
    let userRecord = null;
    if (user.id_usuario) {
      const [uRows] = await pool.execute('SELECT id_usuario,id_paciente,id_rol FROM usuarios WHERE id_usuario = ? LIMIT 1',[user.id_usuario]);
      userRecord = uRows[0] || null;
    }
    const normalize = s => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
    const isStaff = user && user.rol && ['Administrador','Bioquímico','Analista','Recepcionista'].map(a=>normalize(a)).includes(normalize(user.rol));
    const isPatientOwner = userRecord && userRecord.id_paciente && userRecord.id_paciente === orden.id_paciente;
    if (!isStaff && !isPatientOwner) return error(res, 'No autorizado para descargar este informe', [], 403);
    // fetch resultados
    const [resRows] = await pool.execute('SELECT r.*, m.codigo_qr FROM resultados_detalle r LEFT JOIN muestras m ON r.id_muestra = m.id_muestra WHERE r.id_orden = ?', [id]);
    if (!resRows || resRows.length === 0) return error(res, 'No hay resultados para generar informe', [], 422);
    // prepare folder
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'reports');
    fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `ORD-${String(id).padStart(6,'0')}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    // create PDF
    const doc = new PDFDocument({ size: 'A4', margin:50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.fontSize(20).text('LABEXPRESS-LIS', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Número de orden: ${orden.id_orden}`);
    doc.text(`Paciente: ${orden.nombres} ${orden.apellidos} (Documento: ${orden.numero_documento})`);
    doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.fontSize(14).text('Resultados', { underline: true });
    doc.moveDown(0.5);

    // table-like layout
    resRows.forEach(r => {
      doc.fontSize(11).text(`${r.nombre_parametro}: ${r.valor_hallado} ${r.unidad_medida || ''}`);
      doc.text(`Muestra: ${r.codigo_qr || '-'}  Profesional ID: ${r.id_bioquimico || '-'}  Fecha registro: ${new Date(r.fecha_registro).toLocaleString()}`);
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc.text(`Fecha de autorización: ${new Date().toLocaleString()}`);
    doc.text(`Identificador del informe: ${filename}`);
    doc.end();

    stream.on('finish', async () => {
      // save path in ordenes_analisis
      const relPath = `uploads/reports/${filename}`;
      await pool.execute('UPDATE ordenes_analisis SET url_pdf_informe = ?, estado_orden = ? WHERE id_orden = ?', [relPath, 'COMPLETADA', id]);
      // trigger notification (non-blocking handled inside service)
      try {
        const notifService = require('../services/notificationService');
        notifService.notifyOrderCompleted(id, orden.id_paciente).catch(e=> console.error('notifyOrderCompleted err', e));
      } catch (e) { console.error('Notification service error', e); }
      return res.download(filepath, filename);
    });

    stream.on('error', (err)=> { next(err); });
  } catch (err) { next(err); }
}

module.exports = { generarPdf };
