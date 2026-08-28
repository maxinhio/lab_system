# LABEXPRESS-LIS — Test Plan

Propósito
- Documentar y coordinar pruebas manuales y automatizadas para validar autenticación, autorización, integridad de datos, generación de PDFs, QR/GPS, pagos y notificaciones FCM.

Alcance
- Backend (API REST), Base de datos MySQL, Frontend (React), Android client (token FCM), PDF generation, QR flow, GPS capture.

Entorno de pruebas
- Backend corriendo en `http://localhost:3000` con una base de datos de pruebas.
- Variables de entorno: `backend/.env` (no incluir secretos en VCS). Para pruebas FCM opcional: `FIREBASE_SERVICE_ACCOUNT_JSON` o `FIREBASE_SERVICE_ACCOUNT_PATH`.
- Usuarios demo requeridos: `recepcion/Recep@123`, `flebotomista/Flebo@123`, `bioquimico/Bio@123`, `paciente/Patient@123`, `administrador/Admin@123`.

Herramientas
- Node.js (para scripts y pruebas manuales), MySQL client, Postman/HTTP client, Android emulator/device.

Datos y limpieza
- Mantener una copia separada de la BD de pruebas. Restaurar `schema.sql` y seeds antes de ejecución completa.

Plan de ejecución
1. Preparar entorno (levantar backend y DB, configurar env).
2. Ejecutar tests unitarios (si existen) y el script E2E: `node backend/tools/e2e_test.js`.
3. Ejecutar manualmente casos críticos en `test-cases.md` y registrar en `test-results.md`.

Entradas/Salidas
- Entradas: credenciales, datos de paciente, IDs de exámenes.
- Salidas: pdfs en `backend/uploads/reports`, registros en tablas `notification_events`, `historial_resultados`.

Riesgos y notas
- No ejecutar contra BD de producción.
- Si Firebase no está configurado, los eventos se registran pero no se envían push (comportamiento esperado).
