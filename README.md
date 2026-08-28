# LABEXPRESS-LIS

Laboratory Information System (LIS) lightweight for clinical labs. This repository contains a Node.js + MySQL backend, a React frontend, and an Android client scaffold. It supports patient management, orders, samples, results, PDF reports, QR sample labeling, GPS capture for collection, and Firebase Cloud Messaging notifications.

Features
- Patient registration and management
- Order creation and payment
- Sample tracking with QR codes and GPS
- Results entry, audit trail and authorization workflow
- PDF report generation and secure download
- Firebase Cloud Messaging notifications for patients
- Administrative modules: equipment, reagents, lots, alerts

Architecture
- Backend: Express.js + MySQL (REST API)
- Frontend: React + Vite
- Mobile: Android (Kotlin) scaffold
- Notifications: Firebase Cloud Messaging (server-side `firebase-admin` optional)
- PDF: `pdfkit` generated server-side
- QR: `qrcode` generated server-side

Repository structure (top-level)
- `backend/` — Express app, models, controllers, routes, database schema
- `frontend/` — React app
- `android/` — Android scaffold (Kotlin)
- `docs/` — project documentation (API, database, testing)

Quick Links
- Installation & setup: `docs/installation.md`
- API documentation: `docs/api/endpoints.md`
- Database model: `docs/database/schema.md`
- Testing: `docs/testing/test-plan.md`

Support
- See `README-E2E.md` in `backend/tools` for the E2E test runner.
# LABEXPRESS-LIS

Proyecto académico: LABEXPRESS-LIS — Laboratory Information System (esqueleto inicial).

Fase 1: estructura del proyecto, archivos iniciales y documentación básica.

Siguientes pasos:
- Revisar la estructura creada.
- Configurar `.env` en `backend/`.
- Crear la base de datos y ejecutar `backend/database/schema.sql` y `seed.sql`.
- Confirmar para proceder a la Fase 2 (desarrollo de BD y backend).
