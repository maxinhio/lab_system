# Arquitectura técnica (resumen)

Componentes

- **Backend**: Express.js app (`backend/src`) con capas MVC: `models/`, `controllers/`, `routes/`. MySQL como almacenamiento.
- **Frontend**: React (Vite) en `frontend/` con rutas protegidas y llamadas al API.
- **Mobile**: Android (Kotlin) scaffold en `android/` con Retrofit para llamadas a la API.
- **Notificaciones**: `firebase-admin` en backend (opcional). Tokens guardados en `device_tokens`.
- **Generación de PDF**: `pdfkit` genera el informe en `backend/uploads/reports`.
- **QR**: `qrcode` genera códigos asociados a `muestras`.

Flujo de datos (alto nivel)
1. Recepción crea `orden` y `muestra` -> se genera `codigo_qr`.
2. Flebotomista escanea QR, registra GPS y cambia estado de la muestra.
3. Bioquímico ingresa resultados -> auditoría en `historial_resultados` si hay cambios.
4. Autorización por rol correspondiente.
5. Generación de PDF y actualización de `ordenes_analisis.url_pdf_informe`.
6. Servicio de notificaciones registra evento y, si está configurado, envía FCM.

Seguridad
- Autenticación JWT, tokens revocables (blacklist). Usar HTTPS en producción.
- Controles de autorización por rol y verificación de propiedad para pacientes.
